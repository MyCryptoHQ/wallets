import { HDNode } from '@ethersproject/hdnode';

import { DeterministicWallet } from '@deterministic-wallet';
import type { DerivationPath } from '@dpaths';
import { getPathPrefix } from '@utils';

export abstract class HardwareWallet extends DeterministicWallet {
  abstract getExtendedKey(path: string): Promise<string>;
  protected async getHDNode(path: DerivationPath): Promise<HDNode> {
    const childPath = getPathPrefix(path.path);
    const childKey = await this.getExtendedKey(childPath);
    if (typeof childKey === 'string') {
      return HDNode.fromExtendedKey(childKey);
    }

    const parentPath = getPathPrefix(childPath)
    const parentKey = await this.getExtendedKey(parentPath);
    return createExtendedPublicKey(childPath, parentKey, childKey);
  }
}
