import type { ErrorWithId, LedgerError, U2FError } from '../../types';
import { WalletsError, WalletsErrorCode } from '../../types';

export const isU2FError = (err: LedgerError): err is U2FError =>
  err !== undefined && (err as U2FError).originalError?.metaData !== undefined;
export const isErrorWithId = (err: LedgerError): err is ErrorWithId =>
  Object.prototype.hasOwnProperty.call(err, 'id') &&
  Object.prototype.hasOwnProperty.call(err, 'message');

export const wrapLedgerError = (err: LedgerError) => {
  throw standardizeLedgerErr(err);
};

export const standardizeLedgerErr = (err: LedgerError): WalletsError => {
  // https://developers.yubico.com/U2F/Libraries/Client_error_codes.html
  if (isU2FError(err)) {
    // Timeout
    if (err.originalError.metaData.code === 5) {
      return new WalletsError('The request timed out.', WalletsErrorCode.TIMEOUT, err);
    }

    return new WalletsError(err.message, WalletsErrorCode.UNKNOWN, err);
  }

  if (isErrorWithId(err)) {
    // Browser doesn't support U2F
    if (err.message.includes('U2F not supported')) {
      return new WalletsError(
        'The U2F standard that hardware wallets use does not seem to be supported by your browser. Please try again using Google Chrome.',
        WalletsErrorCode.HW_U2F_NOT_SUPPORTED,
        err
      );
    }
  }

  // Wrong app logged into || Not in an app
  if (
    err.message.includes('6804') ||
    err.message.includes('6d00') ||
    err.message.includes('6700')
  ) {
    return new WalletsError(
      'Incorrect network application selected on your Ledger device. Please select the application for the correct network.',
      WalletsErrorCode.HW_WRONG_APP,
      err
    );
  }

  // Other
  return new WalletsError(err.message, WalletsErrorCode.UNKNOWN, err);
};

export const standardizeTrezorErr = (err: { error: string; code?: string }): WalletsError => {
  if (err.error.includes('Iframe blocked')) {
    return new WalletsError(err.error, WalletsErrorCode.HW_IFRAME_BLOCKED);
  } else if (err.error.includes('Iframe timeout')) {
    return new WalletsError(err.error, WalletsErrorCode.TIMEOUT);
  } else if (err.error.includes('Cancelled')) {
    return new WalletsError(err.error, WalletsErrorCode.CANCELLED);
  } else if (err.error.includes('Popup closed')) {
    return new WalletsError(err.error, WalletsErrorCode.CANCELLED);
  } else if (err.error.includes('Permissions not granted')) {
    return new WalletsError(err.error, WalletsErrorCode.CANCELLED);
  }

  // Other
  return new WalletsError(err.error, WalletsErrorCode.UNKNOWN, new Error(err.error));
};

export const wrapGridPlusError = (err: Error | string) => {
  throw standardizeGridPlusErr(err);
};

export const standardizeGridPlusErr = (err: Error | string): WalletsError => {
  const message = typeof err === 'string' ? err : err.message;
  if (message.includes('Timeout waiting for device')) {
    return new WalletsError(message, WalletsErrorCode.TIMEOUT);
  } else if (message.includes('Request Declined by User')) {
    return new WalletsError(message, WalletsErrorCode.CANCELLED);
  }

  // Other
  return new WalletsError(message, WalletsErrorCode.UNKNOWN, new Error(message));
};
