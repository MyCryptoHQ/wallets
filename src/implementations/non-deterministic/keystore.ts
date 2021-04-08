import { decryptJsonWalletSync } from '@ethersproject/json-wallets';
import { addHexPrefix, getKeystoreType, KeystoreType } from '@utils';
import Wallet, { thirdparty } from 'ethereumjs-wallet';


import { PrivateKey } from './private-key';

export class Keystore extends PrivateKey {
  constructor(readonly keystore: string, readonly password: string) {
    super(addHexPrefix(Keystore.decryptKeystoreFile(keystore, password)));
  }

  private static decryptKeystoreFile(keystore: string, password: string): string {
    const type = getKeystoreType(keystore);

    // While Ethers.js does support presale wallets, the support is limited, so instead we use
    // ethereum-js wallet here.
    if (type === KeystoreType.PRESALE || type === KeystoreType.PRESALE_BKP) {
      const wallet = Wallet.fromEthSale(keystore, password);
      return wallet.getPrivateKey().toString('hex');
    }

    if (type === KeystoreType.V1) {
      const wallet = thirdparty.fromEtherWallet(keystore, password);
      return wallet.getPrivateKey().toString('hex');
    }

    if (type === KeystoreType.V2) {
      const { privKey } = JSON.parse(keystore);
      return privKey;
    }

    const { privateKey } = decryptJsonWalletSync(keystore, password);
    return privateKey;
  }
}
