import { staticFilesRuntimeUrl } from 'helpers/staticPaths'
import { keyBy } from 'lodash'
import type { ElementOf } from 'ts-essentials'

export interface TokenConfig {
  symbol: string
  precision: number
  digits: number
  maxSell: string
  name: string
  icon: string
  iconCircle: string
  iconColor: string
  coinpaprikaTicker: string
  tags: CoinTag[]
  color: string
  bannerIcon: string
  bannerGif?: string
  token0?: string
  token1?: string
  coinbaseTicker?: string
  coinGeckoId?: string
  background?: string
  digitsInstant?: number
}

export const COIN_TAGS = ['stablecoin', 'lp-token'] as const
export type CoinTag = ElementOf<typeof COIN_TAGS>

export const tokens = [
  {
    symbol: 'STETH',
    precision: 18,
    digits: 5,
    name: 'Lido Staked ETH',
    icon: 'steth_circle_color',
    iconCircle: 'steth_circle_color',
    iconColor: 'ether_color',
    coinpaprikaTicker: 'steth-lido-staked-ether',
    color: '#0B91DD',
    background: 'linear-gradient(143.37deg, #00A3FF 15.97%, #0B91DD 81.1%), #FFFFFF',
    bannerIcon: staticFilesRuntimeUrl('/static/img/tokens/eth.png'),
    bannerGif: staticFilesRuntimeUrl('/static/img/tokens/eth.gif'),
    tags: [],
  },
  {
    symbol: 'MKR',
    precision: 18,
    digits: 5,
    name: 'Maker',
    icon: 'mkr_circle_color',
    iconCircle: 'mkr_circle_color',
    iconColor: 'ether_color',
    coinpaprikaTicker: 'mkr-maker',
    coinbaseTicker: 'mkr-usd',
    color: '#1AAB9B',
    background: 'linear-gradient(133.41deg, #1AAB9B 17.25%, #22CAB7 86.54%), #FFFFFF',
    bannerIcon: staticFilesRuntimeUrl('/static/img/tokens/eth.png'),
    bannerGif: staticFilesRuntimeUrl('/static/img/tokens/eth.gif'),
    tags: [],
  },
  {
    symbol: 'WETH',
    precision: 18,
    digits: 5,
    name: 'Wrapped Ether',
    icon: 'weth_circle_color',
    iconCircle: 'weth_circle_color',
    iconColor: 'ether_color',
    coinpaprikaTicker: 'weth-weth',
    coinpaprikaFallbackTicker: 'eth-ethereum',
    color: '#1AAB9B',
    background: 'linear-gradient(133.41deg, #1AAB9B 17.25%, #22CAB7 86.54%), #FFFFFF',
    bannerIcon: staticFilesRuntimeUrl('/static/img/tokens/eth.png'),
    bannerGif: staticFilesRuntimeUrl('/static/img/tokens/eth.gif'),
    tags: [],
  },
  {
    symbol: 'ETH',
    precision: 18,
    digits: 5,
    maxSell: '10000000',
    name: 'Ether',
    icon: 'ether',
    iconCircle: 'ether_circle_color',
    iconColor: 'ether_color',
    coinpaprikaTicker: 'eth-ethereum',
    coinbaseTicker: 'eth-usd',
    coinGeckoId: 'ethereum',
    color: '#667FE3',
    background:
      'linear-gradient(120deg, rgba(233,74,116,0.19931722689075626) 0%, rgba(179,202,101,0.196516106442577) 99%)',
    bannerIcon: staticFilesRuntimeUrl('/static/img/tokens/eth.png'),
    bannerGif: staticFilesRuntimeUrl('/static/img/tokens/eth.gif'),
    tags: [],
  },
  {
    symbol: 'WBTC',
    precision: 8,
    digits: 5,
    digitsInstant: 3,
    safeCollRatio: 1.5,
    maxSell: '1000000000000000',
    name: 'Wrapped Bitcoin',
    icon: 'wbtc',
    iconCircle: 'wbtc_circle_color',
    iconColor: 'wbtc_circle_color',
    coinpaprikaTicker: 'wbtc-wrapped-bitcoin',
    coinGeckoId: 'wrapped-bitcoin',
    color: '#f09242',
    background: 'linear-gradient(120deg, rgba(179,202,101,0.2) 0%, rgba(179,95,255,0.2) 99%)',
    bannerIcon: staticFilesRuntimeUrl('/static/img/tokens/wbtc.png'),
    bannerGif: staticFilesRuntimeUrl('/static/img/tokens/wbtc.gif'),
    tags: [],
    rootToken: 'BTC',
  },
  {
    symbol: 'USDC',
    precision: 6,
    digits: 6,
    digitsInstant: 2,
    maxSell: '1000000000000000',
    name: 'USD Coin',
    icon: 'usdc',
    iconCircle: 'usdc_circle_color',
    iconColor: 'usdc_circle_color',
    coinpaprikaTicker: 'usdc-usd-coin',
    color: '#2775ca',
    background: 'linear-gradient(152.45deg, #0666CE 8.53%, #61A9F8 91.7%)',
    bannerIcon: staticFilesRuntimeUrl('/static/img/tokens/usdc.png'),
    bannerGif: staticFilesRuntimeUrl('/static/img/tokens/usdc.gif'),
    tags: ['stablecoin'],
  },
  {
    symbol: 'AAVE',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'Aave',
    icon: 'aave_circle_color',
    iconCircle: 'aave_circle_color',
    iconColor: 'aave_circle_color',
    color: '#ff077d',
    background: 'linear-gradient(286.73deg, #B6509E 2.03%, #2EBAC6 100%)',
    bannerIcon: staticFilesRuntimeUrl('/static/img/banner_icons/aave.svg'),
    bannerGif: '',
    tags: [],
  },
  {
    symbol: 'DAI',
    precision: 18,
    digits: 4,
    maxSell: '10000000',
    name: 'Dai',
    icon: 'dai',
    iconCircle: 'gsu_circle_color',
    iconColor: 'gsu_color',
    coinpaprikaTicker: 'dai-dai',
    coinbaseTicker: 'dai-usd',
    color: '#fdc134',
    bannerIcon: '',
    background: '',
    bannerGif: '',
    tags: ['stablecoin'],
  },
  {
    symbol: 'stETHeth',
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'stETH/ETH',
    icon: 'aave_steth_eth',
    iconCircle: 'aave_steth_eth',
    iconColor: 'aave_steth_eth',
    color: '#E2F7F9',
    background: 'linear-gradient(160.47deg, #E2F7F9 0.35%, #D3F3F5 99.18%), #000000',
    bannerIcon: staticFilesRuntimeUrl('/static/img/tokens/steth-eth.png'),
    bannerGif: staticFilesRuntimeUrl('/static/img/tokens/steth-eth.gif'),
    tags: [],
  },
  {
    symbol: 'stETHusdc',
    // copied from above, used as a placeholder for now
    precision: 18,
    digits: 5,
    digitsInstant: 2,
    name: 'stETH/USDC',
    icon: 'aave_steth_usdc',
    iconCircle: 'aave_steth_usdc',
    iconColor: 'aave_steth_usdc',
    color: '#E2F7F9',
    background: 'linear-gradient(160.47deg, #E2F7F9 0.35%, #D3F3F5 99.18%), #000000',
    bannerIcon: staticFilesRuntimeUrl('/static/img/tokens/steth-eth.png'),
    bannerGif: staticFilesRuntimeUrl('/static/img/tokens/steth-eth.gif'),
    tags: [],
  }
]

