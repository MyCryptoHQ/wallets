import { fKeystoreVectors } from '../../.jest/__fixtures__';
import { getKeystoreType, KeystoreType } from './keystore';

describe('getKeystoreType', () => {
  it('returns the type of keystore', () => {
    expect(getKeystoreType(JSON.stringify(fKeystoreVectors.v1[0].json))).toBe(KeystoreType.V1);
    expect(getKeystoreType(JSON.stringify(fKeystoreVectors.v2[0].json))).toBe(KeystoreType.V2);
    expect(getKeystoreType(JSON.stringify(fKeystoreVectors.v3[0].json))).toBe(KeystoreType.V3);
  });

  it('throws if the keystore is not recognized', () => {
    expect(() => getKeystoreType('{}')).toThrow('Invalid keystore file: format not recognized');
  });

  it('throws if the JSON is invalid', () => {
    expect(() => getKeystoreType('foo bar')).toThrow('Invalid keystore file: cannot parse JSON');
  });
});
