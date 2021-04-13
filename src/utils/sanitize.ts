import type { TransactionRequest } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import type { UnsignedTransaction } from '@ethersproject/transactions';

export const sanitizeTx = (tx: TransactionRequest): UnsignedTransaction => ({
  chainId: tx.chainId || undefined,
  data: tx.data || undefined,
  gasLimit: tx.gasLimit || undefined,
  gasPrice: tx.gasPrice || undefined,
  nonce: tx.nonce ? BigNumber.from(tx.nonce).toNumber() : undefined,
  to: tx.to || undefined,
  value: tx.value || undefined
});
