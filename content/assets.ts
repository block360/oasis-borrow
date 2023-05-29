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
    // @GSUpro, returns empty array for multiply ilks
    multiplyIlks: [],
    borrowIlks: ['ETH-A', 'ETH-B'],
  },
  // {
  //   slug: 'btc',
  //   header: 'Bitcoin',
  //   symbol: 'BTC',
  //   icon: 'btc_circle_color',
  //   descriptionKey: 'assets.btc.description',
  //   link: 'assets.btc.link',
  //   // @GSUpro, returns empty array for multiply ilks
  //   multiplyIlks: [],
  //   borrowIlks: ['WBTC-C', 'WBTC-A', 'WBTC-B'],
  // },
  {
    slug: 'usdt',
    header: 'USD Tether',
    symbol: 'USDT',
    icon: 'usdt_circle_color',
    descriptionKey: 'assets.usdt.description',
    link: 'assets.usdt.link',
    // @GSUpro, returns empty array for multiply ilks
    multiplyIlks: [],
    borrowIlks: ['USDT-A'],
  },
  {
    slug: 'gsuc',
    header: 'GSUc',
    symbol: 'GSUc',
    icon: 'gsu_circle_color',
    descriptionKey: 'assets.dai.description',
    link: 'assets.dai.link',
    // TODO prepare proper handling for DSR
    earnIlks: ['DSR'],
  },
]

export const assetsPageContentBySlug = keyBy(ASSETS_PAGES, 'slug')

export type AssetPageContent = Unbox<typeof ASSETS_PAGES>
