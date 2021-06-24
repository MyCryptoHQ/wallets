import { TransportStatusError } from '@ledgerhq/errors';

import { wrapLedgerError } from './errors';

describe('wrapLedgerError', () => {
  it('throws U2F timeout error', () => {
    expect(() => wrapLedgerError({ metaData: { code: 5, type: 'foo' } })).toThrow(
      'The request timed out.'
    );
  });

  it('throws U2F metadata error', () => {
    expect(() => wrapLedgerError({ metaData: { code: 1, type: 'foo' } })).toThrow('foo');
  });

  it('throws U2F error', () => {
    expect(() =>
      wrapLedgerError({ id: '1', message: 'U2F not supported', name: 'Error', stack: '' })
    ).toThrow(
      'The U2F standard that hardware wallets use does not seem to be supported by your browser. Please try again using Google Chrome.'
    );
  });

  it('throws Wrong App error', () => {
    // @ts-expect-error Bad type?
    expect(() => wrapLedgerError(new TransportStatusError(26368))).toThrow(
      'Incorrect network application selected on your Ledger device. Please select the application for the correct network.'
    );
  });

  it('throws unknown error', () => {
    expect(() => wrapLedgerError(new Error('Foo'))).toThrow('Error: Foo');
  });
});
