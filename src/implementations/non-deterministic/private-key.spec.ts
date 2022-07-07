import {
  fAddress,
  fMessageToSign,
  fPrivateKey,
  fSignedMessage,
  fSignedTx,
  fSignedTxContractDeployment,
  fSignedTxEIP1559,
  fTransactionRequest,
  fTransactionRequestEIP1559,
  fTransactionRequestEIP1559ContractDeployment
} from '../../../.jest/__fixtures__';
import { PrivateKey } from './private-key';

describe('Private Key', () => {
  it('signs transaction correctly', () => {
    return expect(new PrivateKey(fPrivateKey).signTransaction(fTransactionRequest)).resolves.toBe(
      fSignedTx
    );
  });

  it('signs EIP 1559 transaction correctly', () => {
    return expect(
      new PrivateKey(fPrivateKey).signTransaction(fTransactionRequestEIP1559)
    ).resolves.toBe(fSignedTxEIP1559);
  });

  it('signs contract deployment transactions correctly', () => {
    return expect(
      new PrivateKey(fPrivateKey).signTransaction(fTransactionRequestEIP1559ContractDeployment)
    ).resolves.toBe(fSignedTxContractDeployment);
  });

  it('signs messages correctly', () => {
    return expect(new PrivateKey(fPrivateKey).signMessage(fMessageToSign)).resolves.toBe(
      fSignedMessage
    );
  });

  it('derives address correctly', () => {
    return expect(new PrivateKey(fPrivateKey).getAddress()).resolves.toBe(fAddress);
  });

  it('returns its private key correctly', () => {
    return expect(new PrivateKey(fPrivateKey).getPrivateKey()).resolves.toBe(fPrivateKey);
  });
});
