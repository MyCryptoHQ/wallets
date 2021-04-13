import type { DerivationPath } from '../dpaths';

export const getFullPath = (path: DerivationPath, index: number): string =>
  path.path.replace('<account>', index.toString(10));

export const getPathPrefix = (derivationPath: string): string => {
  const segments = derivationPath.split('/').slice(0, -1);

  return segments.join('/');
};
