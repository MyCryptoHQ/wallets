/* eslint-disable no-restricted-globals */
import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { SignatureLike } from '@ethersproject/bytes';
import { hexlify } from '@ethersproject/bytes';
import type { HDNode } from '@ethersproject/hdnode';
import { toUtf8Bytes } from '@ethersproject/strings';
import type { UnsignedTransaction } from '@ethersproject/transactions';
import { serialize as serializeTransaction } from '@ethersproject/transactions';
import crypto from 'crypto';
import { Client } from 'gridplus-sdk';
import { promisify } from 'util';

import type { DerivationPath } from '../../dpaths';
import type { DeterministicAddress, TAddress } from '../../types';
import { WalletsError, WalletsErrorCode } from '../../types';
import {
  addHexPrefix,
  getFullPath,
  safeJSONParse,
  sanitizeTx,
  toChecksumAddress,
  keys
} from '../../utils';
import type { Wallet } from '../../wallet';
import { wrapGridPlusError } from './errors';
import { HardwareWallet } from './hardware-wallet';

const HARDENED_OFFSET = 0x80000000;
const POPUP_BASE_URL = 'https://wallet.gridplus.io';

export interface GridPlusConfiguration extends GridPlusCredentials {
  // For client
  name: string;
}

export interface GridPlusCredentials {
  deviceID?: string;
  password?: string;
}

// @todo Cleanup / polish

const getPrivateKey = (config: GridPlusConfiguration) => {
  const buf = Buffer.concat([
    Buffer.from(config.password!),
    Buffer.from(config.deviceID!),
    Buffer.from(config.name)
  ]);
  return crypto.createHash('sha256').update(buf).digest();
};

const waitForPairing = (config: GridPlusConfiguration): Promise<GridPlusCredentials> => {
  return new Promise((resolve, reject) => {
    const baseURL = POPUP_BASE_URL;
    const url = `${baseURL}?keyring=${config.name}`;

    const popup = window.open(url);
    if (popup === null) {
      throw new WalletsError('Popup blocked', WalletsErrorCode.HW_POPUP_BLOCKED);
    }
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        reject(new WalletsError('Popup closed', WalletsErrorCode.CANCELLED));
      }
    }, 1000);
    popup.postMessage('GET_LATTICE_CREDS', baseURL);

    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== baseURL) {
        return;
      }
      const [err, data] = safeJSONParse<GridPlusCredentials>(event.data);
      if (err !== null) {
        return reject(err);
      }
      if (data?.deviceID === undefined || data?.password === undefined) {
        return reject(Error('Invalid credentials returned from Lattice.'));
      }
      return resolve(data);
    };
    window.addEventListener('message', receiveMessage, false);
  });
};

const getClient = async (config: GridPlusConfiguration, client?: Client) => {
  if (client?.isPaired && client?.hasActiveWallet()) {
    return { client, config };
  }

  const { deviceID, password, ...clientConfig } = config;
  if (client && deviceID !== undefined && password !== undefined) {
    const connect = promisify(client.connect).bind(client);

    const isPaired = await connect(deviceID);
    if (isPaired) {
      return { client, config };
    }
  } else if (deviceID === undefined || password === undefined) {
    const result = await waitForPairing(config);
    config = { ...config, ...result };
  }

  if (client === undefined) {
    const privKey = getPrivateKey(config);
    client = new Client({ ...clientConfig, privKey, crypto });
  }

  return { client, config };
};

const getConvertedPath = (path: string) => {
  const array = path.split('/').slice(1);
  return array.map((a) => {
    const isHardened = a.includes("'");
    const offset = isHardened ? HARDENED_OFFSET : 0;
    const sliced = isHardened ? a.slice(0, -1) : a;
    return offset + parseInt(sliced, 10);
  });
};

export class GridPlusWalletInstance implements Wallet {
  constructor(
    private config: GridPlusConfiguration,
    private client: Client,
    private readonly path: string,
    private address?: TAddress
  ) {}

  async getClient(): Promise<Client> {
    const { client, config } = await getClient(this.config, this.client);
    this.client = client;
    this.config = config;
    return this.client;
  }

