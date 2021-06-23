import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { SignatureLike } from '@ethersproject/bytes';
import { serialize as serializeTransaction } from '@ethersproject/transactions';
import type { EthereumTransaction, Manifest } from 'trezor-connect';
import TrezorConnect from 'trezor-connect';

import type { DerivationPath } from '../../dpaths';
import type { TAddress } from '../../types';
import { addHexPrefix, getFullPath, sanitizeTx } from '../../utils';
import type { Wallet } from '../../wallet';
import { HardwareWallet } from './hardware-wallet';

export class TrezorWalletInstance implements Wallet {
  constructor(private readonly path: string, private readonly address?: TAddress) {}

  async signTransaction(rawTx: TransactionRequest): Promise<string> {
    const transaction = sanitizeTx(rawTx);

    if (transaction.chainId === undefined || transaction.nonce === undefined) {
      throw new Error('Missing chainId or nonce on transaction');
    }

    const result = await TrezorConnect.ethereumSignTransaction({
      path: this.path,
      transaction: {
        ...transaction,
        nonce: addHexPrefix(transaction.nonce.toString(16))
      } as EthereumTransaction
    });
    if (!result.success) {
      throw Error(result.payload.error);
    }

    const signature: SignatureLike = {
      v: parseInt(result.payload.v, 16),
      r: result.payload.r,
      s: result.payload.s
    };

    return serializeTransaction(transaction, signature);
  }

  async signMessage(message: string): Promise<string> {
    const result = await TrezorConnect.ethereumSignMessage({
      message,
      path: this.path
    });

    if (!result.success) {
      throw Error(result.payload.error);
    }

    return result.payload.signature;
  }

  async getAddress(): Promise<TAddress> {
    if (this.address) {
      return this.address;
    }
    const result = await TrezorConnect.ethereumGetAddress({ path: this.path, showOnTrezor: false });
    if (!result.success) {
      throw Error(result.payload.error);
    }
    return result.payload.address as TAddress;
  }

  async getPrivateKey(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

export class TrezorWallet extends HardwareWallet {
  constructor(manifest: Manifest) {
    super();
    TrezorConnect.manifest(manifest);
  }

  async getAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const wallet = await this.getWallet(path, index);
    return wallet.getAddress();
  }

  async getExtendedKey(path: string): Promise<{ publicKey: string; chainCode: string }> {
    const result = await TrezorConnect.getPublicKey({ path });
    if (!result.success) {
      throw Error(result.payload.error);
    }

    return {
      publicKey: result.payload.publicKey,
      chainCode: result.payload.chainCode
    };
  }

  async getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const result = await TrezorConnect.ethereumGetAddress({ path: getFullPath(path, index) });
    if (!result.success) {
      throw Error(result.payload.error);
    }

    return result.payload.address as TAddress;
  }

  async getWallet(path: DerivationPath, index: number, address?: TAddress): Promise<Wallet> {
    return new TrezorWalletInstance(getFullPath(path, index), address);
  }
}
