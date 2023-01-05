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
    slug: 'gsuc',
    header: 'GSUc',
    symbol: 'GSUc',
    icon: 'gsu_circle_color',
    descriptionKey: 'assets.dai.description',
    link: 'assets.dai.link',
    earnIlks: [],
  },
]

export const assetsPageContentBySlug = keyBy(ASSETS_PAGES, 'slug')

export type AssetPageContent = Unbox<typeof ASSETS_PAGES>
