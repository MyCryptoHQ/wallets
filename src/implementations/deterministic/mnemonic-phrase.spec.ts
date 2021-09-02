import {
  fAddress,
  fHardenedAddress,
  fMnemonicPhrase,
  fPrivateKey,
  fSignedTokenTx,
  fSignedTx,
  fSignedTxEIP1559,
  fTransactionRequest,
  fTransactionRequestEIP1559,
  fTransactionRequestToken
} from '../../../.jest/__fixtures__';
import { DEFAULT_ETH, LEDGER_LIVE_ETH } from '../../dpaths';
import { MnemonicPhrase } from './mnemonic-phrase';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest
    .fn()
    .mockImplementation(() => [
      223,
      155,
      243,
      126,
      111,
      205,
      249,
      191,
      55,
      230,
      252,
      223,
      155,
      243,
      126,
      8
    ])
}));

describe('Mnemonic Phrase', () => {
  it('derives addresses correctly', async () => {
    return expect(
      new MnemonicPhrase(fMnemonicPhrase).getAddresses({ path: DEFAULT_ETH, limit: 5 })
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
      })
    ]);
  });

  it('derives hardened addresses correctly', async () => {
    return expect(
      new MnemonicPhrase(fMnemonicPhrase).getAddresses({ path: LEDGER_LIVE_ETH, limit: 5 })
    ).resolves.toStrictEqual([
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

  it('fetches multiple addresses for multiple derivation paths', async () => {
    await expect(
      new MnemonicPhrase(fMnemonicPhrase).getAddressesWithMultipleDPaths([
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

  it('derives address correctly', async () => {
    return expect(new MnemonicPhrase(fMnemonicPhrase).getAddress(DEFAULT_ETH, 0)).resolves.toEqual(
      fAddress
    );
  });

  it('derives hardened address correctly', async () => {
    return expect(
      new MnemonicPhrase(fMnemonicPhrase).getAddress(LEDGER_LIVE_ETH, 1)
    ).resolves.toEqual(fHardenedAddress);
  });

  it('creates mnemonic correctly', async () => {
    const mnemonic = await MnemonicPhrase.create();
    return expect(mnemonic.mnemonicPhrase).toEqual(fMnemonicPhrase);
  });

  it('wallet signs transaction correctly', async () => {
    const wallet = await new MnemonicPhrase(fMnemonicPhrase).getWallet(DEFAULT_ETH, 0);
    return expect(wallet.signTransaction(fTransactionRequest)).resolves.toBe(fSignedTx);
  });

  it('wallet signs EIP 1559 transaction correctly', async () => {
    const wallet = await new MnemonicPhrase(fMnemonicPhrase).getWallet(DEFAULT_ETH, 0);
    return expect(wallet.signTransaction(fTransactionRequestEIP1559)).resolves.toBe(
      fSignedTxEIP1559
    );
  });

  it('wallet signs EIP token transaction correctly', async () => {
    const wallet = await new MnemonicPhrase(fMnemonicPhrase).getWallet(DEFAULT_ETH, 0);
    return expect(wallet.signTransaction(fTransactionRequestToken)).resolves.toBe(fSignedTokenTx);
  });

  it('wallet derives address correctly', async () => {
    const wallet = await new MnemonicPhrase(fMnemonicPhrase).getWallet(DEFAULT_ETH, 0);
    return expect(wallet.getAddress()).resolves.toBe(fAddress);
  });

  it('wallet returns its private key correctly', async () => {
    const wallet = await new MnemonicPhrase(fMnemonicPhrase).getWallet(DEFAULT_ETH, 0);
    return expect(wallet.getPrivateKey()).resolves.toBe(fPrivateKey);
  });
});