// ticker comes from coinpaprika api https://api.coinpaprika.com/v1/tickers
export const tokensBySymbol = keyBy(tokens, 'symbol')

export type TokenSymbolType = ElementOf<typeof tokens>['symbol']
export type TokenMetadataType = typeof tokens[number]

export function getToken(tokenSymbol: TokenSymbolType): TokenMetadataType {
  if (!tokensBySymbol[tokenSymbol]) {
    throw new Error(`No meta information for token: ${tokenSymbol}`)
  }
  return tokensBySymbol[tokenSymbol]
}

export function getTokens(tokenSymbol: TokenSymbolType[]): typeof tokens {
  if (tokenSymbol instanceof Array) {
    return tokenSymbol.map(getToken)
  }
  throw new Error(`tokenSymbol should be an array, got ${tokenSymbol}`)
}

export const ALLOWED_MULTIPLY_TOKENS = tokens
  .filter(
    (token) => !(token.tags as CoinTag[]).some((tag) => tag === 'lp-token' || tag === 'stablecoin'),
  )
  .map((token) => token.symbol)

export const LP_TOKENS = tokens
  .filter((token) => (token.tags as CoinTag[]).includes('lp-token'))
  .map((lpToken) => lpToken.symbol)

export const BTC_TOKENS = tokens
  .filter((token) => token.rootToken === 'BTC' || token.symbol === 'BTC')
  .map((btcToken) => btcToken.symbol)

export const ETH_TOKENS = tokens
  .filter((token) => token.rootToken === 'ETH' || token.symbol === 'ETH')
  .map((ethToken) => ethToken.symbol)

export const ONLY_MULTIPLY_TOKENS = []

const ALLOWED_AUTOMATION_ILKS: Record<string, string[]> = {
  main: [
    'ETH-A',
    'ETH-B',
    'ETH-C',
    'WBTC-A',
    'WBTC-B',
    'WBTC-C'
  ],
  goerli: ['ETH-A', 'ETH-B', 'ETH-C', 'WBTC-A', 'WBTC-B', 'WBTC-C',],
}

export function isSupportedAutomationIlk(network: string, ilk: string) {
  const key = network in ALLOWED_AUTOMATION_ILKS ? network : 'main'
  return ALLOWED_AUTOMATION_ILKS[key].includes(ilk)
}
