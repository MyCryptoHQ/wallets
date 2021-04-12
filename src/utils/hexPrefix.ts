export const addHexPrefix = (str: string): string => (str.startsWith('0x') ? str : `0x${str}`);

export const stripHexPrefix = (str: string): string =>
  str.startsWith('0x') ? str.substring(2) : str;
