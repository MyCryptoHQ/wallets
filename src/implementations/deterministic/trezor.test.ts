import { DEFAULT_ETH, LEDGER_LIVE_ETH } from '@dpaths';
import { fSignedTx, fTransactionRequest } from '@fixtures';
import { getFullPath } from '@utils';

import { TrezorWallet, TrezorWalletInstance } from './trezor';

describe('TrezorWalletInstance', () => {
  describe('signTransaction', () => {
    it('signs a transaction', async () => {
      const wallet = new TrezorWallet();
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(instance.signTransaction(fTransactionRequest)).resolves.toBe(fSignedTx);
    });
  });

  describe('getAddress', () => {
    it('returns an address for the derivation path of the instance', async () => {
      const wallet = new TrezorWallet();
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(instance.getAddress()).resolves.toBe(
        '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
      );
    });
  });

  describe('getPrivateKey', () => {
    it('throws an error', async () => {
      const wallet = new TrezorWallet();
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(() => instance.getPrivateKey()).rejects.toThrow('Method not implemented.');
    });
  });
});

describe('TrezorWallet', () => {
  describe('getAddress', () => {
    it('fetches an address from the device', async () => {
      const wallet = new TrezorWallet();

      await expect(wallet.getAddress(DEFAULT_ETH, 0)).resolves.toBe(
        '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
      );
      await expect(wallet.getAddress(DEFAULT_ETH, 1)).resolves.toBe(
        '0x59A897A2dbd55D20bCC9B52d5eaA14E2859Dc467'
      );
    });
  });

  describe('getHardenedAddress', () => {
    it('fetches an address from the device on a hardened level', async () => {
      const wallet = new TrezorWallet();

      await expect(wallet.getHardenedAddress(LEDGER_LIVE_ETH, 0)).resolves.toBe(
        '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
      );
      await expect(wallet.getHardenedAddress(LEDGER_LIVE_ETH, 1)).resolves.toBe(
        '0x3FE703a2035CB3590C865a09F556eDda02b2Cf12'
      );
    });
  });

  describe('getExtendedKey', () => {
    it('fetches a public key and chaincode from the device', async () => {
      const wallet = new TrezorWallet();

      await expect(wallet.getExtendedKey(getFullPath(DEFAULT_ETH, 0))).resolves.toStrictEqual({
        chainCode: '0x968a2e8e9aa80d3c3416b33e3d912b6a919af9909f42d29d2eb0b8f28ea4dcfd',
        publicKey:
          '0x04b884d0c53b60fb8aafba20ca84870f20428082863f1d39a402c36c2de356cb0c6c0a582f54ee29911ca6f1823d34405623f4a7418db8ebb0203bc3acba08ba64'
      });
      await expect(wallet.getExtendedKey(getFullPath(DEFAULT_ETH, 1))).resolves.toStrictEqual({
        chainCode: '0x6265b647bc0e70480f29856be102fe866ea6a8ec9e2926c198c2e9c4cd268a43',
        publicKey:
          '0x04b21938e18aec1e2e7478988ccae5b556597d771c8e46ac2c8ea2a4a1a80619679230a109cd30e8af15856b15799e38991e45e55f406a8a24d5605ba0757da53c'
      });
    });
  });

  describe('getWallet', () => {
    it('returns an instance of a Ledger wallet at a specific derivation path', async () => {
      const wallet = new TrezorWallet();

      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      expect(instance).toBeInstanceOf(TrezorWalletInstance);
      expect(await instance.getAddress()).toBe('0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf');
    });
  });
});
