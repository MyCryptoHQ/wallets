import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { SignatureLike } from '@ethersproject/bytes';
import { hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import { serialize as serializeTransaction } from '@ethersproject/transactions';
import crypto from 'crypto';
import { Client } from 'gridplus-sdk';
import { promisify } from 'util';

import type { DerivationPath } from '../../dpaths';
import type { TAddress } from '../../types';
import { WalletsError, WalletsErrorCode } from '../../types';
import { addHexPrefix, getFullPath, sanitizeTx, stripHexPrefix } from '../../utils';
import type { Wallet } from '../../wallet';
import { HardwareWallet } from './hardware-wallet';

const HARDENED_OFFSET = 0x80000000;

// @todo Handle conection & pairing
// @todo Figure out how to fetch addresses properly

export class GridPlusWalletInstance implements Wallet {
  constructor(
    private readonly client: Client,
    private readonly path: string,
    private address?: TAddress
  ) {}

  private getConvertedPath = () => {
    const array = this.path.split('/').slice(1);
    return array.map((a) => {
      const isHardened = a.includes("'");
      const offset = isHardened ? HARDENED_OFFSET : 0;
      const sliced = isHardened ? a.slice(0, a.length - 1) : a;
      return offset + parseInt(sliced);
    });
  };

  async signTransaction(rawTx: TransactionRequest): Promise<string> {
    const transaction = sanitizeTx(rawTx);

    if (transaction.chainId === undefined || transaction.nonce === undefined) {
      throw new WalletsError(
        'Missing chainId or nonce on transaction',
        WalletsErrorCode.MISSING_ARGUMENTS
      );
    }

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
    const sign = promisify(this.client.sign).bind(this.client);

    const signed = await sign({
      currency: 'ETH_MSG',
      data
    });

    return addHexPrefix(signed.r + signed.s + signed.v.toString(16));
  }

  async getAddress(): Promise<TAddress> {
    if (!this.address) {
      const addresses = promisify(this.client.addresses).bind(this.client);
      this.address = (await addresses({
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
  private client?: Client;

  constructor(config: { name: string; privKey: string }) {
    super();
    this.client = new Client({ ...config, crypto });
  }

  async getAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const wallet = await this.getWallet(path, index);
    return wallet.getAddress();
  }

  async getExtendedKey(path: string): Promise<{ publicKey: string; chainCode: string }> {
    // @todo
    throw new Error('Method not implemented.');
  }

  async getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress> {
    // @todo Make sure this works?
    return this.getAddress(path, index);
  }

  async getWallet(path: DerivationPath, index: number, address?: TAddress): Promise<Wallet> {
    return new GridPlusWalletInstance(this.client, getFullPath(path, index), address);
  }
}
