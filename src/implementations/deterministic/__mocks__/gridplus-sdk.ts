import { arrayify, splitSignature } from '@ethersproject/bytes';
import { HDNode } from '@ethersproject/hdnode';
import type { Transaction } from '@ethersproject/transactions';
import { parse } from '@ethersproject/transactions';
import { Wallet } from '@ethersproject/wallet';
import { Buffer } from 'buffer';
import type { AddressesOpts, SignMessageOpts, SignOpts, SignTxOpts } from 'gridplus-sdk';

import { fMnemonicPhrase } from '../../../../.jest/__fixtures__';
import { getPathPrefix, stripHexPrefix, toChecksumAddress } from '../../../utils';

const hdNode = HDNode.fromMnemonic(fMnemonicPhrase);

const convertPathToString = (path: number[]): string =>
  path
    .map((p) => {
      const withoutHardening = p - 0x80000000;
      const index = withoutHardening >= 0 ? Math.min(p, withoutHardening) : p;
      const isHardened = index === withoutHardening;
      return `${index}${isHardened ? "'" : ''}`;
    })
    .join('/');

export const Utils = {
  fetchCalldataDecoder: jest.fn()
};

export const Constants = {
  SIGNING: {
    HASHES: {
      NONE: 0,
      KECCAK256: 0,
      SHA256: 0
    },
    CURVES: {
      SECP256K1: 0,
      ED25519: 0
    },
    ENCODINGS: {
      NONE: 0,
      EVM: 0
    }
  }
};

export class Client {
  isPaired = false;
  getActiveWallet = jest.fn().mockReturnValue({ uid: Buffer.from('0') });
  getFwVersion = jest.fn().mockReturnValue({ major: 15, minor: 0, fix: 0 });
  pair = jest.fn().mockImplementation(async (_secret: string) => {
    // For now we only pair and expect it to fail
    throw new Error('Failed to pair');
  });
  connect = jest.fn().mockImplementation(async (deviceID: string) => {
    if (deviceID === 'foo') {
      this.isPaired = true;
      return true;
    } else {
      return false;
    }
  });
  sign = jest.fn().mockImplementation(async (opts: SignOpts) => {
    const path = convertPathToString(opts.data.signerPath);
    const childNode = hdNode.derivePath(path);
    const wallet = new Wallet(childNode.privateKey);
    if (opts.currency === 'ETH') {
      // Pulls out signerPath, chainId, and all the generic transaction fields so validation of
      // transaction succeeds
      const {
        signerPath,
        chainId,
        payload,
        curveType,
        hashType,
        encodingType,
        decoder,
        ...transaction
      } = opts.data as SignTxOpts;

      const isEIP1559 =
        transaction.maxFeePerGas !== undefined && transaction.maxPriorityFeePerGas !== undefined;

      const signedTransaction = await wallet.signTransaction({
        ...transaction,
        chainId: parseInt((chainId as unknown) as string, 16),
        type: isEIP1559 ? 2 : 0
      });
      const { v, r, s } = parse(signedTransaction) as Required<Transaction>;
      return {
        sig: {
          // eslint-disable-next-line no-restricted-globals
          v: v === 0 ? Buffer.from([]) : Buffer.from([v]),
          r: stripHexPrefix(r),
          s: stripHexPrefix(s)
        }
      };
    } else if (opts.currency === 'ETH_MSG') {
      const signMessageOpts = opts.data as SignMessageOpts;
      const signature = await wallet.signMessage(arrayify(signMessageOpts.payload));
      const { v, r, s } = splitSignature(signature);

      return {
        sig: {
          // eslint-disable-next-line no-restricted-globals
          v: v === 0 ? Buffer.from([]) : Buffer.from([v]),
          r: stripHexPrefix(r),
          s: stripHexPrefix(s)
        }
      };
    }
  });
  getAddresses = jest.fn().mockImplementation(async (opts: AddressesOpts) => {
    const path = convertPathToString(opts.startPath);
    const indices = path.split('/');
    const offset = parseInt(indices[indices.length - 1]);

    const masterNode = hdNode.derivePath(getPathPrefix(path));
    const result = new Array(opts.n).fill(undefined).map((_, i) => {
      const index = offset + i;
      const node = masterNode.derivePath(index.toString(10));
      return toChecksumAddress(node.address);
    });
    return result;
  });
}
