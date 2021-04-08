/**
 * @jest-environment node
 */

import { fKeystoreVectors } from '@fixtures';

import { Keystore } from './keystore';

describe('Keystore', () => {
  it.concurrent.each(fKeystoreVectors.presale)(
    'decrypts a presale keystore file with a password',
    async ({ json, password, privateKey }) => {
      const wallet = new Keystore(JSON.stringify(json), password);
      await expect(wallet.getPrivateKey()).resolves.toBe(privateKey);
    }
  );

  it.concurrent.each(fKeystoreVectors.v1)(
    'decrypts a v1 keystore file with a password',
    async ({ json, password, privateKey }) => {
      const wallet = new Keystore(JSON.stringify(json), password);
      await expect(wallet.getPrivateKey()).resolves.toBe(privateKey);
    }
  );

  it.concurrent.each(fKeystoreVectors.v2)(
    'decrypts a v2 keystore file',
    async ({ json, privateKey }) => {
      const wallet = new Keystore(JSON.stringify(json), undefined);
      await expect(wallet.getPrivateKey()).resolves.toBe(privateKey);
    }
  );

  it.concurrent.each(fKeystoreVectors.v3)(
    'decrypts a v3 keystore file with a password',
    async ({ json, password, privateKey }) => {
      const wallet = new Keystore(JSON.stringify(json), password);
      await expect(wallet.getPrivateKey()).resolves.toBe(privateKey);
    }
  );

  it.concurrent.each(fKeystoreVectors.invalid)(
    'throws on invalid keystore files',
    async ({ json, password }) => {
      expect(() => new Keystore(JSON.stringify(json), password)).toThrow();
    }
  );
});
