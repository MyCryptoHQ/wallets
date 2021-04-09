import { MNEMONIC_ENTROPY_BYTES } from '@config';
import { entropyToMnemonic, HDNode } from '@ethersproject/hdnode';
import crypto from 'crypto';

import { DeterministicWallet } from '@deterministic-wallet';
import { PrivateKey } from '@implementations/non-deterministic/private-key';
import type { TAddress } from '@types';
import type { Wallet } from '@wallet';

export class MnemonicPhrase extends DeterministicWallet {
  constructor(readonly mnemonicPhrase: string, readonly passphrase?: string) {
    super();
  }

  async getAddress(path: string): Promise<TAddress> {
    const node = await this.getHDNode(path);
    return node.address as TAddress;
  }

  async getWallet(path: string): Promise<Wallet> {
    const node = await this.getHDNode(path);
    return new PrivateKey(node.privateKey);
  }

  static create(passphrase?: string): MnemonicPhrase {
    const entropy = crypto.randomBytes(MNEMONIC_ENTROPY_BYTES);
    const mnemonicPhrase = entropyToMnemonic(entropy);

    return new MnemonicPhrase(mnemonicPhrase, passphrase);
  }

  protected async getHDNode(path: string): Promise<HDNode> {
    const hdNode = HDNode.fromMnemonic(this.mnemonicPhrase, this.passphrase);
    return hdNode.derivePath(path);
  }
}
