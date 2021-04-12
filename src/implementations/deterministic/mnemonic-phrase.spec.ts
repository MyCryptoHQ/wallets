import { DEFAULT_ETH } from '@dpaths';
import { fAddress, fMnemonicPhrase, fPrivateKey, fSignedTx, fTransactionRequest } from '@fixtures';

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
      111,
      205,
      249,
      191,
      55,
      224
    ])
}));

describe('Mnemonic Phrase', () => {
  it('derives addresses correctly', async () => {
    return expect(
      new MnemonicPhrase(fMnemonicPhrase).getAddresses({ path: DEFAULT_ETH, limit: 5 })
    ).resolves.toStrictEqual([
      {
        address: '0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4',
        dPath: "m/44'/60'/0'/0/0",
        index: 0
      },
      {
        address: '0xa34F236d4Ead4D668b9335891f1BC4011A92B2CD',
        dPath: "m/44'/60'/0'/0/1",
        index: 1
      },
      {
        address: '0x5e147f4A4224428c2978dca3A95aee7625FDB3Fd',
        dPath: "m/44'/60'/0'/0/2",
        index: 2
      },
      {
        address: '0xeD10e0cB77695784999ec89dDdf8504475b78ef0',
        dPath: "m/44'/60'/0'/0/3",
        index: 3
      },
      {
        address: '0xF2919D8C1a771945cC0d38a42255e7228B8089fd',
        dPath: "m/44'/60'/0'/0/4",
        index: 4
      }
    ]);
  });
  it('derives address correctly', async () => {
    return expect(new MnemonicPhrase(fMnemonicPhrase).getAddress(DEFAULT_ETH, 0)).resolves.toEqual(
      fAddress
    );
  });

  it('creates mnemonic correctly', async () => {
    const mnemonic = await MnemonicPhrase.create();
    return expect(mnemonic.mnemonicPhrase).toEqual(fMnemonicPhrase);
  });

  it('wallet signs transaction correctly', async () => {
    const wallet = await new MnemonicPhrase(fMnemonicPhrase).getWallet(DEFAULT_ETH, 0);
    return expect(wallet.signTransaction(fTransactionRequest)).resolves.toBe(fSignedTx);
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
