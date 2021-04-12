import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { SignatureLike } from '@ethersproject/bytes';
import { serialize as serializeTransaction } from '@ethersproject/transactions';
import LedgerEth from '@ledgerhq/hw-app-eth';
import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20';
import type Transport from '@ledgerhq/hw-transport';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';

import type { DerivationPath } from '@dpaths';
import type { TAddress } from '@types';
import { addHexPrefix, getFullPath, stripHexPrefix } from '@utils';
import type { Wallet } from '@wallet';

import { HardwareWallet } from './hardware-wallet';

class LedgerWalletInstance implements Wallet {
  constructor(private readonly app: LedgerEth<any>, private readonly path: string) {}

  async signTransaction(transaction: TransactionRequest): Promise<string> {
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
    return (await this.app.getAddress(this.path, true, false)).address as TAddress;
  }
  getPrivateKey(): Promise<string> {
    throw new Error('Method not implemented.');
  }
}

export class LedgerWallet extends HardwareWallet {
  async getAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const wallet = await this.getWallet(path, index);
    return wallet.getAddress();
  }

  getExtendedKey(path: string): Promise<string> {}

  async getHardenedAddress(path: DerivationPath, index: number): Promise<TAddress> {
    const app = await this.getApp();
    const result = await app.getAddress(getFullPath(path, index));
    return result.address as TAddress;
  }

  async getWallet(path: DerivationPath, index: number): Promise<Wallet> {
    const app = await this.getApp();
    return new LedgerWalletInstance(app, getFullPath(path, index));
  }

  protected async getApp(): Promise<LedgerEth<any>> {
    const transport = await this.getTransport();
    return new LedgerEth(transport);
  }

  protected async getTransport(): Promise<Transport> {
    try {
      if (await TransportWebUSB.isSupported()) {
        return TransportWebUSB.create();
      }
    } catch {
      // Fallback to U2F
    }

    return TransportU2F.create();
  }
}
