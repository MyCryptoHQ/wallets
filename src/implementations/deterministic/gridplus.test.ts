import {
  fAddress,
  fMessageToSign,
  fSignedMessage,
  fSignedTx,
  fSignedTxEIP1559,
  fTransactionRequest,
  fTransactionRequestEIP1559
} from '../../../.jest/__fixtures__';
import { DEFAULT_ETH, LEDGER_LIVE_ETH } from '../../dpaths';
import { GridPlusWallet, GridPlusWalletInstance } from './gridplus';

const config = { name: 'MyCrypto', deviceID: 'foo', password: 'bar' };

describe('GridPlusWalletInstance', () => {
  describe('signTransaction', () => {
    it('signs a transaction', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(instance.signTransaction(fTransactionRequest)).resolves.toBe(fSignedTx);
    });

    it('signs a EIP 1559 transaction', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(instance.signTransaction(fTransactionRequestEIP1559)).resolves.toBe(
        fSignedTxEIP1559
      );
    });

    it('throws if the chain ID or nonce is undefined', async () => {
      const wallet = new GridPlusWallet(config);
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
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(instance.getAddress()).resolves.toBe(
        '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
      );
    });

    it('returns cached address if passed', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0, fAddress);

      await expect(instance.getAddress()).resolves.toBe(fAddress);
    });
  });

  describe('getPrivateKey', () => {
    it('throws an error', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(() => instance.getPrivateKey()).rejects.toThrow('Method not implemented.');
    });
  });

  describe('signMessage', () => {
    it('signs a message', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(instance.signMessage(fMessageToSign)).resolves.toBe(fSignedMessage);
    });
  });
});

describe('GridPlusWallet', () => {
  describe('getAddress', () => {
    it('fetches an address from the device', async () => {
      const wallet = new GridPlusWallet(config);

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
      const wallet = new GridPlusWallet(config);

      await expect(wallet.getHardenedAddress(LEDGER_LIVE_ETH, 0)).resolves.toBe(
        '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf'
      );
      await expect(wallet.getHardenedAddress(LEDGER_LIVE_ETH, 1)).resolves.toBe(
        '0x3FE703a2035CB3590C865a09F556eDda02b2Cf12'
      );
    });
  });

  describe('getAddresses', () => {
    it('fetches multiple addresses for a derivation path', async () => {
      const wallet = new GridPlusWallet(config);

      await expect(wallet.getAddresses({ path: DEFAULT_ETH, limit: 5 })).resolves.toStrictEqual([
        expect.objectContaining({
          address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf',
          dPath: "m/44'/60'/0'/0/0",
          index: 0
        }),
        expect.objectContaining({
          address: '0x59A897A2dbd55D20bCC9B52d5eaA14E2859Dc467',
          dPath: "m/44'/60'/0'/0/1",
          index: 1
        }),
        expect.objectContaining({
          address: '0x7D5e716Bbc8771af9c5ec3b0555B48a4a84d4ba7',
          dPath: "m/44'/60'/0'/0/2",
          index: 2
        }),
        expect.objectContaining({
          address: '0x8137eC5954A8ed45A90F3bd58f717228b5670858',
          dPath: "m/44'/60'/0'/0/3",
          index: 3
        }),
        expect.objectContaining({
          address: '0xc0C386F7f0B02FAC0d63B2de00a01e77992B011B',
          dPath: "m/44'/60'/0'/0/4",
          index: 4
        })
      ]);
    });

    it('fetches multiple addresses for a hardened derivation path', async () => {
      const wallet = new GridPlusWallet(config);

      await expect(wallet.getAddresses({ path: LEDGER_LIVE_ETH, limit: 5 })).resolves.toStrictEqual(
        [
          expect.objectContaining({
            address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf',
            dPath: "m/44'/60'/0'/0/0",
            index: 0
          }),
          expect.objectContaining({
            address: '0x3FE703a2035CB3590C865a09F556eDda02b2Cf12',
            dPath: "m/44'/60'/1'/0/0",
            index: 1
          }),
          expect.objectContaining({
            address: '0x2159a414C4Ac080482CE6F942cc5BC59306a1A47',
            dPath: "m/44'/60'/2'/0/0",
            index: 2
          }),
          expect.objectContaining({
            address: '0xBdec34481829c2396FA15bAc5227D0B05cF3Dc41',
            dPath: "m/44'/60'/3'/0/0",
            index: 3
          }),
          expect.objectContaining({
            address: '0x91e2831A52E4eeE2efa8B05B0bD0C930407495DC',
            dPath: "m/44'/60'/4'/0/0",
            index: 4
          })
        ]
      );
    });
  });

  describe('getAddressesWithMultipleDPaths', () => {
    it('fetches multiple addresses for multiple derivation paths', async () => {
      const wallet = new GridPlusWallet(config);

      await expect(
        wallet.getAddressesWithMultipleDPaths([
          { path: DEFAULT_ETH, limit: 5 },
          { path: LEDGER_LIVE_ETH, limit: 5 }
        ])
      ).resolves.toStrictEqual([
        expect.objectContaining({
          address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf',
          dPath: "m/44'/60'/0'/0/0",
          index: 0
        }),
        expect.objectContaining({
          address: '0x59A897A2dbd55D20bCC9B52d5eaA14E2859Dc467',
          dPath: "m/44'/60'/0'/0/1",
          index: 1
        }),
        expect.objectContaining({
          address: '0x7D5e716Bbc8771af9c5ec3b0555B48a4a84d4ba7',
          dPath: "m/44'/60'/0'/0/2",
          index: 2
        }),
        expect.objectContaining({
          address: '0x8137eC5954A8ed45A90F3bd58f717228b5670858',
          dPath: "m/44'/60'/0'/0/3",
          index: 3
        }),
        expect.objectContaining({
          address: '0xc0C386F7f0B02FAC0d63B2de00a01e77992B011B',
          dPath: "m/44'/60'/0'/0/4",
          index: 4
        }),
        expect.objectContaining({
          address: '0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf',
          dPath: "m/44'/60'/0'/0/0",
          index: 0
        }),
        expect.objectContaining({
          address: '0x3FE703a2035CB3590C865a09F556eDda02b2Cf12',
          dPath: "m/44'/60'/1'/0/0",
          index: 1
        }),
        expect.objectContaining({
          address: '0x2159a414C4Ac080482CE6F942cc5BC59306a1A47',
          dPath: "m/44'/60'/2'/0/0",
          index: 2
        }),
        expect.objectContaining({
          address: '0xBdec34481829c2396FA15bAc5227D0B05cF3Dc41',
          dPath: "m/44'/60'/3'/0/0",
          index: 3
        }),
        expect.objectContaining({
          address: '0x91e2831A52E4eeE2efa8B05B0bD0C930407495DC',
          dPath: "m/44'/60'/4'/0/0",
          index: 4
        })
      ]);
    });
  });

  describe('getExtendedKey', () => {
    it('throws an error', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(() => instance.getPrivateKey()).rejects.toThrow('Method not implemented.');
    });
  });

  describe('getWallet', () => {
    it('returns an instance of a GridPlus wallet at a specific derivation path', async () => {
      const wallet = new GridPlusWallet(config);

      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      expect(instance).toBeInstanceOf(GridPlusWalletInstance);
      expect(await instance.getAddress()).toBe('0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf');
    });
  });
});
