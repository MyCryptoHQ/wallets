import {
  fAddress,
  fMessageToSign,
  fSignedMessage,
  fSignedTx,
  fSignedTxContractDeployment,
  fSignedTxEIP1559,
  fTransactionRequest,
  fTransactionRequestEIP1559,
  fTransactionRequestEIP1559ContractDeployment
} from '../../../.jest/__fixtures__';
import { DEFAULT_ETH, LEDGER_LIVE_ETH } from '../../dpaths';
import { getFullPath } from '../../utils';
import { GridPlusWallet, GridPlusWalletInstance } from './gridplus';

const config = { name: 'MyCrypto', deviceID: 'foo', password: 'bar' };
const origin = 'https://wallet.gridplus.io';

describe('GridPlusWalletInstance', () => {
  describe('pairing', () => {
    jest.useFakeTimers();
    it('handles pairing using popup if needed', async () => {
      const postMessage = jest.fn();
      window.open = jest.fn().mockReturnValue({ postMessage });
      window.addEventListener = jest.fn().mockImplementation((_type, callback) => {
        callback({ origin, data: JSON.stringify(config) });
      });

      const wallet = new GridPlusWallet({ name: config.name });
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      expect(window.open).toHaveBeenCalled();
      expect(postMessage).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();

      await expect(instance.signTransaction(fTransactionRequest)).resolves.toBe(fSignedTx);
    });

    it('handles pairing using popup if invalid credentials', async () => {
      const postMessage = jest.fn();
      window.open = jest.fn().mockReturnValue({ postMessage });
      window.addEventListener = jest.fn().mockImplementation((_type, callback) => {
        callback({ origin, data: JSON.stringify(config) });
      });

      const wallet = new GridPlusWallet({ ...config, deviceID: 'somethingelse' });
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      expect(window.open).toHaveBeenCalled();
      expect(postMessage).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();

      await expect(instance.signTransaction(fTransactionRequest)).resolves.toBe(fSignedTx);
    });

    it('rejects if credentials are not in response', async () => {
      const postMessage = jest.fn();
      window.open = jest.fn().mockReturnValue({ postMessage });
      window.addEventListener = jest.fn().mockImplementation((_type, callback) => {
        callback({ origin, data: JSON.stringify({}) });
      });

      const wallet = new GridPlusWallet({ name: config.name });

      await expect(wallet.getWallet(DEFAULT_ETH, 0)).rejects.toThrow(
        'Invalid credentials returned from Lattice.'
      );

      expect(window.open).toHaveBeenCalled();
      expect(postMessage).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();
    });

    it('rejects in case of errors', async () => {
      const postMessage = jest.fn();
      window.open = jest.fn().mockReturnValue({ postMessage });
      window.addEventListener = jest.fn().mockImplementation((_type, callback) => {
        callback({ origin: '', data: '' });
        callback({ origin, data: '' });
      });

      const wallet = new GridPlusWallet({ name: config.name });

      await expect(wallet.getWallet(DEFAULT_ETH, 0)).rejects.toThrow(
        'Unexpected end of JSON input'
      );

      expect(window.open).toHaveBeenCalled();
      expect(postMessage).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();
    });

    it('throws if popup fails', async () => {
      window.open = jest.fn().mockReturnValue(null);

      const wallet = new GridPlusWallet({ name: config.name });

      await expect(wallet.getWallet(DEFAULT_ETH, 0)).rejects.toThrow('Popup blocked');
    });

    it('throws on popup closed', async () => {
      const postMessage = jest.fn();
      window.open = jest.fn().mockReturnValue({ postMessage, closed: true });
      window.addEventListener = jest.fn();

      const wallet = new GridPlusWallet({ name: config.name });

      const promise = wallet.getWallet(DEFAULT_ETH, 0);
      jest.runOnlyPendingTimers();

      await expect(promise).rejects.toThrow('Popup closed');

      expect(window.open).toHaveBeenCalled();
      expect(postMessage).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();
    });
  });

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

    it('signs a transaction without data', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(
        instance.signTransaction({ ...fTransactionRequestEIP1559, data: undefined })
      ).resolves.toBe(fSignedTxEIP1559);
    });

    it('signs a contract deployment transaction', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(
        instance.signTransaction(fTransactionRequestEIP1559ContractDeployment)
      ).resolves.toBe(fSignedTxContractDeployment);
    });

    it('signs a EIP 1559 transaction with v = 0', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      await expect(
        instance.signTransaction({ ...fTransactionRequestEIP1559, nonce: 2 })
      ).resolves.toBe(
        '0x02f8720302843b9aca008504a817c80082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc1000080c080a061a7b508904a02b32614101fcff8f3f0bacdaa875bf36ec558fab82b9e0181a7a0310cc4d60f43bd5514a24212df28aecaf56fa0aea458d4c7c74c9f4ca1fe5c0d'
      );
    });

    it('signs a transaction with generic signing', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      jest
        // @ts-expect-error Spying on private field
        .spyOn(instance['client'], 'getFwVersion')
        .mockReturnValueOnce({ major: 0, minor: 15, fix: 0 });

      await expect(instance.signTransaction(fTransactionRequest)).resolves.toBe(fSignedTx);
    });

    it('signs a EIP 1559 transaction with generic signing', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      jest
        // @ts-expect-error Spying on private field
        .spyOn(instance['client'], 'getFwVersion')
        .mockReturnValueOnce({ major: 0, minor: 15, fix: 0 });

      await expect(instance.signTransaction(fTransactionRequestEIP1559)).resolves.toBe(
        fSignedTxEIP1559
      );
    });

    it('signs a transaction without data with generic signing', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      jest
        // @ts-expect-error Spying on private field
        .spyOn(instance['client'], 'getFwVersion')
        .mockReturnValueOnce({ major: 0, minor: 15, fix: 0 });

      await expect(
        instance.signTransaction({ ...fTransactionRequestEIP1559, data: undefined })
      ).resolves.toBe(fSignedTxEIP1559);
    });

    it('signs a contract deployment transaction with generic signing', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      jest
        // @ts-expect-error Spying on private field
        .spyOn(instance['client'], 'getFwVersion')
        .mockReturnValueOnce({ major: 0, minor: 15, fix: 0 });

      await expect(
        instance.signTransaction(fTransactionRequestEIP1559ContractDeployment)
      ).resolves.toBe(fSignedTxContractDeployment);
    });

    it('signs a EIP 1559 transaction with v = 0 with generic signing', async () => {
      const wallet = new GridPlusWallet(config);
      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      jest
        // @ts-expect-error Spying on private field
        .spyOn(instance['client'], 'getFwVersion')
        .mockReturnValueOnce({ major: 0, minor: 15, fix: 0 });

      await expect(
        instance.signTransaction({ ...fTransactionRequestEIP1559, nonce: 2 })
      ).resolves.toBe(
        '0x02f8720302843b9aca008504a817c80082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc1000080c080a061a7b508904a02b32614101fcff8f3f0bacdaa875bf36ec558fab82b9e0181a7a0310cc4d60f43bd5514a24212df28aecaf56fa0aea458d4c7c74c9f4ca1fe5c0d'
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

      await expect(() => wallet.getExtendedKey(getFullPath(DEFAULT_ETH, 0))).rejects.toThrow(
        'Method not implemented.'
      );
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

  describe('getCredentials', () => {
    it('returns credentials', async () => {
      const wallet = new GridPlusWallet(config);

      expect(wallet.getCredentials()).toStrictEqual({
        deviceID: config.deviceID,
        password: config.password
      });
    });
  });
});
