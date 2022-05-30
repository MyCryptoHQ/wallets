import type { UnsignedTransaction } from '@ethersproject/transactions';

declare module 'gridplus-sdk' {
  interface SignMessageOpts {
    signerPath: number[];
    protocol: 'signPersonal';
    payload: string;
  }

  type SignTxOpts = {
    signerPath: number[];
    // @todo Improve
  } & UnsignedTransaction;

  interface SignOpts {
    currency: 'ETH' | 'ETH_MSG' | 'BTC';
    data: SignTxOpts | SignMessageOpts;
  }

  interface AddressesOpts {
    startPath: number[];
    n: number;
  }
}
