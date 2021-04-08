import { getAddress } from '@ethersproject/address';

export const toChecksumAddress = (address: string) => getAddress(address);
