import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { SignatureLike } from '@ethersproject/bytes';
import { serialize as serializeTransaction } from '@ethersproject/transactions';
import EthereumApp from '@ledgerhq/hw-app-eth';
import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20';
import type Transport from '@ledgerhq/hw-transport';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';

import type { DerivationPath } from '@dpaths';
import type { ExtendedKey, TAddress } from '@types';
import { addHexPrefix, getFullPath, sanitizeTx, stripHexPrefix } from '@utils';
import type { Wallet } from '@wallet';

import { HardwareWallet } from './hardware-wallet';

export class LedgerWalletInstance implements Wallet {
  constructor(private readonly app: EthereumApp<unknown>, private readonly path: string) {}

  async signTransaction(rawTx: TransactionRequest): Promise<string> {
    const transaction = sanitizeTx(rawTx);
    const { to, chainId } = transaction;

    if (!chainId) {
      throw Error('Missing chainId on tx');
    }

    try {
      if (chainId === 1 && to) {
        const tokenInfo = byContractAddress(to);
        if (tokenInfo) {
          await this.app.provideERC20TokenInformation(tokenInfo);
        }
      }

      const result = await this.app.signTransaction(
        this.path,
        stripHexPrefix(serializeTransaction(transaction))
      );

      const signature: SignatureLike = {
        v: parseInt(result.v, 16),
        r: addHexPrefix(result.r),
        s: addHexPrefix(result.s)
      };

      return serializeTransaction(transaction, signature);
    } catch (err) {
      throw Error(err + '. Check to make sure contract data is on');
    }
  }

  async getAddress(): Promise<TAddress> {
    return (await this.app.getAddress(this.path, false, false)).address as TAddress;
  }

  getPrivateKey(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

export class LedgerWallet extends HardwareWallet {
  constructor(private readonly transport?: Transport) {
    super();
  }

  async getAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const wallet = await this.getWallet(path, index);
    return wallet.getAddress();
  }

  async getExtendedKey(path: string): Promise<ExtendedKey> {
    const app = await this.getApp();
    const { publicKey, chainCode } = await app.getAddress(path, false, true);
    return {
      publicKey,
      chainCode
    };
  }

  async getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const app = await this.getApp();
    const result = await app.getAddress(getFullPath(path, index));
    return result.address as TAddress;
  }

  async getWallet(path: DerivationPath, index: number): Promise<Wallet> {
    const app = await this.getApp();
    return new LedgerWalletInstance(app, getFullPath(path, index));
  }

  protected async getApp(): Promise<EthereumApp<unknown>> {
    const transport = this.transport ?? (await this.getTransport());
    return new EthereumApp(transport);
  }

  protected async getTransport(): Promise<Transport> {
    try {
      if (await TransportNodeHid.isSupported()) {
        return TransportNodeHid.create();
      }

      if (await TransportWebHID.isSupported()) {
        return TransportWebHID.create();
      }

      if (await TransportWebUSB.isSupported()) {
        return TransportWebUSB.create();
      }
    } catch {
      // Fallback to U2F
    }

    return TransportU2F.create();
  }
}
