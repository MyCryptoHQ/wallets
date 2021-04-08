import type { HDNode } from '@ethersproject/hdnode';
import { toChecksumAddress } from '@utils';

import type { TAddress } from '@types';

import type { Wallet } from '.';


export abstract class DeterministicWallet {
  abstract async getAddress(path: string): Promise<TAddress>;
  abstract async getWallet(path: string): Promise<Wallet>;
  protected abstract async getHDNode(path: string): Promise<HDNode>;

  async getAddresses({ path, limit, offset = 0 }: { path: string; limit: number; offset: number }) {
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
