import { TransportStatusError } from '@ledgerhq/errors';

import { WalletsErrorCode } from '../../types';
import { standardizeTrezorErr, wrapGridPlusError, wrapLedgerError } from './errors';

describe('wrapLedgerError', () => {
  it('throws U2F timeout error', () => {
    expect(() =>
      wrapLedgerError({
        message: 'foo',
        name: 'U2FError',
        originalError: { metaData: { code: 5 } }
      })
    ).toThrow('The request timed out.');
  });

  it('throws U2F metadata error', () => {
    expect(() =>
      wrapLedgerError({
        message: 'foo',
        name: 'U2FError',
        originalError: { metaData: { code: 1 } }
      })
    ).toThrow('foo');
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
    expect(() => wrapLedgerError(new Error('Foo'))).toThrow('Foo');
  });
});

describe('standardizeTrezorErr', () => {
  it('returns IFrame blocked error', () => {
    const err = standardizeTrezorErr({
      error: 'Iframe blocked'
    });
    expect(err.errorCode).toBe(WalletsErrorCode.HW_IFRAME_BLOCKED);
    expect(err.message).toBe('Iframe blocked');
  });

  it('returns Timeout error', () => {
    const err = standardizeTrezorErr({
      error: 'Iframe timeout'
    });
    expect(err.errorCode).toBe(WalletsErrorCode.TIMEOUT);
    expect(err.message).toBe('Iframe timeout');
  });

  it('returns Cancelled error', () => {
    const err = standardizeTrezorErr({
      error: 'Cancelled'
    });
    expect(err.errorCode).toBe(WalletsErrorCode.CANCELLED);
    expect(err.message).toBe('Cancelled');
  });

  it('returns Popup closed error', () => {
    const err = standardizeTrezorErr({
      error: 'Popup closed'
    });
    expect(err.errorCode).toBe(WalletsErrorCode.CANCELLED);
    expect(err.message).toBe('Popup closed');
  });

  it('returns Permissions not granted error', () => {
    const err = standardizeTrezorErr({
      error: 'Permissions not granted'
    });
    expect(err.errorCode).toBe(WalletsErrorCode.CANCELLED);
    expect(err.message).toBe('Permissions not granted');
  });

  it('returns unknown error', () => {
    const err = standardizeTrezorErr({
      error: 'Foo'
    });
    expect(err.errorCode).toBe(WalletsErrorCode.UNKNOWN);
    expect(err.message).toBe('Foo');
  });
});

describe('wrapGridPlusError', () => {
  it('throws timeout error', () => {
    expect(() => wrapGridPlusError('Timeout waiting for device')).toThrow(
      'Timeout waiting for device'
    );
  });

  it('throws cancel error', () => {
    expect(() => wrapGridPlusError('Request Declined by User')).toThrow('Request Declined by User');
  });

  it('throws unknown error', () => {
    expect(() => wrapGridPlusError(new Error('Foo'))).toThrow('Foo');
  });
});
