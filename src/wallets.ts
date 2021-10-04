import {
  privateKey,
  keystoreFile,
  mnemonicPhrase,
  ledger,
  trezor,
  metamask,
  coinbase,
  imtoken,
  trust,
  opera,
  alice,
  alphaWallet,
  argent,
  atomic,
  authereum,
  coinomi,
  coolWallet,
  eidoo,
  equal,
  gnosisSafe,
  gridPlus,
  guarda,
  huobiWallet,
  infinito,
  mathWallet,
  myKey,
  pillar,
  rainbow,
  safepal,
  spatium,
  tokenary,
  tokenPocket,
  torus,
  walletConnect,
  myEtherWallet,
  zerion,
  zapper,
  defiSaver,
  binance,
  kraken,
  huobiGlobal,
  bithumb,
  upbit,
  bitfinex,
  ftx,
  kucoin,
  bitstamp,
  okex,
  coinone,
  jaxx,
  exodus,
  walletLink,
  portis,
  fortmatic,
  keepkey,
  dapper,
  zengo,
  xWallet,
  edge,
  enjin,
  bitbox,
  secalot,
  finney,
  bcVault,
  bitpie,
  buttonWallet,
  coboWallet,
  dexWallet,
  jWallet,
  multis,
  scatter
} from 'assets';
import type { IWallet } from 'types';
import { WALLET_TYPES, WALLET_CONNECTIVITY, WALLET_TAGS } from 'types';

