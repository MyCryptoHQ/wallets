import keystores from './keystore.json';

export const fPrivateKey = '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577';

// Encrypted version of the private key above
export const fKeystore = JSON.stringify(keystores.v3[0].json);
export const fKeystorePassword = keystores.v3[0].password;

export const fKeystoreVectors = keystores;
