import type { HDNode } from '@ethersproject/hdnode';

import type { DerivationPath } from '@dpaths';
import type { TAddress } from '@types';
import { getFullPath, toChecksumAddress } from '@utils';

import type { Wallet } from './wallet';

export abstract class DeterministicWallet {
  abstract getAddress(path: DerivationPath, index: number): Promise<TAddress>;
  abstract getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress>;
  abstract getWallet(path: DerivationPath, index: number): Promise<Wallet>;
  protected abstract getHDNode(path: DerivationPath): Promise<HDNode>;

  async getAddresses({
    path,
    limit,
    offset = 0
  }: {
    path: DerivationPath;
    limit: number;
    offset?: number;
  }) {
    if (path.isHardened) {
      return new Array(limit).fill(undefined).map(async (_, index) => {
        const i = offset + index;
        const dPath = getFullPath(path, i);
        const address = await this.getHardenedAddress(path, offset + index);
        return { address, dPath, index: i };
      });
    }

    const masterNode = await this.getHDNode(path);
    return new Array(limit).fill(undefined).map((_, index) => {
      const i = offset + index;
      const dPath = getFullPath(path, i);
      const node = masterNode.derivePath(i.toString(10));
      return { address: toChecksumAddress(node.address), index: i, dPath };
    });
  }
}
