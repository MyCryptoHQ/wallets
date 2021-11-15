declare module 'gridplus-sdk' {
  import type { UnsignedTransaction } from '@ethersproject/transactions';
  import type { Buffer } from 'buffer';

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
    skipCache: boolean;
  }

  export class Client {
    constructor(options: { baseUrl?: string; crypto; name?: string; privKey?: Buffer });
    isPaired: boolean;
    connect(deviceID: string, callback: (err: Error | null, isPaired: boolean) => void): void;
    sign(opts: SignOpts, callback: (err: Error | null, data: SignResult) => void): void;
    getAddresses(opts: AddressesOpts, callback: (err: Error | null, data: string[]) => void): void;
    hasActiveWallet(): boolean;
  }
}
