import TrezorConnect from 'trezor-connect';

import { fSignedTx, fTransactionRequest } from '../../../.jest/__fixtures__';
import { DEFAULT_ETH, LEDGER_LIVE_ETH } from '../../dpaths';
import { getFullPath } from '../../utils';
import { TrezorWallet, TrezorWalletInstance } from './trezor';

const manifest = { email: 'support@mycrypto.com', appUrl: 'https://app.mycrypto.com' };

describe('TrezorWalletInstance', () => {
  describe('signTransaction', () => {
    it('signs a transaction', async () => {
      const wallet = new TrezorWallet(manifest);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(instance.signTransaction(fTransactionRequest)).resolves.toBe(fSignedTx);
    });

    it('throws if the call to TrezorConnect fails', async () => {
      (TrezorConnect.ethereumSignTransaction as jest.MockedFunction<
        typeof TrezorConnect.ethereumSignTransaction
      >).mockImplementationOnce(async () => ({
        success: false,
        payload: {
          error: 'foo bar'
        }
      }));

      const wallet = new TrezorWallet(manifest);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(instance.signTransaction(fTransactionRequest)).rejects.toThrow('foo bar');
    });

    it('throws if the chain ID or nonce is undefined', async () => {
      const wallet = new TrezorWallet(manifest);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(
        instance.signTransaction({ ...fTransactionRequest, nonce: undefined })
      ).rejects.toThrow();
      await expect(
        instance.signTransaction({ ...fTransactionRequest, chainId: undefined })
      ).rejects.toThrow();
    });
  });

  describe('getAddress', () => {
    it('returns an address for the derivation path of the instance', async () => {
      const wallet = new TrezorWallet(manifest);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(instance.getAddress()).resolves.toBe(
        '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
      );
    });

    it('throws if the call to TrezorConnect fails', async () => {
      (TrezorConnect.ethereumGetAddress as jest.MockedFunction<
        typeof TrezorConnect.ethereumGetAddress
      >).mockImplementationOnce(async () => ({
        success: false,
        payload: {
          error: 'foo bar'
        }
      }));

      const wallet = new TrezorWallet(manifest);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(instance.getAddress()).rejects.toThrow('foo bar');
    });
  });

  describe('getPrivateKey', () => {
    it('throws an error', async () => {
      const wallet = new TrezorWallet(manifest);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(() => instance.getPrivateKey()).rejects.toThrow('Method not implemented.');
    });
  });
});

describe('TrezorWallet', () => {
  describe('getAddress', () => {
    it('fetches an address from the device', async () => {
      const wallet = new TrezorWallet(manifest);

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
      const wallet = new TrezorWallet(manifest);

      await expect(wallet.getHardenedAddress(LEDGER_LIVE_ETH, 0)).resolves.toBe(
        '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
      );
      await expect(wallet.getHardenedAddress(LEDGER_LIVE_ETH, 1)).resolves.toBe(
        '0x3FE703a2035CB3590C865a09F556eDda02b2Cf12'
      );
    });

    it('throws if the call to TrezorConnect fails', async () => {
      (TrezorConnect.ethereumGetAddress as jest.MockedFunction<
        typeof TrezorConnect.ethereumGetAddress
      >).mockImplementationOnce(async () => ({
        success: false,
        payload: {
          error: 'foo bar'
        }
      }));

      const wallet = new TrezorWallet(manifest);
      await expect(wallet.getHardenedAddress(LEDGER_LIVE_ETH, 0)).rejects.toThrow('foo bar');
    });
  });

  describe('getAddresses', () => {
    it('fetches multiple addresses for a derivation path', async () => {
      const wallet = new TrezorWallet(manifest);

      await expect(wallet.getAddresses({ path: DEFAULT_ETH, limit: 5 })).resolves.toStrictEqual([
        {
          address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf',
          dPath: "m/44'/60'/0'/0/0",
          index: 0
        },
        {
          address: '0x59A897A2dbd55D20bCC9B52d5eaA14E2859Dc467',
          dPath: "m/44'/60'/0'/0/1",
          index: 1
        },
        {
          address: '0x7D5e716Bbc8771af9c5ec3b0555B48a4a84d4ba7',
          dPath: "m/44'/60'/0'/0/2",
          index: 2
        },
        {
          address: '0x8137eC5954A8ed45A90F3bd58f717228b5670858',
          dPath: "m/44'/60'/0'/0/3",
          index: 3
        },
        {
          address: '0xc0C386F7f0B02FAC0d63B2de00a01e77992B011B',
          dPath: "m/44'/60'/0'/0/4",
          index: 4
        }
      ]);
    });

    it('fetches multiple addresses for a hardened derivation path', async () => {
      const wallet = new TrezorWallet(manifest);

      await expect(wallet.getAddresses({ path: LEDGER_LIVE_ETH, limit: 5 })).resolves.toStrictEqual(
        [
          {
            address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf',
            dPath: "m/44'/60'/0'/0/0",
            index: 0
          },
          {
            address: '0x3FE703a2035CB3590C865a09F556eDda02b2Cf12',
            dPath: "m/44'/60'/1'/0/0",
            index: 1
          },
          {
            address: '0x2159a414C4Ac080482CE6F942cc5BC59306a1A47',
            dPath: "m/44'/60'/2'/0/0",
            index: 2
          },
          {
            address: '0xBdec34481829c2396FA15bAc5227D0B05cF3Dc41',
            dPath: "m/44'/60'/3'/0/0",
            index: 3
          },
          {
            address: '0x91e2831A52E4eeE2efa8B05B0bD0C930407495DC',
            dPath: "m/44'/60'/4'/0/0",
            index: 4
          }
        ]
      );
    });
  });

  describe('getExtendedKey', () => {
    it('fetches a public key and chaincode from the device', async () => {
      const wallet = new TrezorWallet(manifest);

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

    it('throws if the call to TrezorConnect fails', async () => {
      (TrezorConnect.getPublicKey as jest.MockedFunction<
        typeof TrezorConnect.getPublicKey
      >).mockImplementationOnce(async () => ({
        success: false,
        payload: {
          error: 'foo bar'
        }
      }));

      const wallet = new TrezorWallet(manifest);
      await expect(wallet.getExtendedKey(getFullPath(DEFAULT_ETH, 0))).rejects.toThrow('foo bar');
    });
  });

  describe('getWallet', () => {
    it('returns an instance of a Trezor wallet at a specific derivation path', async () => {
      const wallet = new TrezorWallet(manifest);

      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      expect(instance).toBeInstanceOf(TrezorWalletInstance);
      expect(await instance.getAddress()).toBe('0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf');
    });
  });
});
