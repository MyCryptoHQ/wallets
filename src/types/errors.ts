export interface U2FError extends Error {
  originalError: {
    metaData: {
      code: number;
    };
  };
}

export interface ErrorWithId {
  id: string;
  message: string;
  name: string;
  stack: string;
}

export type LedgerError = U2FError | ErrorWithId | Error;

export enum WalletsErrorCode {
  UNKNOWN,
  TIMEOUT,
  CANCELLED,
  MISSING_ARGUMENTS,
  HW_WRONG_APP,
  HW_U2F_NOT_SUPPORTED,
  HW_IFRAME_BLOCKED,
  HW_POPUP_BLOCKED
}
export class WalletsError extends Error {
  errorCode: WalletsErrorCode;
  originalError?: Error;
  constructor(message: string, errorCode: WalletsErrorCode, originalError?: Error) {
    super(message);
    this.name = 'WalletsError';
    this.errorCode = errorCode;
    this.originalError = originalError;
  }
}
