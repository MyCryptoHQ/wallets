import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { SignatureLike } from '@ethersproject/bytes';
import { HDNode } from '@ethersproject/hdnode';
import { serialize as serializeTransaction } from '@ethersproject/transactions';
import type { EthereumTransaction, Manifest } from '@trezor/connect';
import TrezorConnect from '@trezor/connect';
import type { HDNodeResponse } from '@trezor/connect/lib/types/api/getPublicKey';

import type { DerivationPath } from '../../dpaths';
import type { DeterministicAddress, TAddress } from '../../types';
import { WalletsError, WalletsErrorCode } from '../../types';
import {
  addHexPrefix,
  createExtendedPublicKey,
  getFullPath,
  getPathPrefix,
  sanitizeTx,
  sequence
} from '../../utils';
import type { Wallet } from '../../wallet';
import { standardizeTrezorErr } from './errors';
import { HardwareWallet } from './hardware-wallet';

export class TrezorWalletInstance implements Wallet {
  constructor(private readonly path: string, private address?: TAddress) {}

  async signTransaction(rawTx: TransactionRequest): Promise<string> {
    // Strip type from tx for now
    const { type, ...transaction } = sanitizeTx(rawTx);

    if (transaction.chainId === undefined || transaction.nonce === undefined) {
      throw new WalletsError(
        'Missing chainId or nonce on transaction',
        WalletsErrorCode.MISSING_ARGUMENTS
      );
    }

    const result = await TrezorConnect.ethereumSignTransaction({
      path: this.path,
      transaction: {
        ...transaction,
        nonce: addHexPrefix(transaction.nonce.toString(16))
      } as EthereumTransaction
    });
    if (!result.success) {
      throw standardizeTrezorErr(result.payload);
    }

    const signature: SignatureLike = {
      v: parseInt(result.payload.v, 16),
      r: result.payload.r,
      s: result.payload.s
    };

    return serializeTransaction({ ...transaction, type }, signature);
  }

  async signMessage(message: string): Promise<string> {
    const result = await TrezorConnect.ethereumSignMessage({
      message,
      path: this.path
    });

    if (!result.success) {
      throw standardizeTrezorErr(result.payload);
    }

    return result.payload.signature;
  }

  async getAddress(): Promise<TAddress> {
    if (!this.address) {
      const result = await TrezorConnect.ethereumGetAddress({
        path: this.path,
        showOnTrezor: false
      });
      if (!result.success) {
        throw standardizeTrezorErr(result.payload);
      }
      this.address = result.payload.address as TAddress;
    }
    return this.address;
  }

  async getPrivateKey(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

export class TrezorWallet extends HardwareWallet {
  constructor(manifest: Manifest) {
    super();
    TrezorConnect.manifest(manifest);
  }

  async getAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const wallet = await this.getWallet(path, index);
    return wallet.getAddress();
  }

  async getExtendedKey(path: string): Promise<{ publicKey: string; chainCode: string }> {
    const result = await TrezorConnect.getPublicKey({ path });
    if (!result.success) {
      throw standardizeTrezorErr(result.payload);
    }

    return {
      publicKey: result.payload.publicKey,
      chainCode: result.payload.chainCode
    };
  }

  async getHDNodes(paths: DerivationPath[]): Promise<Record<string, HDNode>> {
    const bundle = paths
      .filter((path) => !path.isHardened)
      .reduce<string[]>((paths, { path }) => {
        const childPath = getPathPrefix(path);
        const parentPath = getPathPrefix(childPath);

        return [...paths, childPath, parentPath];
      }, [])
      .map((path) => ({ path }));
    const result = await TrezorConnect.getPublicKey({ bundle });

    if (!result.success) {
      throw standardizeTrezorErr(result.payload);
    }

    const keys = result.payload.reduce<Record<string, HDNodeResponse>>((acc, cur) => {
      return { ...acc, [cur.serializedPath]: cur };
    }, {});

    return paths.reduce<Record<string, HDNode>>((acc, path) => {
      const childPath = getPathPrefix(path.path);
      const parentPath = getPathPrefix(childPath);

      const childKey = keys[childPath];
      const parentKey = keys[parentPath];

      if (childKey !== undefined && parentKey !== undefined) {
        const extendedKey = createExtendedPublicKey(childPath, parentKey, childKey);

        return { ...acc, [path.path]: HDNode.fromExtendedKey(extendedKey) };
      }
      return acc;
    }, {});
  }

  async getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const result = await TrezorConnect.ethereumGetAddress({ path: getFullPath(path, index) });
    if (!result.success) {
      throw standardizeTrezorErr(result.payload);
    }

    return result.payload.address as TAddress;
  }

  async getAddressesWithMultipleDPaths(
    input: {
      path: DerivationPath;
      limit: number;
      offset?: number;
    }[]
  ): Promise<DeterministicAddress[]> {
    const nodes = await this.getHDNodes(input.map((p) => p.path));
    const promises = input.map(({ path, limit, offset }) => () =>
      this.getAddresses({ path, limit, offset, node: nodes[path.path] })
    );
    return sequence(promises).then((results) => results.reduce((acc, cur) => acc.concat(cur), []));
  }

  async getWallet(path: DerivationPath, index: number, address?: TAddress): Promise<Wallet> {
    return new TrezorWalletInstance(getFullPath(path, index), address);
  }
}
