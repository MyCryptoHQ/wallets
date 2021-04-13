import type { TransactionRequest } from '@ethersproject/abstract-provider';

import type { TAddress } from './types';

export interface Wallet {
  signTransaction(transaction: TransactionRequest): Promise<string>;
  getAddress(): Promise<TAddress>;
  getPrivateKey(): Promise<string>;
  // signMessage(): Promise<string>;
}
