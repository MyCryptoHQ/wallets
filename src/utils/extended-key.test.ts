import { createExtendedPublicKey, getSegmentNumber } from './extended-key';

describe('createExtendedPublicKey', () => {
  it('calculates an extended public key', () => {
    const parentKey = {
      publicKey: '0x02d54226ceac221f494aa1888252f47220e9d4cf0ddc11a651433bcad6364ee2af',
      chainCode: '0xf34046e410a060091825436065aa12e074c6c8f348e3528578e902777789d0b5'
    };

    const childKey = {
      publicKey: '0x034d7509b2ddb7179364109b16ea95c8282ff05c6866ae760b22eca20b8e66dc9a',
      chainCode: '0x7968ee36e0b6d94da4551bac811e7816115d4ebb9e15a6f4068bbc29736d4576'
    };

    expect(createExtendedPublicKey("m/44'/60'/0'/0", parentKey, childKey)).toBe(
      'xpub6DreGKvTo5gf1tXu5N86sz922cFfACvEj8oUrL1nJAbngaMriFQDYk3vA1vpXXGyD5MtH2tbQ8JJScFki5TNSJtRF9T2Qq6ZNLSDhRk2bqc'
    );
  });
});

describe('getSegmentNumber', () => {
  it('returns the segment number for a derivation path', () => {
    expect(getSegmentNumber('123')).toBe(123);
    expect(getSegmentNumber("123'")).toBe(0x80000000 + 123);
  });

  it('throws for invalid segments', () => {
    expect(() => getSegmentNumber('foo')).toThrow();
  });
});
