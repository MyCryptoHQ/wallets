import { fTransactionRequest } from '../../.jest/__fixtures__';
import { sanitizeTx } from './sanitize';

describe('sanitize', () => {
  it('handles nonce of zero value', () => {
    expect(sanitizeTx({ ...fTransactionRequest, nonce: 0 })).toStrictEqual({
      chainId: 3,
      data: '0x',
      gasLimit: '0x5208',
      gasPrice: '0x012a05f200',
      nonce: 0,
      to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
      value: '0x2386f26fc10000'
    });
  });
});
