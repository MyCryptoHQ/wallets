import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { SignatureLike } from '@ethersproject/bytes';
import { hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import { serialize as serializeTransaction } from '@ethersproject/transactions';
import EthereumApp from '@ledgerhq/hw-app-eth';
import type Transport from '@ledgerhq/hw-transport';
//import TransportNodeHid from '@ledgerhq/hw-transport-node-hid-noevents';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';

import type { DerivationPath } from '../../dpaths';
import type { ExtendedKey, TAddress } from '../../types';
import { addHexPrefix, getFullPath, sanitizeTx, stripHexPrefix } from '../../utils';
import type { Wallet } from '../../wallet';
import { wrapLedgerError } from './errors';
import { HardwareWallet } from './hardware-wallet';

export class LedgerWalletInstance implements Wallet {
  constructor(
    private readonly app: EthereumApp,
    private readonly path: string,
    private address?: TAddress
  ) {}

  async signTransaction(rawTx: TransactionRequest): Promise<string> {
    const transaction = sanitizeTx(rawTx);
    const { chainId } = transaction;

    if (chainId === undefined) {
      throw Error('Missing chainId on transaction');
    }

    const result = await this.app
      .signTransaction(this.path, stripHexPrefix(serializeTransaction(transaction)))
      .catch(wrapLedgerError);

    const signature: SignatureLike = {
      v: parseInt(result.v, 16),
      r: addHexPrefix(result.r),
      s: addHexPrefix(result.s)
    };

    return serializeTransaction(transaction, signature);
  }

  async signMessage(msg: string): Promise<string> {
    const bytes = toUtf8Bytes(msg);
    const msgHex = stripHexPrefix(hexlify(bytes));
    const signed = await this.app.signPersonalMessage(this.path, msgHex).catch(wrapLedgerError);
    return addHexPrefix(signed.r + signed.s + signed.v.toString(16));
  }

  async getAddress(): Promise<TAddress> {
    if (!this.address) {
      const address = (await this.app.getAddress(this.path, false, false).catch(wrapLedgerError))
        .address as TAddress;
      this.address = address;
    }
    return this.address;
  }

  async getPrivateKey(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

export class LedgerWallet extends HardwareWallet {
  private app?: EthereumApp;

  constructor(private readonly transport?: Transport) {
    super();
  }

  async getAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const wallet = await this.getWallet(path, index);
    return wallet.getAddress();
  }

  async getExtendedKey(path: string): Promise<ExtendedKey> {
    const app = await this.getApp();
    const { publicKey, chainCode } = await app.getAddress(path, false, true).catch(wrapLedgerError);
    return {
      publicKey,
      chainCode: chainCode!
    };
  }

  async getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const app = await this.getApp();
    const result = await app.getAddress(getFullPath(path, index)).catch(wrapLedgerError);
    return result.address as TAddress;
  }

  async getWallet(path: DerivationPath, index: number, address?: TAddress): Promise<Wallet> {
    const app = await this.getApp();
    return new LedgerWalletInstance(app, getFullPath(path, index), address);
  }

  protected async getApp(): Promise<EthereumApp> {
    if (!this.app) {
      const transport = this.transport ?? (await this.getTransport());
      this.app = new EthereumApp(transport);
    }
    return this.app;
  }

  protected async getTransport(): Promise<Transport> {
    try {
      /**if (await TransportNodeHid.isSupported()) {
        return TransportNodeHid.create();
      }**/

      if (await TransportWebHID.isSupported()) {
        const list = await TransportWebHID.list();
        if (list.length > 0 && list[0].opened) {
          return new TransportWebHID(list[0]);
        }

        const existing = await TransportWebHID.openConnected().catch(() => null);
        return existing ?? TransportWebHID.request();
      }

      if (await TransportWebUSB.isSupported()) {
        const existing = await TransportWebUSB.openConnected().catch(() => null);
        return existing ?? TransportWebUSB.request();
      }
    } catch {
      // Fallback to U2F
    }

    return TransportU2F.create();
  }
}
