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
  digitsInstant?: number,
  gsuRatesTicker?: string
}

export const COIN_TAGS = ['stablecoin', 'lp-token'] as const
export type CoinTag = ElementOf<typeof COIN_TAGS>

export const tokens = [
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
    gsuRatesTicker: 'gsup',
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
    gsuRatesTicker: 'eth',
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
    gsuRatesTicker: 'eth',
    color: '#667FE3',
    background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
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
    gsuRatesTicker: 'wbtc',
    color: '#f09242',
    background: 'linear-gradient(147.66deg, #FEF1E1 0%, #FDF2CA 88.25%)',
    bannerIcon: staticFilesRuntimeUrl('/static/img/tokens/wbtc.png'),
    bannerGif: staticFilesRuntimeUrl('/static/img/tokens/wbtc.gif'),
    tags: [],
    rootToken: 'BTC',
  },
  {
    symbol: 'DAI',
    precision: 18,
    digits: 4,
    maxSell: '10000000',
    name: 'Dai',
    icon: 'dai',
    iconCircle: 'dai_circle_color',
    iconColor: 'dai_color',
    coinpaprikaTicker: 'dai-dai',
    coinbaseTicker: 'dai-usd',
    gsuRatesTicker: 'gsuc',
    color: '#fdc134',
    bannerIcon: '',
    background: '',
    bannerGif: '',
    tags: ['stablecoin'],
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

// @GSUpro, optimization and protection disabled for all ilks
const ALLOWED_AUTOMATION_ILKS: Record<string, string[]> = {
  main: [],
  goerli: []
}

export function isSupportedAutomationIlk(network: string, ilk: string) {
  const key = network in ALLOWED_AUTOMATION_ILKS ? network : 'main'
  return ALLOWED_AUTOMATION_ILKS[key].includes(ilk)
}
