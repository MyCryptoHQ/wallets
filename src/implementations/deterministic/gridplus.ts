/* eslint-disable no-restricted-globals */
import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { SignatureLike } from '@ethersproject/bytes';
import { hexlify } from '@ethersproject/bytes';
import type { HDNode } from '@ethersproject/hdnode';
import { toUtf8Bytes } from '@ethersproject/strings';
import { serialize as serializeTransaction } from '@ethersproject/transactions';
import crypto from 'crypto';
import { Client } from 'gridplus-sdk';
import { promisify } from 'util';

import type { DerivationPath } from '../../dpaths';
import type { DeterministicAddress, TAddress } from '../../types';
import { WalletsError, WalletsErrorCode } from '../../types';
import { addHexPrefix, getFullPath, sanitizeTx, toChecksumAddress } from '../../utils';
import type { Wallet } from '../../wallet';
import { wrapGridPlusError } from './errors';
import { HardwareWallet } from './hardware-wallet';

const HARDENED_OFFSET = 0x80000000;

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

// @todo Test!
const waitForPairing = (config: GridPlusConfiguration): Promise<GridPlusCredentials> => {
  return new Promise((resolve, reject) => {
    const baseURL = 'https://wallet.gridplus.io';
    const url = `${baseURL}?keyring=${config.name}`;

    const popup = window.open(url);
    if (popup === null) {
      throw new WalletsError('Popup blocked', WalletsErrorCode.HW_POPUP_BLOCKED);
    }
    popup.postMessage('GET_LATTICE_CREDS', baseURL);

    // PostMessage handler
    function receiveMessage(event: MessageEvent) {
      // Ensure origin
      if (event.origin !== baseURL) {
        return;
      }
      // Parse response data
      try {
        const data = JSON.parse(event.data);
        if (data.deviceID === undefined || data.password === undefined) {
          return reject(Error('Invalid credentials returned from Lattice.'));
        }
        return resolve(data);
      } catch (err) {
        return reject(err);
      }
    }
    window.addEventListener('message', receiveMessage, false);
  });
};

const ensureConnection = async (client: Client, config: GridPlusConfiguration) => {
  if (client.isPaired && client.hasActiveWallet()) {
    return;
  }

  if (config.deviceID !== undefined && config.password !== undefined) {
    const connect = promisify(client.connect).bind(client);

    const isPaired = await connect(config.deviceID);
    if (isPaired) {
      return;
    }
  }

  return waitForPairing(config);
};

const getConvertedPath = (path: string) => {
  const array = path.split('/').slice(1);
  return array.map((a) => {
    const isHardened = a.includes("'");
    const offset = isHardened ? HARDENED_OFFSET : 0;
    const sliced = isHardened ? a.slice(0, a.length - 1) : a;
    return offset + parseInt(sliced);
  });
};

export class GridPlusWalletInstance implements Wallet {
  constructor(
    private readonly config: GridPlusConfiguration,
    private readonly client: Client,
    private readonly path: string,
    private address?: TAddress
  ) {}

  async signTransaction(rawTx: TransactionRequest): Promise<string> {
    const { type, ...transaction } = sanitizeTx(rawTx);

    if (transaction.chainId === undefined || transaction.nonce === undefined) {
      throw new WalletsError(
        'Missing chainId or nonce on transaction',
        WalletsErrorCode.MISSING_ARGUMENTS
      );
    }

    await ensureConnection(this.client, this.config);

    const sign = promisify(this.client.sign).bind(this.client);

    const hexlified = Object.keys(transaction).reduce((acc, cur) => {
      // @ts-expect-error The linter doesn't like indexing via strings
      const value = transaction[cur];
      const hex = addHexPrefix(hexlify(value, { hexPad: 'left' }));
      return { ...acc, [cur]: hex };
    }, {});

    const result = await sign({
      currency: 'ETH',
      data: {
        ...hexlified,
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

    await ensureConnection(this.client, this.config);

    const sign = promisify(this.client.sign).bind(this.client);

    const result = await sign({
      currency: 'ETH_MSG',
      data
    }).catch(wrapGridPlusError);

    return addHexPrefix(result.sig.r + result.sig.s + result.sig.v.toString('hex'));
  }

  async getAddress(): Promise<TAddress> {
    if (!this.address) {
      await ensureConnection(this.client, this.config);
      const getAddresses = promisify(this.client.getAddresses).bind(this.client);
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
    const { deviceID, password, ...clientConfig } = this.config;
    if (deviceID === undefined || password === undefined) {
      const result = await waitForPairing(this.config);
      this.config = { ...this.config, ...result };
    }
    if (this.client === undefined) {
      const privKey = getPrivateKey(this.config);
      this.client = new Client({ ...clientConfig, privKey, crypto });
    }
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
    await ensureConnection(client, this.config);
    const getAddresses = promisify(client.getAddresses).bind(this.client);
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
