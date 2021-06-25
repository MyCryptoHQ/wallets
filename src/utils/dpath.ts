import type { DerivationPath } from '../dpaths';
import { ALL_DERIVATION_PATHS } from '../dpaths';

export const getFullPath = (path: DerivationPath, index: number): string =>
  path.path.replace('<account>', index.toString(10));

export const getPathPrefix = (derivationPath: string): string => {
  const segments = derivationPath.split('/').slice(0, -1);

  return segments.join('/');
};

export const getDerivationPath = (
  raw: string,
  paths: DerivationPath[] = ALL_DERIVATION_PATHS
): [DerivationPath, number] | undefined => {
  const rawSegments = raw.split('/');
  const derivationPath = paths.find((path) => {
    const segments = path.path.split('/');
    const lastIndex = segments.length - 1;
    return (
      segments.length === rawSegments.length &&
      segments[1] === rawSegments[1] && // Check purpose match (should always be 44' but whatever)
      segments[2] === rawSegments[2] && // Check coin type match
      (path.isHardened || segments[3] === rawSegments[3]) && // Check account match for non-hardened paths
      (!path.isHardened || segments[lastIndex] === rawSegments[lastIndex]) // Check address match for hardened paths
    );
  });
  if (derivationPath) {
    const indexSegment = derivationPath.path
      .split('/')
      .findIndex((segment) => segment === '<account>' || segment === "<account>'");
    const index = rawSegments[indexSegment];
    return [derivationPath, parseInt(index, 10)];
  }
};
