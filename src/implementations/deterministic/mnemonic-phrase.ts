import { entropyToMnemonic, HDNode } from '@ethersproject/hdnode';
import crypto from 'crypto';

import { MNEMONIC_ENTROPY_BYTES } from '../../config';
import { DeterministicWallet } from '../../deterministic-wallet';
import type { DerivationPath } from '../../dpaths';
import type { TAddress } from '../../types';
import { getFullPath, getPathPrefix, toChecksumAddress } from '../../utils';
import type { Wallet } from '../../wallet';
import { PrivateKey } from '../non-deterministic';

export class MnemonicPhrase extends DeterministicWallet {
  constructor(readonly mnemonicPhrase: string, readonly passphrase?: string) {
    super();
  }

  async getAddress(path: DerivationPath, index: number): Promise<TAddress> {
    if (path.isHardened) {
      return this.getHardenedAddress(path, index);
    }
    const node = await this.getHDNode(path);
    return toChecksumAddress(node.derivePath(index.toString(10)).address) as TAddress;
  }

  async getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const rootNode = HDNode.fromMnemonic(this.mnemonicPhrase, this.passphrase);
    const node = rootNode.derivePath(getFullPath(path, index));
    return toChecksumAddress(node.address) as TAddress;
  }

  async getWallet(path: DerivationPath, index: number): Promise<Wallet> {
    const node = await this.getHDNode(path);
    return new PrivateKey(node.derivePath(index.toString(10)).privateKey);
  }

  static create(
    passphrase?: string,
    entropyBytes: number = MNEMONIC_ENTROPY_BYTES
  ): MnemonicPhrase {
    const entropy = crypto.randomBytes(entropyBytes);
    const mnemonicPhrase = entropyToMnemonic(entropy);

    return new MnemonicPhrase(mnemonicPhrase, passphrase);
  }

  protected async getHDNode(path: DerivationPath): Promise<HDNode> {
    const hdNode = HDNode.fromMnemonic(this.mnemonicPhrase, this.passphrase);
    return hdNode.derivePath(getPathPrefix(path.path));
  }
}