  async signTransaction(rawTx: TransactionRequest): Promise<string> {
    const { type, ...transaction } = sanitizeTx(rawTx);

    if (transaction.chainId === undefined || transaction.nonce === undefined) {
      throw new WalletsError(
        'Missing chainId or nonce on transaction',
        WalletsErrorCode.MISSING_ARGUMENTS
      );
    }

    this.client = await this.getClient();

    const sign = promisify(this.client.sign).bind(this.client);

    const { accessList, ...preHexTx } = transaction;

    const hexlified = keys<Omit<UnsignedTransaction, 'type' | 'accessList'>>(preHexTx).reduce(
      (acc, cur) => {
        const value = preHexTx[cur];
        return value === undefined
          ? acc
          : { ...acc, [cur]: addHexPrefix(hexlify(value, { hexPad: 'left' })) };
      },
      {}
    );

    const result = await sign({
      currency: 'ETH',
      data: {
        ...hexlified,
        ...(accessList ? { accessList } : {}),
        type,
        signerPath: getConvertedPath(this.path)
      }
    }).catch(wrapGridPlusError);

    const signature: SignatureLike = {
      // @todo Make sure this works for high chain id networks
      // 0 is returned as an empty buffer
      v: result.sig.v.length === 0 ? 0 : parseInt(result.sig.v.toString('hex'), 16),
      r: addHexPrefix(result.sig.r),
      s: addHexPrefix(result.sig.s)
    };

    return serializeTransaction({ ...transaction, type }, signature);
  }

  async signMessage(message: string): Promise<string> {
    const bytes = toUtf8Bytes(message);
    const msgHex = hexlify(bytes);

    const data = {
      protocol: 'signPersonal',
      payload: msgHex,
      signerPath: getConvertedPath(this.path)
    };

    const client = await this.getClient();

    const sign = promisify(client.sign).bind(client);

    const result = await sign({
      currency: 'ETH_MSG',
      data
    }).catch(wrapGridPlusError);

    return addHexPrefix(result.sig.r + result.sig.s + result.sig.v.toString('hex'));
  }

  async getAddress(): Promise<TAddress> {
    if (!this.address) {
      const client = await this.getClient();
      const getAddresses = promisify(client.getAddresses).bind(client);
      const addresses = await getAddresses({
        startPath: getConvertedPath(this.path),
        n: 1,
        skipCache: true
      }).catch(wrapGridPlusError);

      this.address = addresses[0] as TAddress;
    }
    return this.address;
  }

  async getPrivateKey(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

export class GridPlusWallet extends HardwareWallet {
  constructor(private config: GridPlusConfiguration) {
    super();
  }

  private client?: Client;

  async getClient(): Promise<Client> {
    const { client, config } = await getClient(this.config, this.client);
    this.client = client;
    this.config = config;
    return this.client;
  }

  async getAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const wallet = await this.getWallet(path, index);
    return wallet.getAddress();
  }

  async getExtendedKey(_path: string): Promise<{ publicKey: string; chainCode: string }> {
    throw new Error('Method not implemented.');
  }

  async getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress> {
    return this.getAddress(path, index);
  }

  // Manually scan for addresses since extended key information is not available currently
  async getAddresses({
    path,
    limit,
    offset = 0,
    node
  }: {
    path: DerivationPath;
    limit: number;
    offset?: number;
    node?: HDNode;
  }): Promise<DeterministicAddress[]> {
    if (path.isHardened) {
      return super.getAddresses({ path, limit, offset, node }).catch(wrapGridPlusError);
    }

    const client = await this.getClient();
    const getAddresses = promisify(client.getAddresses).bind(client);
    const dPath = getFullPath(path, offset);
    const addresses: string[] = await getAddresses({
      startPath: getConvertedPath(dPath),
      n: limit,
      skipCache: true
    }).catch(wrapGridPlusError);

    return addresses.map((address, i) => {
      const index = offset + i;
      return {
        address: toChecksumAddress(address) as TAddress,
        index,
        dPath: getFullPath(path, index),
        dPathInfo: path
      };
    });
  }

  async getWallet(path: DerivationPath, index: number, address?: TAddress): Promise<Wallet> {
    const client = await this.getClient();
    return new GridPlusWalletInstance(this.config, client, getFullPath(path, index), address);
  }

  getCredentials(): GridPlusCredentials {
    return { deviceID: this.config.deviceID, password: this.config.password };
  }
}
