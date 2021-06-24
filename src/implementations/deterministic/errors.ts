import type { ErrorWithId, LedgerError, U2FError } from '../../types';

export const isU2FError = (err: LedgerError): err is U2FError =>
  !!err && !!(err as U2FError).metaData;
export const isErrorWithId = (err: LedgerError): err is ErrorWithId =>
  Object.prototype.hasOwnProperty.call(err, 'id') &&
  Object.prototype.hasOwnProperty.call(err, 'message');

export const wrapLedgerError = (err: LedgerError): void => {
  throw new Error(ledgerErrToMessage(err));
};

export const ledgerErrToMessage = (err: LedgerError): string => {
  // https://developers.yubico.com/U2F/Libraries/Client_error_codes.html
  if (isU2FError(err)) {
    // Timeout
    if (err.metaData.code === 5) {
      return 'The request timed out.';
    }

    return err.metaData.type;
  }

  if (isErrorWithId(err)) {
    // Browser doesn't support U2F
    if (err.message.includes('U2F not supported')) {
      return 'The U2F standard that hardware wallets use does not seem to be supported by your browser. Please try again using Google Chrome.';
    }
  }

  // Wrong app logged into || Not in an app
  if (
    err.message.includes('6804') ||
    err.message.includes('6d00') ||
    err.message.includes('6700')
  ) {
    return 'Incorrect network application selected on your Ledger device. Please select the application for the correct network.';
  }

  // Other
  return err.toString();
};
