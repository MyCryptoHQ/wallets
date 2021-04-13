import { addHexPrefix, stripHexPrefix } from './hexPrefix';

describe('addHexPrefix', () => {
  it('adds hex prefix to regular string', () => {
    const actual = addHexPrefix('ABCDEF1234');
    expect(actual).toBe('0xABCDEF1234');
  });

  it('does nothing when a hex prefix is present in a string', () => {
    const actual = addHexPrefix('0xABCDEF1234');
    expect(actual).toBe('0xABCDEF1234');
  });
});

describe('stripHexPrefix', () => {
  it('strips out the hex prefix from a hex string', () => {
    const actual = stripHexPrefix('0xABCDEF1234');
    expect(actual).toBe('ABCDEF1234');
  });

  it('does nothing when no hex prefix is present in a string', () => {
    const actual = stripHexPrefix('ABCDEF1234');
    expect(actual).toBe('ABCDEF1234');
  });
});
