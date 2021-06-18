import type { HDNode } from '@ethersproject/hdnode';

import type { DerivationPath } from './dpaths';
import type { DeterministicAddress, TAddress } from './types';
import { getFullPath, toChecksumAddress } from './utils';
import type { Wallet } from './wallet';

export abstract class DeterministicWallet {
  abstract getAddress(path: DerivationPath, index: number): Promise<TAddress>;
  abstract getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress>;
  abstract getWallet(path: DerivationPath, index: number): Promise<Wallet>;
  protected abstract getHDNode(path: DerivationPath): Promise<HDNode>;

  /**
   * Get the extended public key (xpub) for a specific derivation path.
   *
   * @param derivationPath The derivation path to get the xpub for.
   * @return The extended public key as string.
   */
  async getExtendedPublicKey(derivationPath: DerivationPath): Promise<string> {
    const node = await this.getHDNode(derivationPath);
    return node.neuter().extendedKey;
  }

  async getAddressesWithMultipleDPaths(
    input: {
      path: DerivationPath;
      limit: number;
      offset?: number;
    }[]
  ): Promise<DeterministicAddress[]> {
    return Promise.all(
      input.map(({ path, limit, offset }) => this.getAddresses({ path, limit, offset }))
    ).then((results) => results.reduce((acc, cur) => acc.concat(cur), []));
  }

  async getAddresses({
    path,
    limit,
    offset = 0
  }: {
    path: DerivationPath;
    limit: number;
    offset?: number;
  }): Promise<DeterministicAddress[]> {
    if (path.isHardened) {
      return new Array(limit).fill(undefined).reduce(async (promise, _, index) => {
        const array = await promise;

        const i = offset + index;
        const dPath = getFullPath(path, i);
        const address = await this.getHardenedAddress(path, offset + index);
        return [...array, { address, dPath, index: i }];
      }, Promise.resolve([]));
    }

    const masterNode = await this.getHDNode(path);
    return new Array(limit).fill(undefined).map((_, index) => {
      const i = offset + index;
      const dPath = getFullPath(path, i);
      const node = masterNode.derivePath(i.toString(10));
      return {
        address: toChecksumAddress(node.address) as TAddress,
        index: i,
        dPath,
        dPathInfo: path
      };
    });
  }
}
