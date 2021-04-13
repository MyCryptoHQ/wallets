import { fAddress, fPrivateKey, fSignedTx, fTransactionRequest } from '../../../.jest/__fixtures__';
import { PrivateKey } from './private-key';

describe('Private Key', () => {
  it('signs transaction correctly', () => {
    return expect(new PrivateKey(fPrivateKey).signTransaction(fTransactionRequest)).resolves.toBe(
      fSignedTx
    );
  });

  it('derives address correctly', () => {
    return expect(new PrivateKey(fPrivateKey).getAddress()).resolves.toBe(fAddress);
  });

  it('returns its private key correctly', () => {
    return expect(new PrivateKey(fPrivateKey).getPrivateKey()).resolves.toBe(fPrivateKey);
  });
});
