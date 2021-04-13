import { HDNode } from '@ethersproject/hdnode';

import { DeterministicWallet } from '@deterministic-wallet';
import type { DerivationPath } from '@dpaths';
import type { ExtendedKey } from '@types';
import { getPathPrefix, createExtendedPublicKey } from '@utils';

export abstract class HardwareWallet extends DeterministicWallet {
  abstract getExtendedKey(path: string): Promise<ExtendedKey>;

  protected async getHDNode(path: DerivationPath): Promise<HDNode> {
    const childPath = getPathPrefix(path.path);
    const childKey = await this.getExtendedKey(childPath);

    const parentPath = getPathPrefix(childPath);
    const parentKey = await this.getExtendedKey(parentPath);
    const extendedKey = createExtendedPublicKey(childPath, parentKey, childKey);

    return HDNode.fromExtendedKey(extendedKey);
  }
}
