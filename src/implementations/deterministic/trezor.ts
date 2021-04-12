import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import type { SignatureLike } from '@ethersproject/bytes';
import { serialize as serializeTransaction } from '@ethersproject/transactions';
import TrezorConnect from 'trezor-connect';

import type { DerivationPath } from '@dpaths';
import type { TAddress } from '@types';
import { getFullPath, sanitizeTx } from '@utils';
import type { Wallet } from '@wallet';

import { HardwareWallet } from './hardware-wallet';

class TrezorWalletInstance implements Wallet {
  constructor(private readonly path: string) {}

  async signTransaction(rawTx: TransactionRequest): Promise<string> {
    const transaction = sanitizeTx(rawTx);

    if (transaction.chainId === undefined || transaction.nonce === undefined) {
      throw new Error('Missing chainId or nonce on transaction');
    }

    const result = await TrezorConnect.ethereumSignTransaction({ path: this.path, transaction });
    if (!result.success) {
      throw Error(result.payload.error);
    }
    if (parseInt(result.payload.v, 16) <= 1) {
      //  for larger chainId, only signature_v returned. simply recalc signature_v
      result.payload.v = BigNumber.from(result.payload.v)
        .add(2 * transaction.chainId + 35)
        .toHexString();
    }

    const signature: SignatureLike = {
      v: parseInt(result.payload.v, 16),
      r: result.payload.r,
      s: result.payload.s
    };

    return serializeTransaction(transaction, signature);
  }
  async getAddress(): Promise<TAddress> {
    const result = await TrezorConnect.ethereumGetAddress({ path: this.path });
    if (!result.success) {
      throw Error(result.payload.error);
    }
    return result.payload.address as TAddress;
  }
  getPrivateKey(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

export class TrezorWallet extends HardwareWallet {
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

  async getWallet(path: DerivationPath, index: number): Promise<Wallet> {
    return new TrezorWalletInstance(getFullPath(path, index));
  }
}
