export enum WALLET_CONNECTIVITY {
  WEB3 = 'web3',
  MYCRYPTO = 'mycrypto',
  LEDGER = 'ledger',
  TREZOR = 'trezor',
  WALLET_CONNECT = 'wallet-connect',
  INTERFACE = 'interface',
  VIEW_ONLY = 'view-only',
  MIGRATE_CUSTODIAL = 'migrate-custodial',
  MIGRATE_NONCUSTODIAL = 'migrate-noncustodial'
}

export enum WALLET_TYPES {
  WALLET = 'wallet',
  INTERFACE = 'interface',
  EXCHANGE = 'exchange'
}

export enum WALLET_TAGS {
  HARDWARE = 'Hardware',
  WEB = 'Web',
  WEB3 = 'Web3',
  ENTERPRISE = 'Enterprise',
  TELEGRAM = 'Telegram',
  BROWSER_BASED = 'Browser Based',
  MOBILE = 'Mobile',
  DESKTOP = 'Desktop',
  EXCHANGE = 'Exchange',
  WALLET = 'Wallet',
  WALLET_CONNECT = 'Wallet Connect',
  BRIDGE = 'Bridge'
}

export interface IWallet {
  name: string;
  id: string;
  desc: string;
  type?: WALLET_TYPES;
  connectivity: WALLET_CONNECTIVITY;
  icon?: string;
  tags?: WALLET_TAGS[];
  urls: {
    website?: string;
    support?: string;
  };
  priority: number;
  mostPopular?: boolean;
}
