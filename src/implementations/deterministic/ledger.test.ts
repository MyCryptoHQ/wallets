import { createTransportReplayer, RecordStore } from '@ledgerhq/hw-transport-mocker';

import { DEFAULT_ETH, LEDGER_LIVE_ETH } from '@dpaths';
import { LedgerWallet, LedgerWalletInstance } from '@implementations/deterministic/ledger';
import { getFullPath } from '@utils';

// To record a test, use a Ledger device initialised with the mnemonic phrase "test test test test test test test test
// test test test ball," and use the following code:
//
// const recordStore = new RecordStore();
// const Transport = createTransportRecorder(TransportNodeHid, recordStore);
// const wallet = new LedgerWallet(await Transport.create());
//
// await expect(wallet.getAddress(DEFAULT_ETH, 0)).resolves.toBe('0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf');
// await expect(wallet.getAddress(DEFAULT_ETH, 1)).resolves.toBe('0x59A897A2dbd55D20bCC9B52d5eaA14E2859Dc467');
//
// console.log(recordStore.toString());

describe('LedgerWallet', () => {
  describe('getAddress', () => {
    it('fetches an address from the device', async () => {
      const store = RecordStore.fromString(`
        => e002000015058000002c8000003c800000000000000000000000
        <= 4104b884d0c53b60fb8aafba20ca84870f20428082863f1d39a402c36c2de356cb0c6c0a582f54ee29911ca6f1823d34405623f4a7418db8ebb0203bc3acba08ba6428633644356133633938454339303733423534464130393639393537426435383265384438373462669000
        => e002000015058000002c8000003c800000000000000000000001
        <= 4104b21938e18aec1e2e7478988ccae5b556597d771c8e46ac2c8ea2a4a1a80619679230a109cd30e8af15856b15799e38991e45e55f406a8a24d5605ba0757da53c28353941383937413264626435354432306243433942353264356561413134453238353944633436379000
      `);

      const transport = createTransportReplayer(store);
      const wallet = new LedgerWallet(await transport.create());

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
      const store = RecordStore.fromString(`
        => e002000015058000002c8000003c800000000000000000000000
        <= 4104b884d0c53b60fb8aafba20ca84870f20428082863f1d39a402c36c2de356cb0c6c0a582f54ee29911ca6f1823d34405623f4a7418db8ebb0203bc3acba08ba6428633644356133633938454339303733423534464130393639393537426435383265384438373462669000
        => e002000015058000002c8000003c800000010000000000000000
        <= 4104ecc55657c13ddfb60cd03a6787bfd524cc960570d7a84f987126f337c1c7cf0eeda2877ce13ee570bbe32ef47c603feb8acf63c4ff350e98f0251bdabfcf76dc28334645373033613230333543423335393043383635613039463535366544646130326232436631329000
      `);

      const transport = createTransportReplayer(store);
      const wallet = new LedgerWallet(await transport.create());

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
      const store = RecordStore.fromString(`
        => e002000115058000002c8000003c800000000000000000000000
        <= 4104b884d0c53b60fb8aafba20ca84870f20428082863f1d39a402c36c2de356cb0c6c0a582f54ee29911ca6f1823d34405623f4a7418db8ebb0203bc3acba08ba642863364435613363393845433930373342353446413039363939353742643538326538443837346266968a2e8e9aa80d3c3416b33e3d912b6a919af9909f42d29d2eb0b8f28ea4dcfd9000
        => e002000115058000002c8000003c800000000000000000000001
        <= 4104b21938e18aec1e2e7478988ccae5b556597d771c8e46ac2c8ea2a4a1a80619679230a109cd30e8af15856b15799e38991e45e55f406a8a24d5605ba0757da53c28353941383937413264626435354432306243433942353264356561413134453238353944633436376265b647bc0e70480f29856be102fe866ea6a8ec9e2926c198c2e9c4cd268a439000
      `);

      const transport = createTransportReplayer(store);
      const wallet = new LedgerWallet(await transport.create());

      await expect(wallet.getExtendedKey(getFullPath(DEFAULT_ETH, 0))).resolves.toStrictEqual({
        chainCode: '968a2e8e9aa80d3c3416b33e3d912b6a919af9909f42d29d2eb0b8f28ea4dcfd',
        publicKey:
          '04b884d0c53b60fb8aafba20ca84870f20428082863f1d39a402c36c2de356cb0c6c0a582f54ee29911ca6f1823d34405623f4a7418db8ebb0203bc3acba08ba64'
      });
      await expect(wallet.getExtendedKey(getFullPath(DEFAULT_ETH, 1))).resolves.toStrictEqual({
        chainCode: '6265b647bc0e70480f29856be102fe866ea6a8ec9e2926c198c2e9c4cd268a43',
        publicKey:
          '04b21938e18aec1e2e7478988ccae5b556597d771c8e46ac2c8ea2a4a1a80619679230a109cd30e8af15856b15799e38991e45e55f406a8a24d5605ba0757da53c'
      });
    });
  });

  describe('getWallet', () => {
    it('returns an instance of a Ledger wallet at a specific derivation path', async () => {
      const store = RecordStore.fromString(`
        => e002000015058000002c8000003c800000000000000000000000
        <= 4104b884d0c53b60fb8aafba20ca84870f20428082863f1d39a402c36c2de356cb0c6c0a582f54ee29911ca6f1823d34405623f4a7418db8ebb0203bc3acba08ba6428633644356133633938454339303733423534464130393639393537426435383265384438373462669000
      `);

      const transport = createTransportReplayer(store);
      const wallet = new LedgerWallet(await transport.create());

      const instance = await wallet.getWallet(DEFAULT_ETH, 0);

      expect(instance).toBeInstanceOf(LedgerWalletInstance);
      expect(await instance.getAddress()).toBe('0xc6D5a3c98EC9073B54FA0969957Bd582e8D874bf');
    });
  });
});
