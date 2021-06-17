import type { TAddress } from './address';

export interface DeterministicAddress {
  address: TAddress;
  dPath: string;
  index: number;
}
