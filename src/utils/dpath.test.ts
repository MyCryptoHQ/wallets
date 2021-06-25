import {
  DEFAULT_ETC,
  DEFAULT_ETH,
  LEDGER_ETC,
  LEDGER_ETH,
  LEDGER_LIVE_ETC,
  LEDGER_LIVE_ETH
} from '../dpaths';
import { getDerivationPath } from './dpath';

describe('getDerivationPath', () => {
  it('gets a derivation path object and index for a derivation path string', () => {
    expect(getDerivationPath("m/44'/60'/0'/0/0")).toStrictEqual([DEFAULT_ETH, 0]);
    expect(getDerivationPath("m/44'/61'/0'/0/5")).toStrictEqual([DEFAULT_ETC, 5]);
    expect(getDerivationPath("m/44'/60'/0'/123")).toStrictEqual([LEDGER_ETH, 123]);
    expect(getDerivationPath("m/44'/60'/160720'/0'/456")).toStrictEqual([LEDGER_ETC, 456]);
    expect(getDerivationPath("m/44'/60'/1'/0/0")).toStrictEqual([LEDGER_LIVE_ETH, 1]);
    expect(getDerivationPath("m/44'/61'/10'/0/0")).toStrictEqual([LEDGER_LIVE_ETC, 10]);
  });
});
