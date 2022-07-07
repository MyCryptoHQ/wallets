import type { UnsignedTransaction } from '@ethersproject/transactions';

declare module 'gridplus-sdk' {
  interface SignMessageOpts {
    signerPath: number[];
    protocol: 'signPersonal';
    payload: string;
  }

  type SignTxOpts = SignTxOptsLegacy | SignTxOptsGeneric;

  type SignTxOptsLegacy = {
    signerPath: number[];
    // @todo Improve
  } & UnsignedTransaction;

  interface SignTxOptsGeneric {
    signerPath: number[];
    payload: Uint8Array[];
  }

  interface SignOpts {
    currency: 'ETH' | 'ETH_MSG' | 'BTC';
    data: SignTxOpts | SignMessageOpts;
  }

  interface AddressesOpts {
    startPath: number[];
    n: number;
  }
}
