import { ETHEREUM_P2PKH, HARDENED_PREFIX } from '@config';
import { Base58 } from '@ethersproject/basex';
import { concat, hexDataSlice, hexlify, hexZeroPad } from '@ethersproject/bytes';
import { ripemd160, sha256 } from '@ethersproject/sha2';
import { computePublicKey } from '@ethersproject/signing-key';

import type { ExtendedKey } from '@types';

export const createExtendedPublicKey = (
  childDerivationPath: string,
  parent: ExtendedKey,
  child: ExtendedKey
): string => {
  const pathSegments = childDerivationPath.substring(2).split('/');

  const fingerprint = getFingerprint(parent.publicKey);
  const index = hexZeroPad(hexlify(getSegmentNumber(pathSegments[pathSegments.length - 1])), 4);

  return base58check(
    concat([
      hexlify(ETHEREUM_P2PKH),
      hexlify(pathSegments.length.toString(16), { allowMissingPrefix: true, hexPad: 'left' }),
      hexlify(fingerprint),
      index,
      child.chainCode,
      computePublicKey(child.publicKey, true)
    ])
  );
};

export const getFingerprint = (publicKey: string): string => {
  return hexDataSlice(ripemd160(sha256(publicKey)), 0, 4);
};

export const base58check = (data: Uint8Array): string => {
  return Base58.encode(concat([data, hexDataSlice(sha256(sha256(data)), 0, 4)]));
};

export const getSegmentNumber = (segment: string): number => {
  const result = /^(\d+)('?)$/.exec(segment);
  if (!result) {
    throw new Error('Invalid derivation path');
  }

  const item = parseInt(result[1], 10);
  if (result[2] === '\'') {
    return item + HARDENED_PREFIX;
  }

  return item;
};
