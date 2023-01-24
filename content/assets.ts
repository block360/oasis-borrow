import { Unbox } from 'helpers/types'
import keyBy from 'lodash/keyBy'

export const ASSETS_PAGES = [
  {
    slug: 'eth',
    header: 'Ethereum',
    symbol: 'ETH',
    icon: 'ether_circle_color',
    descriptionKey: 'assets.eth.description',
    link: 'assets.eth.link',
    multiplyIlks: [],
    borrowIlks: ['ETH-C', 'ETH-A', 'ETH-B'],
  },
  {
    slug: 'btc',
    header: 'Bitcoin',
    symbol: 'BTC',
    icon: 'btc_circle_color',
    descriptionKey: 'assets.btc.description',
    link: 'assets.btc.link',
    multiplyIlks: ['WBTC-B', 'WBTC-A', 'WBTC-C'],
    borrowIlks: ['WBTC-C', 'WBTC-A', 'WBTC-B'],
  },
  {
    slug: 'dai',
    header: 'Dai',
    symbol: 'DAI',
    icon: 'dai_circle_color',
    descriptionKey: 'assets.dai.description',
    link: 'assets.dai.link',
    // TODO prepare proper handling for DSR
    earnIlks: ['DSR'],
  },
]

export const assetsPageContentBySlug = keyBy(ASSETS_PAGES, 'slug')

export type AssetPageContent = Unbox<typeof ASSETS_PAGES>
