export const fTransactionRequest = {
  nonce: 6,
  gasPrice: '0x012a05f200',
  gasLimit: '0x5208',
  to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  value: '0x2386f26fc10000',
  data: '0x',
  chainId: 3
};

export const fTransactionRequestEIP1559 = {
  nonce: 6,
  maxFeePerGas: '0x4a817c800',
  maxPriorityFeePerGas: '0x3b9aca00',
  gasLimit: '0x5208',
  to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  value: '0x2386f26fc10000',
  data: '0x',
  chainId: 3,
  type: 2
};

// Approval TX for 0x token
export const fTransactionRequestToken = {
  ...fTransactionRequestEIP1559,
  data:
    '0x095ea7b3000000000000000000000000221657776846890989a759ba2973e427dff5c9bb0000000000000000000000000000000000000000000000004563918244f40000',
  to: '0xe41d2489571d322189246dafa5ebde1f4699f498',
  chainId: 1
};

export const fSignedTx =
  '0xf86b0685012a05f20082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc100008029a075b96c4423ea79037099e0f8a0fa7d8538f00c6aaddea26e151320aac65ae3bda05266d81476adedc28c5e769f8bf016de33bdaa49f341435df429e01fe5f9b16e';

export const fSignedTokenTx =
  '0xf86b0685012a05f20082520894e41d2489571d322189246dafa5ebde1f4699f498872386f26fc100008026a086fdf8b0c4ba7e59b93f0a81a9d5083835caf56b17aac3fe251f276a10ef33d4a04ec0c25116937acdec4617182127d9f6a9431e837412babd150331d00d5e0ae9';

export const fSignedTxEIP1559 =
  '0x02f8720306843b9aca008504a817c80082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc1000080c001a0884850dc596eac6b74175d2c62deedd9295570808882b0cd9adf47e5ac8b3b3da068881b0ef002d48ef78374d6842ee4987a222a4726af47b5a0a4bcb8f38e2cf3';
