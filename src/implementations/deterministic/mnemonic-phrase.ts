import { MNEMONIC_ENTROPY_BYTES } from '@config';
import { entropyToMnemonic, HDNode } from '@ethersproject/hdnode';
import crypto from 'crypto';

import { DeterministicWallet } from '@deterministic-wallet';
import type { DerivationPath } from '@dpaths';
import { PrivateKey } from '@implementations/non-deterministic/private-key';
import type { TAddress } from '@types';
import { getFullPath, getPathPrefix, toChecksumAddress } from '@utils';
import type { Wallet } from '@wallet';

export class MnemonicPhrase extends DeterministicWallet {
  constructor(readonly mnemonicPhrase: string, readonly passphrase?: string) {
    super();
  }

  async getAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const node = await this.getHDNode(path);
    return toChecksumAddress(node.derivePath(`m/${index}`).address) as TAddress;
  }

  async getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const rootNode = await this.getHDNode(path);
    const node = rootNode.derivePath(getFullPath(path, index));
    return toChecksumAddress(node.address) as TAddress;
  }

  async getWallet(path: DerivationPath): Promise<Wallet> {
    const node = await this.getHDNode(path);
    return new PrivateKey(node.privateKey);
  }

  static create(passphrase?: string): MnemonicPhrase {
    const entropy = crypto.randomBytes(MNEMONIC_ENTROPY_BYTES);
    const mnemonicPhrase = entropyToMnemonic(entropy);

    return new MnemonicPhrase(mnemonicPhrase, passphrase);
  }

  protected async getHDNode(path: DerivationPath): Promise<HDNode> {
    const hdNode = HDNode.fromMnemonic(this.mnemonicPhrase, this.passphrase);
    return hdNode.derivePath(getPathPrefix(path.path));
  }
}
