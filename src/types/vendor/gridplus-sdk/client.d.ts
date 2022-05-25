import type { UnsignedTransaction } from '@ethersproject/transactions';
import type { Buffer } from 'buffer';
import sdk from 'gridplus-sdk';

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

  interface SignResult {
    sig: {
      v: Buffer;
      r: string;
      s: string;
    };
  }

  interface AddressesOpts {
    startPath: number[];
    n: number;
  }

  export class Client extends sdk.Client {
    getActiveWallet(): {
      uid: Buffer;
      name: Buffer;
      capabilities: number;
      external: boolean;
    } | null;
  }
}
