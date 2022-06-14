/* eslint-disable no-restricted-globals */
import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { SignatureLike } from '@ethersproject/bytes';
import { hexlify, arrayify } from '@ethersproject/bytes';
import type { HDNode } from '@ethersproject/hdnode';
import { toUtf8Bytes } from '@ethersproject/strings';
import type { UnsignedTransaction } from '@ethersproject/transactions';
import { serialize as serializeTransaction } from '@ethersproject/transactions';
import crypto from 'crypto';
import { Client, Constants, Utils } from 'gridplus-sdk';

import type { DerivationPath } from '../../dpaths';
import type { DeterministicAddress, TAddress } from '../../types';
import { WalletsError, WalletsErrorCode } from '../../types';
import {
  addHexPrefix,
  getFullPath,
  safeJSONParse,
  sanitizeTx,
  toChecksumAddress,
  keys,
  getConvertedPath
} from '../../utils';
import type { Wallet } from '../../wallet';
import { wrapGridPlusError } from './errors';
import { HardwareWallet } from './hardware-wallet';

const POPUP_BASE_URL = 'https://wallet.gridplus.io';

export interface GridPlusConfiguration extends GridPlusCredentials {
  // For client
  name: string;
}

export interface GridPlusCredentials {
  deviceID?: string;
  password?: string;
}

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

const getClient = async (
  config: GridPlusConfiguration,
  client?: Client
): Promise<{ config: GridPlusConfiguration; client: Client }> => {
  if (client?.isPaired && client?.getActiveWallet() !== null) {
    return { client, config };
  }

  const { deviceID, password, ...clientConfig } = config;

  if (client === undefined && deviceID !== undefined && password !== undefined) {
    const privKey = getPrivateKey(config);
    client = new Client({ ...clientConfig, privKey });
  }

  if (client && deviceID !== undefined && password !== undefined) {
    const isPaired = await client.connect(deviceID).catch(wrapGridPlusError);
    if (isPaired) {
      return { client, config };
    } else {
      // Hack to dismiss pairing screen
      await client.pair('').catch(() => null);
    }
  }

  const result = await waitForPairing(config);
  return getClient({ ...clientConfig, ...result }, client);
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async buildSigningRequest(
    fwVersion: {
      fix: number;
      minor: number;
      major: number;
    } | null,
    type: number | null | undefined,
    transaction: UnsignedTransaction
  ) {
    if (fwVersion && (fwVersion.major > 0 || fwVersion.minor >= 15)) {
      const payload = Buffer.from(arrayify(serializeTransaction({ ...transaction, type })));

      const to = transaction.to?.toString() ?? '';

      const callDataDecoder =
        to !== null || to !== undefined
          ? await Utils.fetchCalldataDecoder(
              transaction.data?.toString() ?? '',
              to,
              transaction.chainId!
            )
          : undefined;

      return {
        data: {
          payload,
          curveType: Constants.SIGNING.CURVES.SECP256K1,
          hashType: Constants.SIGNING.HASHES.KECCAK256,
          encodingType: Constants.SIGNING.ENCODINGS.EVM,
          signerPath: getConvertedPath(this.path),
          decoder: callDataDecoder?.def
        }
      };
    }

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

    return {
      currency: 'ETH',
      data: {
        ...hexlified,
        ...(accessList ? { accessList } : {}),
        signerPath: getConvertedPath(this.path)
      }
    };
  }

  async signTransaction(rawTx: TransactionRequest): Promise<string> {
    const { type, ...transaction } = sanitizeTx(rawTx);

    if (transaction.chainId === undefined || transaction.nonce === undefined) {
      throw new WalletsError(
        'Missing chainId or nonce on transaction',
        WalletsErrorCode.MISSING_ARGUMENTS
      );
    }

    const client = await this.getClient();
    const fwVersion = client.getFwVersion();

    const request = await this.buildSigningRequest(fwVersion, type, transaction);

    // @ts-expect-error Type is wrong, currency is not required
    const result = await client.sign(request).catch(wrapGridPlusError);
    const signature: SignatureLike = {
      // 0 is returned as an empty buffer
      v: result.sig!.v.length === 0 ? 0 : parseInt(result.sig!.v.toString('hex'), 16),
      r: addHexPrefix(result.sig!.r.toString('hex')),
      s: addHexPrefix(result.sig!.s.toString('hex'))
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

    const result = await client
      .sign({
        currency: 'ETH_MSG',
        data
      })
      .catch(wrapGridPlusError);

    return addHexPrefix(
      result.sig!.r.toString('hex') + result.sig!.s.toString('hex') + result.sig!.v.toString('hex')
    );
  }

  async getAddress(): Promise<TAddress> {
    if (!this.address) {
      const client = await this.getClient();
      const addresses = ((await client
        .getAddresses({
          startPath: getConvertedPath(this.path),
          n: 1
        })
        .catch(wrapGridPlusError)) as unknown) as string[];

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
    const dPath = getFullPath(path, offset);
    const addresses = ((await client
      .getAddresses({
        startPath: getConvertedPath(dPath),
        n: limit
      })
      .catch(wrapGridPlusError)) as unknown) as string[];

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
