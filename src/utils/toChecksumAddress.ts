import { getAddress } from '@ethersproject/address';

export const toChecksumAddress = (address: string): string => getAddress(address);
