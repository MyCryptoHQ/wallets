import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import type { UnsignedTransaction } from '@ethersproject/transactions';

export const sanitizeTx = (tx: TransactionRequest): UnsignedTransaction => ({
  ...tx,
  nonce: tx.nonce !== undefined ? BigNumber.from(tx.nonce).toNumber() : undefined
});
