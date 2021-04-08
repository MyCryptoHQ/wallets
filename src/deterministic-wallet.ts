import type { HDNode } from '@ethersproject/hdnode';

import type { TAddress } from '@types';
import { toChecksumAddress } from '@utils';

import type { Wallet } from './wallet';

export abstract class DeterministicWallet {
  abstract getAddress(path: string): Promise<TAddress>;
  abstract getWallet(path: string): Promise<Wallet>;
  protected abstract getHDNode(path: string): Promise<HDNode>;

  async getAddresses({
    path,
    limit,
    offset = 0
  }: {
    path: string;
    limit: number;
    offset?: number;
  }) {
    const masterNode = await this.getHDNode(path);
    const addresses = [];
    for (let i = 0; i < limit; i++) {
      const index = i + offset;
      const dPath = `${path}/${index}`;
      const node = masterNode.derivePath(`${index}`);
      const address = toChecksumAddress(node.address) as TAddress;
      addresses.push({
        address,
        dPath,
        index
      });
    }
    return addresses;
  }
}