export const wallets: IWallet[] = [
  {
    name: 'Private Key',
    id: 'private-key',
    icon: privateKey,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.MYCRYPTO,
    urls: {},
    priority: 5
  },
  {
    name: 'Keystore File',
    id: 'keystore-file',
    icon: keystoreFile,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.MYCRYPTO,
    urls: {
      support:
        'https://support.mycrypto.com/how-to/accessing-wallet/how-to-access-your-wallet-with-keystore-file'
    },
    priority: 5
  },
  {
    name: 'Mnemonic Phrase',
    id: 'mnemonic-phrase',
    icon: mnemonicPhrase,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.MYCRYPTO,

    urls: {
      support:
        'https://support.mycrypto.com/how-to/accessing-wallet/how-to-access-your-wallet-with-mnemonic-phrase'
    },
    priority: 5
  },
  {
    name: 'Ledger',
    id: 'ledger',
    icon: ledger,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.LEDGER,
    tags: [WALLET_TAGS.HARDWARE],
    urls: {
      website: 'ledger.com',
      support: 'https://support.mycrypto.com/how-to/migrating/moving-from-mycrypto-to-ledger'
    },
    priority: 4
  },
  {
    name: 'Trezor',
    id: 'trezor',
    icon: trezor,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.TREZOR,
    tags: [WALLET_TAGS.HARDWARE],
    urls: {
      website: 'trezor.io',
      support: 'https://support.mycrypto.com/how-to/migrating/moving-from-mycrypto-to-trezor'
    },
    priority: 4
  },
  {
    name: 'MetaMask',
    id: 'metamask',
    icon: metamask,
    desc: 'Metamask is a thing.',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WEB3,
    tags: [WALLET_TAGS.WEB, WALLET_TAGS.MOBILE],
    urls: {
      website: 'metamask.io',
      support: 'https://support.mycrypto.com/how-to/migrating/moving-from-mycrypto-to-metamask'
    },
    priority: 4
  },
  {
    name: 'Coinbase Wallet',
    id: 'coinbase-wallet',
    icon: coinbase,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WEB3,
    tags: [WALLET_TAGS.WALLET_CONNECT, WALLET_TAGS.MOBILE],
    urls: {
      website: 'wallet.coinbase.com'
    },
    priority: 4
  },
  {
    name: 'imToken',
    id: 'imtoken',
    icon: imtoken,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WEB3,
    tags: [WALLET_TAGS.WALLET_CONNECT, WALLET_TAGS.MOBILE],
    urls: {
      website: 'token.im'
    },
    priority: 4
  },
  {
    name: 'Trust',
    id: 'trust',
    icon: trust,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WEB3,
    tags: [WALLET_TAGS.WALLET_CONNECT, WALLET_TAGS.MOBILE],
    urls: {
      website: 'trustwallet.com'
    },
    priority: 4
  },
  {
    name: 'Opera',
    id: 'opera',
    desc: '',
    icon: opera,
    connectivity: WALLET_CONNECTIVITY.WEB3,
    tags: [WALLET_TAGS.MOBILE, WALLET_TAGS.WEB],
    urls: {
      website: 'opera.com/crypto'
    },
    priority: 3
  },
  {
    name: '1inch Wallet',
    id: '1inch-wallet',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://1inch.io/wallet/'
    },
    priority: 3
  },
  {
    name: 'Alice',
    id: 'alice',
    desc: '',
    icon: alice,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'https://alicedapp.com/'
    },
    priority: 1
  },
  {
    name: 'AlphaWallet',
    id: 'alpha-wallet',
    desc: '',
    icon: alphaWallet,
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://alphawallet.com/'
    },
    priority: 2
  },
  {
    name: 'Argent',
    id: 'argent',
    desc: '',
    icon: argent,
    type: WALLET_TYPES.INTERFACE,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT, WALLET_TAGS.MOBILE],
    urls: {
      website: 'https://argent.xyz/'
    },
    priority: 3
  },
  {
    name: 'AT.Wallet',
    id: 'at-wallet',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://authentrend.com/at-wallet/'
    },
    priority: 1
  },
  {
    name: 'AToken Wallet',
    id: 'atoken-wallet',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://atoken.com'
    },
    priority: 1
  },
  {
    name: 'Atomic',
    id: 'atomic',
    icon: atomic,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'atomicwallet.io'
    },
    priority: 2
  },
  {
    name: 'Authereum',
    id: 'authereum',
    icon: authereum,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://authereum.org'
    },
    priority: 3
  },
  {
    name: 'BitKeep',
    id: 'bitkeep',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://bitkeep.com/'
    },
    priority: 2
  },
  {
    name: 'BitPay',
    id: 'bitpay',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://bitpay.com'
    },
    priority: 2
  },
  {
    name: 'Bridge Wallet',
    id: 'bridge-wallet',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://mtpelerin.com/bridge-wallet'
    },
    priority: 2
  },
  {
    name: 'Celo Wallet',
    id: 'celo-wallet',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://celowallet.app/'
    },
    priority: 2
  },
  {
    name: 'cmorq',
    id: 'cmorq',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://cmorq.com/'
    },
    priority: 2
  },
  {
    name: 'Coin98',
    id: 'coin98',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://coin98.app/'
    },
    priority: 2
  },
  {
    name: 'Coinomi',
    id: 'coinomi',
    icon: coinomi,
    desc: '',
    type: WALLET_TYPES.INTERFACE,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'https://coinomi.com/'
    },
    priority: 2
  },
  {
    name: 'CoinUs',
    id: 'coin-us',
    desc: '',
    type: WALLET_TYPES.INTERFACE,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://coinus.io/'
    },
    priority: 2
  },
  {
    name: 'CoolWallet',
    id: 'coolwallet',
    icon: coolWallet,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT, WALLET_TAGS.HARDWARE],
    urls: {
      website: 'https://coolwallet.io/'
    },
    priority: 2
  },
  {
    name: 'Crypto.com',
    id: 'crypto-com',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'crypto.com'
    },
    priority: 3
  },
  {
    name: 'Cybavo Wallet',
    id: 'cybavo-wallet',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://cybavo.com/'
    },
    priority: 2
  },
  {
    name: "D'CENT Wallet",
    id: 'dcent-wallet',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://dcentwallet.com'
    },
    priority: 1
  },
  {
    name: 'Defiant',
    id: 'defiant',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://defiantapp.tech/'
    },
    priority: 1
  },
  {
    name: 'Dharma',
    id: 'dharma',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://www.dharma.io/'
    },
    priority: 3
  },
  {
    name: 'Dok Wallet',
    id: 'dok-wallet',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://dokwallet.com/'
    },
    priority: 1
  },
  {
    name: 'EasyPocket',
    id: 'easy-pocket',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://easypocket.app/'
    },
    priority: 1
  },
  {
    name: 'Eidoo',
    id: 'eidoo',
    icon: eidoo,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://eidoo.io/'
    },
    priority: 2
  },
  {
    name: 'Ellipal',
    id: 'ellipal',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://ellipal.com/'
    },
    priority: 2
  },
  {
    name: 'Equal',
    id: 'equal',
    icon: equal,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'equal.tech'
    },
    priority: 1
  },
  {
    name: 'Flare Wallet',
    id: 'flare-wallet',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://flarewallet.io'
    },
    priority: 1
  },
  {
    name: 'Gnosis Safe',
    id: 'gnosis-safe',
    icon: gnosisSafe,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'https://gnosis-safe.io/'
    },
    priority: 3
  },
  {
    name: 'GridPlus',
    id: 'gridplus',
    icon: gridPlus,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT, WALLET_TAGS.HARDWARE],
    urls: {
      website: 'https://gridplus.io/'
    },
    priority: 3
  },
  {
    name: 'Guarda Wallet',
    id: 'guarda-wallet',
    icon: guarda,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://guarda.com/'
    },
    priority: 2
  },
  {
    name: 'HaloDeFi Wallet',
    id: 'halodefi-wallet',
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://halodefi.org/'
    },
    priority: 1
  },
  {
    name: 'HashKey Me',
    id: 'hashkey-me',
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://me.hashkey.com/'
    },
    priority: 1
  },
  {
    name: 'Huobi Wallet',
    id: 'huobi-wallet',
    icon: huobiWallet,
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://huobiwallet.com/'
    },
    priority: 2
  },
  {
    name: 'Infinito',
    id: 'infinito',
    icon: infinito,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'https://infinitowallet.io/'
    },
    priority: 1
  },
  {
    name: 'Jade Wallet',
    id: 'jade-wallet',
    desc: '',
    type: WALLET_TYPES.INTERFACE,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://jadewallet.io/'
    },
    priority: 1
  },
  {
    name: 'KEYRING PRO',
    id: 'keyring-pro',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://keyring.app/'
    },
    priority: 1
  },
  {
    name: 'KyberSwap',
    id: 'kyber-swap',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'https://kyberswap.com/'
    },
    priority: 1
  },
  {
    name: 'Ledger Live',
    id: 'ledger-live',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://www.ledger.com/'
    },
    priority: 3
  },
  {
    name: 'Loopring Wallet',
    id: 'loopring-wallet',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://loopring.io'
    },
    priority: 1
  },
  {
    name: 'Math',
    id: 'mathwallet',
    icon: mathWallet,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'mathwallet.org'
    },
    priority: 1
  },
  {
    name: 'MetaMask',
    id: 'metamask',
    icon: metamask,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://metamask.io/'
    },
    priority: 4,
    mostPopular: true
  },
  {
    name: 'Midas Wallet',
    id: 'midas-wallet',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    urls: {
      website: 'https://midasprotocol.io/'
    },
    priority: 1
  },
  {
    name: 'MyKey',
    id: 'mykey',
    icon: myKey,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'mykey.org'
    },
    priority: 1
  },
  {
    name: 'Nash',
    id: 'nash',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'https://nash.io/'
    },
    priority: 1
  },
  {
    name: 'O3Wallet',
    id: 'o3wallet',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://o3.network'
    },
    priority: 1
  },
  {
    name: 'ONTO',
    id: 'onto',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://onto.app/'
    },
    priority: 1
  },
  {
    name: 'Ownbit',
    id: 'ownbit',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://ownbit.io/'
    },
    priority: 1
  },
  {
    name: 'PEAKDEFI Wallet',
    id: 'peakdefi-wallet',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://peakdefi.com/'
    },
    priority: 1
  },
  {
    name: 'Pillar',
    id: 'pillar',
    icon: pillar,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'https://pillarproject.io/'
    },
    priority: 1
  },
  {
    name: 'PlasmaPay',
    id: 'plasmapay',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://plasmapay.com/'
    },
    priority: 1
  },
  {
    name: 'QuiverX',
    id: 'quiverx',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://quiverx.io'
    },
    priority: 1
  },
  {
    name: 'Rainbow',
    id: 'rainbow',
    icon: rainbow,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT, WALLET_TAGS.MOBILE],
    urls: {
      website: 'https://trustwallet.com/'
    },
    priority: 4
  },
  {
    name: 'RWallet',
    id: 'rwallet',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://rsk.co/'
    },
    priority: 1
  },
  {
    name: 'SafePal',
    id: 'safepal',
    icon: safepal,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT, WALLET_TAGS.HARDWARE],
    urls: {
      website: 'https://safepal.io/'
    },
    priority: 1
  },
  {
    name: 'SparkPoint',
    id: 'sparkpoint',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://sparkpoint.io/'
    },
    priority: 1
  },
  {
    name: 'Spatium',
    id: 'spatium',
    icon: spatium,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'https://spatium.net/'
    },
    priority: 1
  },
  {
    name: 'Talken Wallet',
    id: 'talken-wallet',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://talken.io'
    },
    priority: 1
  },
  {
    name: 'Tokenary',
    id: 'tokenary',
    icon: tokenary,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'tokenary.io'
    },
    priority: 1
  },
  {
    name: 'TokenPocket',
    id: 'token-pocket',
    icon: tokenPocket,
    desc: '',
    type: WALLET_TYPES.INTERFACE,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.WALLET_CONNECT],
    urls: {
      website: 'https://tokenpocket.pro/'
    },
    priority: 1
  },
  {
    name: 'Tongue Wallet',
    id: 'tongue-wallet',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://www.tongue.fi'
    },
    priority: 1
  },
  {
    name: 'Torus',
    id: 'torus',
    icon: torus,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://toruswallet.io/'
    },
    priority: 1
  },
  {
    name: 'Trustee Wallet',
    id: 'trustee-wallet',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://trusteeglobal.com/'
    },
    priority: 1
  },
  {
    name: 'TrustVault',
    id: 'trustvault',
    icon: trust,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://trustology.io/'
    },
    priority: 1
  },
  {
    name: 'Unstoppable Wallet',
    id: 'unstoppable-wallet',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://unstoppable.money/'
    },
    priority: 1
  },
  {
    name: 'Valora',
    id: 'valora',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://valoraapp.com'
    },
    priority: 1
  },
  {
    name: 'ViaWallet',
    id: 'viawallet',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://viawallet.com/'
    },
    priority: 1
  },
  {
    name: 'Vision',
    id: 'vision',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://vision-crypto.com/'
    },
    priority: 1
  },
  {
    name: 'wallet.io',
    id: 'walletio',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://wallet.io/'
    },
    priority: 1
  },
  {
    name: WALLET_TAGS.WALLET_CONNECT,
    id: 'walletconnect',
    icon: walletConnect,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'walletconnect.org'
    },
    priority: 4
  },
  {
    name: 'Walleth',
    id: 'walleth',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://walleth.org/'
    },
    priority: 2
  },
  {
    name: 'XinFin XDC Network',
    id: 'xinfin',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://www.xinfin.io/'
    },
    priority: 1
  },
  {
    name: 'ZelCore',
    id: 'zelcore',
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.WALLET_CONNECT,

    urls: {
      website: 'https://zel.network'
    },
    priority: 1
  },
  {
    name: 'MyEtherWallet',
    id: 'myetherwallet',
    icon: myEtherWallet,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.INTERFACE,

    urls: {
      website: 'myetherwallet.com'
    },
    priority: 3
  },
  {
    name: 'Zerion',
    id: 'zerion',
    icon: zerion,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.INTERFACE,
    urls: {
      website: 'zerion.io'
    },
    priority: 3
  },
  {
    name: 'InstaDapp',
    id: 'instadapp',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.INTERFACE,
    urls: {
      website: 'instadapp.io'
    },
    priority: 2
  },
  {
    name: 'Zapper',
    id: 'zapper',
    icon: zapper,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.INTERFACE,
    urls: {
      website: 'zapper.fi'
    },
    priority: 3
  },
  {
    name: 'DeFi Saver',
    id: 'defi-saver',
    icon: defiSaver,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.INTERFACE,
    urls: {
      website: 'defisaver.com'
    },
    priority: 1
  },
  {
    name: 'Binance',
    id: 'binance',
    icon: binance,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'binance.com'
    },
    priority: 3
  },
  {
    name: 'Coinbase Pro',
    id: 'coinbase-pro',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'pro.coinbase.com'
    },
    priority: 3
  },
  {
    name: 'Coinbase.com',
    id: 'coinbase.com',
    icon: coinbase,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'coinbase.com'
    },
    priority: 3
  },
  {
    name: 'Kraken',
    id: 'kraken',
    icon: kraken,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'kraken.com',
      support:
        'https://support.kraken.com/hc/en-us/articles/360000672763-How-to-withdraw-cryptocurrencies-from-your-Kraken-account'
    },
    priority: 3
  },
  {
    name: 'Huobi Global',
    id: 'huobi-global',
    icon: huobiGlobal,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'huobi.com'
    },
    priority: 2
  },
  {
    name: 'Bithumb',
    id: 'bithumb',
    icon: bithumb,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'bithumb.com'
    },
    priority: 2
  },
  {
    name: 'Upbit',
    id: 'upbit',
    icon: upbit,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'upbit.com'
    },
    priority: 2
  },
  {
    name: 'Bitfinex',
    id: 'bitfinex',
    icon: bitfinex,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'bitfinex.com'
    },
    priority: 2
  },
  {
    name: 'FTX',
    id: 'ftx',
    icon: ftx,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'ftx.com'
    },
    priority: 3
  },
  {
    name: 'KuCoin',
    id: 'kucoin',
    icon: kucoin,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'kucoin.com'
    },
    priority: 2
  },
  {
    name: 'Bitstamp',
    id: 'bitstamp',
    icon: bitstamp,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'bitstamp.net'
    },
    priority: 1
  },
  {
    name: 'OKEx',
    id: 'okex',
    icon: okex,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'okex.com'
    },
    priority: 1
  },
  {
    name: 'Coinone',
    id: 'coinone',
    icon: coinone,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_CUSTODIAL,
    tags: [WALLET_TAGS.EXCHANGE],
    urls: {
      website: 'coinone.co.kr'
    },
    priority: 1
  },
  {
    name: 'Jaxx',
    id: 'jaxx',
    icon: jaxx,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_NONCUSTODIAL,
    tags: [WALLET_TAGS.DESKTOP, WALLET_TAGS.MOBILE],
    urls: {
      website: 'jaxx.io',
      support: 'https://support.mycrypto.com/how-to/migrating/access-your-jaxx-account-on-mycrypto'
    },
    priority: 2
  },
  {
    name: 'Exodus',
    id: 'exodus',
    icon: exodus,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_NONCUSTODIAL,
    tags: [WALLET_TAGS.DESKTOP, WALLET_TAGS.MOBILE],
    urls: {
      website: 'exodus.io'
    },
    priority: 2
  },
  {
    name: 'MEW Wallet',
    id: 'mew-wallet',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_NONCUSTODIAL,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'mewwallet.com'
    },
    priority: 2
  },
  {
    name: 'WalletLink',
    id: 'walletlink',
    icon: walletLink,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.MIGRATE_NONCUSTODIAL,
    tags: [WALLET_TAGS.BRIDGE],
    urls: {
      website: 'walletlink.org'
    },
    priority: 3
  },

  {
    name: 'Portis',
    id: 'portis',
    icon: portis,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.WALLET],
    urls: {
      website: 'portis.io'
    },
    priority: 1
  },
  {
    name: 'Fortmatic',
    id: 'fortmatic',
    icon: fortmatic,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.WALLET],
    urls: {
      website: 'fortmatic.com'
    },
    priority: 1
  },
  {
    name: 'Authereum',
    id: 'authereum',
    icon: authereum,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.WALLET],
    urls: {
      website: 'authereum.com'
    },
    priority: 1
  },
  {
    name: 'KeepKey',
    id: 'keepkey',
    icon: keepkey,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.HARDWARE],
    urls: {
      website: 'shapeshift.com/keepkey'
    },
    priority: 1
  },
  {
    name: 'Dapper',
    id: 'dapper',
    icon: dapper,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.WEB],
    urls: {
      website: 'meetdapper.com'
    },
    priority: 1
  },
  {
    name: 'ZenGo',
    id: 'zengo',
    icon: zengo,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'zengo.com'
    },
    priority: 1
  },
  {
    name: 'XWallet',
    id: 'xwallet',
    icon: xWallet,
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.HARDWARE],
    urls: {
      website: 'xwallet.pundix.com'
    },
    priority: 1
  },
  {
    name: 'Edge',
    id: 'edge',
    icon: edge,
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'edge.app'
    },
    priority: 1
  },
  {
    name: 'Enjin',
    id: 'enjin',
    icon: enjin,
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'enjinwallet.io'
    },
    priority: 1
  },
  {
    name: 'Guarda',
    id: 'guarda',
    icon: guarda,
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.BROWSER_BASED, WALLET_TAGS.MOBILE],
    urls: {
      website: 'guarda.com'
    },
    priority: 1
  },
  {
    name: 'Bitbox',
    id: 'bitbox',
    icon: bitbox,
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.HARDWARE],
    urls: {
      website: 'https://shiftcrypto.ch/'
    },
    priority: 1
  },
  {
    name: 'Secalot',
    id: 'secalot',
    icon: secalot,
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.HARDWARE],
    urls: {
      website: 'secalot.com'
    },
    priority: 1
  },
  {
    name: 'Finney',
    id: 'finney',
    icon: finney,
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.HARDWARE],
    urls: {
      website: 'sirinlabs.com'
    },
    priority: 1
  },
  {
    name: 'BC Vault',
    id: 'bc-vault',
    icon: bcVault,
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.HARDWARE],
    urls: {
      website: 'bc-vault.com'
    },
    priority: 1
  },
  {
    name: 'AlphaWallet',
    id: 'alphawallet',
    icon: alphaWallet,
    desc: '',
    type: WALLET_TYPES.EXCHANGE,
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'alphawallet.com'
    },
    priority: 1
  },
  {
    name: 'Bitpie',
    id: 'bitpie',
    icon: bitpie,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'bitpie.com'
    },
    priority: 1
  },
  {
    name: 'Button Wallet',
    id: 'button-wallet',
    icon: buttonWallet,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.TELEGRAM],
    urls: {
      website: 'buttonwallet.com'
    },
    priority: 1
  },
  {
    name: 'Cobo Wallet',
    id: 'cobo-wallet',
    icon: coboWallet,
    desc: '',
    type: WALLET_TYPES.WALLET,
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'cobo.com'
    },
    priority: 1
  },
  {
    name: 'Dexwallet',
    id: 'dexwallet',
    icon: dexWallet,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'dexwallet.io'
    },
    priority: 0
  },
  {
    name: 'Eidoo',
    id: 'eidoo',
    icon: eidoo,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'eidoo.io'
    },
    priority: 0
  },
  {
    name: 'Huobi Wallet',
    id: 'huobi-wallet',
    icon: huobiWallet,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'huobiwallet.com'
    },
    priority: 0
  },
  {
    name: 'Jwallet',
    id: 'jwallet',
    icon: jWallet,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.MOBILE],
    urls: {
      website: 'jwallet.network'
    },
    priority: 0
  },
  {
    name: 'Multis',
    id: 'multis',
    icon: multis,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.WEB3, WALLET_TAGS.ENTERPRISE],
    urls: {
      website: 'multis.co'
    },
    priority: 0
  },
  {
    name: 'Scatter',
    id: 'scatter',
    icon: scatter,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.DESKTOP],
    urls: {
      website: 'get-scatter.com'
    },
    priority: 0
  },
  {
    name: 'Status',
    id: 'status',
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.MOBILE, WALLET_TAGS.DESKTOP],
    urls: {
      website: 'https://status.im/'
    },
    priority: 0
  },
  {
    name: 'Torus',
    id: 'torus',
    icon: torus,
    desc: '',
    connectivity: WALLET_CONNECTIVITY.VIEW_ONLY,
    tags: [WALLET_TAGS.WEB],
    urls: {
      website: 'toruswallet.io'
    },
    priority: 0
  }
];
