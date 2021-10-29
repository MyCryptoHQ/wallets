/* eslint-disable no-restricted-globals */
import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { SignatureLike } from '@ethersproject/bytes';
import { hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import { serialize as serializeTransaction } from '@ethersproject/transactions';
import crypto from 'crypto';
// @ts-expect-error No types right now
import { Client } from 'gridplus-sdk';
import { promisify } from 'util';

import type { DerivationPath } from '../../dpaths';
import type { TAddress } from '../../types';
import { WalletsError, WalletsErrorCode } from '../../types';
import { addHexPrefix, getFullPath, sanitizeTx, stripHexPrefix } from '../../utils';
import type { Wallet } from '../../wallet';
import { HardwareWallet } from './hardware-wallet';

const HARDENED_OFFSET = 0x80000000;

export interface GridPlusConfiguration {
  // For client
  name: string;

  // Identifying the device
  deviceID?: string;
  password?: string;
}

// @todo Handle conection & pairing
// @todo Figure out how to fetch addresses properly

const getPrivateKey = (config: GridPlusConfiguration) => {
  const buf = Buffer.concat([
    Buffer.from(config.password!),
    Buffer.from(config.deviceID!),
    Buffer.from(config.name)
  ]);
  return crypto.createHash('sha256').update(buf).digest();
};

const waitForPairing = (config: GridPlusConfiguration) => {
  return new Promise((resolve, reject) => {
    const baseURL = 'https://wallet.gridplus.io';
    const url = `${baseURL}?keyring=${config.name}`;

    const popup = window.open(url)!;
    popup.postMessage('GET_LATTICE_CREDS', baseURL);

    // PostMessage handler
    function receiveMessage(event: any) {
      // Ensure origin
      if (event.origin !== baseURL) {
        return;
      }
      // Parse response data
      try {
        const data = JSON.parse(event.data);
        if (!data.deviceID || !data.password) {
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
  if (config.deviceID !== undefined && config.password !== undefined) {
    const connect = promisify(client.connect).bind(client);

    const isPaired: boolean = await connect(config.deviceID);
    if (isPaired) {
      return;
    }
  }

  // @todo Pairing?
  return waitForPairing(config);
};

export class GridPlusWalletInstance implements Wallet {
  constructor(
    private readonly config: GridPlusConfiguration,
    private readonly client: Client,
    private readonly path: string,
    private address?: TAddress
  ) {}

  private getConvertedPath() {
    const array = this.path.split('/').slice(1);
    return array.map((a) => {
      const isHardened = a.includes("'");
      const offset = isHardened ? HARDENED_OFFSET : 0;
      const sliced = isHardened ? a.slice(0, a.length - 1) : a;
      return offset + parseInt(sliced);
    });
  }

  async signTransaction(rawTx: TransactionRequest): Promise<string> {
    const transaction = sanitizeTx(rawTx);

    if (transaction.chainId === undefined || transaction.nonce === undefined) {
      throw new WalletsError(
        'Missing chainId or nonce on transaction',
        WalletsErrorCode.MISSING_ARGUMENTS
      );
    }

    await ensureConnection(this.client, this.config);

    const sign = promisify(this.client.sign).bind(this.client);

    // @todo Hexlify all values
    const result = await sign({
      currency: 'ETH',
      data: {
        ...transaction,
        nonce: addHexPrefix(transaction.nonce.toString(16)),
        signerPath: this.getConvertedPath()
      }
    });

    const signature: SignatureLike = {
      v: parseInt(result.sig.v, 16),
      r: result.sig.r,
      s: result.sig.s
    };

    return serializeTransaction(transaction, signature);
  }

  async signMessage(message: string): Promise<string> {
    const bytes = toUtf8Bytes(message);
    const msgHex = stripHexPrefix(hexlify(bytes));

    const data = {
      protocol: 'signPersonal',
      payload: msgHex,
      signerPath: this.getConvertedPath()
    };

    await ensureConnection(this.client, this.config);

    const sign = promisify(this.client.sign).bind(this.client);

    const signed = await sign({
      currency: 'ETH_MSG',
      data
    });

    return addHexPrefix(signed.r + signed.s + signed.v.toString(16));
  }

  async getAddress(): Promise<TAddress> {
    if (!this.address) {
      await ensureConnection(this.client, this.config);
      const getAddresses = promisify(this.client.getAddresses).bind(this.client);
      this.address = (await getAddresses({
        startPath: this.getConvertedPath(),
        n: 1,
        skipCache: true
      })) as TAddress;
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

  async getClient(): Promise<Client> {
    const { deviceID, password, ...clientConfig } = this.config;
    if (deviceID === undefined || password === undefined) {
      const result: any = await waitForPairing(this.config);
      this.config = { ...this.config, ...result };
    }
    const privKey = getPrivateKey(this.config);
    return new Client({ ...clientConfig, privKey, crypto });
  }

  async getAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const wallet = await this.getWallet(path, index);
    return wallet.getAddress();
  }

  async getExtendedKey(_path: string): Promise<{ publicKey: string; chainCode: string }> {
    // @todo
    throw new Error('Method not implemented.');
  }

  async getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress> {
    // @todo Make sure this works?
    return this.getAddress(path, index);
  }

  async getWallet(path: DerivationPath, index: number, address?: TAddress): Promise<Wallet> {
    const client = await this.getClient();
    return new GridPlusWalletInstance(this.config, client, getFullPath(path, index), address);
  }
}
