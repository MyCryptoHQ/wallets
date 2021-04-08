import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { Wallet as EthersWallet } from '@ethersproject/wallet';

import type { TAddress } from '@types';
import { addHexPrefix } from '@utils';
import type { Wallet } from '@wallet';


export class PrivateKey implements Wallet {
  constructor(private readonly privateKey: string) {}

  signTransaction(transaction: TransactionRequest): Promise<string> {
    const wallet = new EthersWallet(addHexPrefix(this.privateKey));
    return wallet.signTransaction(transaction);
  }

  async getAddress(): Promise<TAddress> {
    const wallet = new EthersWallet(addHexPrefix(this.privateKey));
    return (await wallet.getAddress()) as TAddress;
  }

  async getPrivateKey(): Promise<string> {
    return this.privateKey;
  }
}
