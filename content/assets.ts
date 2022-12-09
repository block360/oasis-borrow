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
    multiplyIlks: ['ETH-B', 'ETH-A', 'ETH-C'],
    borrowIlks: ['ETH-C', 'ETH-A', 'ETH-B', 'CRVV1ETHSTETH-A'],
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
    // multiplyIlks: ['WBTC-B', 'WBTC-A', 'RENBTC-A', 'WBTC-C'],
    // borrowIlks: ['WBTC-C', 'RENBTC-A', 'WBTC-A', 'WBTC-B'],
  },
  //@GSUpro removes the token assets
  // {
  //   slug: 'lp-token',
  //   header: 'LP tokens',
  //   symbol: 'UNIV2',
  //   icon: 'uni_circle_color',
  //   descriptionKey: 'assets.lp-token.description',
  //   link: 'assets.lp-token.link',
  //   earnIlks: ['GUNIV3DAIUSDC1-A', 'GUNIV3DAIUSDC2-A'],
  //   borrowIlks: ['UNIV2DAIUSDC-A', 'UNIV2USDCETH-A'],
  // },
  // {
  //   slug: 'yfi',
  //   header: 'Yearn Finance',
  //   symbol: 'YFI',
  //   icon: 'yfi_circle_color',
  //   descriptionKey: 'assets.yfi.description',
  //   link: 'assets.yfi.link',
  //   multiplyIlks: ['YFI-A'],
  //   borrowIlks: ['YFI-A'],
  // },
  //@GSUpro removes the token assets end
  {
    slug: 'gsuc',
    header: 'GSUc',
    symbol: 'GSUc',
    icon: 'gsu_circle_color',
    descriptionKey: 'assets.dai.description',
    link: 'assets.dai.link',
    earnIlks: ['GUNIV3DAIUSDC1-A', 'GUNIV3DAIUSDC2-A'],
  },
  //@GSUpro removes the token assets
  // {
  //   slug: 'link',
  //   header: 'Chainlink',
  //   symbol: 'LINK',
  //   icon: 'chainlink_circle_color',
  //   descriptionKey: 'assets.link.description',
  //   link: 'assets.link.link',
  //   multiplyIlks: ['LINK-A'],
  //   borrowIlks: ['LINK-A'],
  // },
  // {
  //   slug: 'matic',
  //   header: 'Matic',
  //   symbol: 'MATIC',
  //   icon: 'matic_circle_color',
  //   descriptionKey: 'assets.matic.description',
  //   link: 'assets.matic.link',
  //   multiplyIlks: ['MATIC-A'],
  //   borrowIlks: ['MATIC-A'],
  // },
  // {
  //   slug: 'mana',
  //   header: 'Decentraland',
  //   symbol: 'MANA',
  //   icon: 'mana_circle_color',
  //   descriptionKey: 'assets.mana.description',
  //   link: 'assets.mana.link',
  //   multiplyIlks: ['MANA-A'],
  //   borrowIlks: ['MANA-A'],
  // },
  //@GSUpro removes the token assets end
]

export const assetsPageContentBySlug = keyBy(ASSETS_PAGES, 'slug')

export type AssetPageContent = Unbox<typeof ASSETS_PAGES>
