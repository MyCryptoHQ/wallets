import { fMnemonicPhrase } from '../.jest/__fixtures__';
import { DEFAULT_ETH, DEFAULT_EWC } from './dpaths';
import { MnemonicPhrase } from './implementations';

describe('DeterministicWallet', () => {
  describe('getExtendedPublicKey', () => {
    it('returns the extended public key for a derivation path', async () => {
      const wallet = new MnemonicPhrase(fMnemonicPhrase);
      await expect(wallet.getExtendedPublicKey(DEFAULT_ETH)).resolves.toBe(
        'xpub6DreGKvTo5gf1tXu5N86sz922cFfACvEj8oUrL1nJAbngaMriFQDYk3vA1vpXXGyD5MtH2tbQ8JJScFki5TNSJtRF9T2Qq6ZNLSDhRk2bqc'
      );
      await expect(wallet.getExtendedPublicKey(DEFAULT_EWC)).resolves.toBe(
        'xpub6FQGu6T9QDS9sgVVCskXh4Q9nFtZHtB8vYFe93yGkbyn7E8JPzh5RJJoiJYEC1RgoXYc232VhSPpGRBtjU5hPY42QtdkphzXTgJWgHxZ4dT'
      );
    });
  });
});
