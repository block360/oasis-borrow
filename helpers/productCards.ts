import { BigNumber } from 'bignumber.js'
import { IlkWithBalance } from 'features/ilks/ilksWithBalances'
import _, { keyBy, sortBy } from 'lodash'
import { combineLatest, Observable, of } from 'rxjs'
import { map, startWith, switchMap } from 'rxjs/operators'

import { supportedIlks } from '../blockchain/config'
import { IlkData } from '../blockchain/ilks'
import { OraclePriceData, OraclePriceDataArgs } from '../blockchain/prices'
import {
  BTC_TOKENS,
  ETH_TOKENS,
  getToken,
  LP_TOKENS,
  ONLY_MULTIPLY_TOKENS,
} from '../blockchain/tokensMetadata'
import { aaveStrategiesList } from '../features/aave/strategyConfig'
import { zero } from './zero'

export interface ProductCardData {
  token: string
  ilk: Ilk
  liquidationRatio: BigNumber
  liquidityAvailable: BigNumber
  stabilityFee: BigNumber
  balance?: BigNumber
  balanceInUsd?: BigNumber
  debtFloor: BigNumber
  currentCollateralPrice: BigNumber
  bannerIcon: string
  bannerGif: string
  background: string
  name: string
  isFull: boolean
}

export type ProductLandingPagesFiltersKeys = 'Featured' | 'ETH' | 'BTC'

type ProductLandingPagesFiltersIcons = 'star_circle' | 'eth_circle' | 'btc_circle'

export type ProductLandingPagesFilter = {
  name: ProductLandingPagesFiltersKeys
  icon: ProductLandingPagesFiltersIcons
  urlFragment: string
  tokens: Readonly<Array<string>>
}
export type ProductTypes = 'borrow' | 'multiply' | 'earn'

export type Ilk = typeof supportedIlks[number]
export type AaveStrategy = typeof aaveStrategiesList[number]

export const supportedBorrowIlks = ['ETH-A', 'ETH-B', 'ETH-C', 'WBTC-A', 'WBTC-B', 'WBTC-C']

export const supportedMultiplyIlks = []

export const supportedEarnIlks = []

type ProductPageType = {
  cardsFilters: Array<ProductLandingPagesFilter>
  featuredIlkCards: Array<Ilk>
  inactiveIlks: Array<Ilk>
  ordering: { [Key in ProductLandingPagesFiltersKeys]?: Array<Ilk> }
  tags: Partial<Record<Ilk, string>>
}

const genericFilters = {
  featured: { name: 'Featured', icon: 'star_circle', urlFragment: 'featured', tokens: [] },
  eth: {
    name: 'ETH',
    icon: 'eth_circle',
    urlFragment: 'eth',
    tokens: ['ETH', 'WETH'],
  },
  btc: { name: 'BTC', icon: 'btc_circle', urlFragment: 'btc', tokens: ['WBTC'] },
} as const

const ilkToEntryTokenMap = {
  'ETH-A': 'ETH',
  'ETH-B': 'ETH',
  'ETH-C': 'ETH',
  'WBTC-A': 'WBTC',
  'WBTC-B': 'WBTC',
  'WBTC-C': 'WBTC',
}

export type IlkTokenMap = { ilk: Ilk; token: string }

export const ilkToEntryToken: Array<IlkTokenMap> = Object.entries(ilkToEntryTokenMap).map(
  ([ilk, token]) => ({
    ilk,
    token,
  }),
)

const urlFragmentKeyedFilters = keyBy(genericFilters, 'urlFragment')

export function mapUrlFragmentToFilter(urlFragment: string) {
  return urlFragmentKeyedFilters[urlFragment]
}

const tokenKeyedFilters: {
  [k: string]: ProductLandingPagesFilter
} = _(genericFilters)
  .flatMap((filter) => filter.tokens.map((token) => ({ [token]: filter })))
  .reduce((acc, current) => ({ ...acc, ...current }), {})

export function mapTokenToFilter(token: string) {
  return tokenKeyedFilters[token]
}

export const productCardsConfig: {
  borrow: ProductPageType
  multiply: ProductPageType
  earn: ProductPageType
  landing: {
    featuredIlkCards: Record<ProductTypes, Array<Ilk>>
    featuredAaveCards: Record<ProductTypes, Array<AaveStrategy>>
  }
  descriptionCustomKeys: Record<Ilk, string>
  descriptionLinks: Record<Ilk, { link: string; name: string }>
} = {
  borrow: {
    cardsFilters: [genericFilters.featured, genericFilters.eth, genericFilters.btc],
    featuredIlkCards: ['ETH-C', 'WBTC-C'],
    inactiveIlks: [],
    ordering: {
      ETH: ['ETH-C', 'ETH-A', 'ETH-B'],
      BTC: ['WBTC-C', 'WBTC-A', 'WBTC-B'],
    },
    tags: {
      'ETH-C': 'lowest-fees-for-borrowing',
      'WBTC-C': 'lowest-fees-for-borrowing',
    },
  },
  multiply: {
    cardsFilters: [genericFilters.featured, genericFilters.eth, genericFilters.btc],
    featuredIlkCards: [],
    inactiveIlks: [],
    ordering: {
      ETH: [],
      BTC: [],
    },
    tags: {},
  },
  earn: {
    cardsFilters: [],
    featuredIlkCards: [],
    inactiveIlks: [],
    ordering: {},
    tags: {},
  },
  landing: {
    featuredIlkCards: {
      borrow: ['ETH-C', 'WBTC-C'],
      multiply: [],
      // TODO prepare proper handling for DSR
      earn: ['DSR'],
    },
    featuredAaveCards: {
      borrow: [],
      multiply: [],
      earn: [],
    },
  },
  descriptionCustomKeys: {
    'ETH-A': 'medium-exposure-medium-cost',
    'ETH-B': 'biggest-multiply',
    'ETH-C': 'lowest-stabilityFee-and-cheapest',
    'WBTC-A': 'medium-exposure-medium-cost',
    'WBTC-B': 'biggest-multiply',
    'WBTC-C': 'lowest-stabilityFee-and-cheapest',
  } as Record<string, string>,
  descriptionLinks: {
    'ETH-A': {
      link: '/inprogress',
      name: 'GSUp (ETH-A)',
    },
    'ETH-B': {
      link: '/inprogress',
      name: 'GSUp (ETH-B)',
    },
    'ETH-C': {
      link: '/inprogress',
      name: 'GSUp (ETH-C)',
    },
    'WBTC-A': {
      link: '/inprogress',
      name: 'GSUp (WBTC-A)',
    },
    'WBTC-B': {
      link: '/inprogress',
      name: 'GSUp (WBTC-B)',
    },
    'WBTC-C': {
      link: '/inprogress',
      name: 'GSUp (WBTC-C)',
    },
    stETHeth: {
      link: '/inprogress',
      name: 'AAVE stETH / ETH',
    },
  },
}

function btcProductCards<T extends IlkTokenMap>(productCardsData: Array<T>): Array<T> {
  return productCardsData.filter((ilk) => {
    return BTC_TOKENS.includes(ilk.token)
  })
}

function ethProductCards<T extends IlkTokenMap>(productCardsData: T[]): T[] {
  return productCardsData.filter((ilk) => ETH_TOKENS.includes(ilk.token))
}

const notSupportedAnymoreLpTokens = [
  'UNIV2ETHUSDT',
  'UNIV2LINKETH',
  'UNIV2AAVEETH',
  'UNIV2DAIUSDT',
  'UNIV2DAIETH',
  'UNIV2WBTCETH',
  'UNIV2UNIETH',
  'UNIV2WBTCDAI',
]

export function uniLpProductCards<T extends IlkTokenMap>(ilkToTokenMappings: Array<T>): Array<T> {
  return ilkToTokenMappings.filter(
    ({ token }) =>
      LP_TOKENS.includes(token) &&
      !ONLY_MULTIPLY_TOKENS.includes(token) &&
      !notSupportedAnymoreLpTokens.includes(token),
  )
}

export function landingPageCardsData({
  productCardsData,
  product = 'multiply',
}: {
  productCardsData: ProductCardData[]
  product?: ProductTypes
}) {
  return []
  // @GSUpro, returns empty array for multiply ilks
  // return productCardsData.filter((ilk) =>
  //   productCardsConfig.landing.featuredIlkCards[product].includes(ilk.ilk),
  // )
}

export function pageCardsDataByProduct({
  productCardsData,
  product = 'multiply',
}: {
  productCardsData: ProductCardData[]
  product?: ProductTypes
}) {
  return []
  // @GSUpro, returns empty array for multiply ilks
  // return productCardsData.filter((ilk) =>
  //   productCardsConfig[product].cardsFilters.map((cardFilter) =>
  //     ilk.token.includes(cardFilter.name),
  //   ),
  // )
}

function sortCards<T extends IlkTokenMap>(
  ilkToTokenMappings: Array<T>,
  sortingConfig: ProductPageType['ordering'],
  cardsFilter?: ProductLandingPagesFiltersKeys,
): Array<T> {
  if (cardsFilter) {
    ilkToTokenMappings = sortBy(ilkToTokenMappings, ({ ilk }) => {
      const orderForFilter = sortingConfig[cardsFilter]

      if (orderForFilter) {
        const order = orderForFilter.indexOf(ilk)
        if (order >= 0) {
          return order
        } else {
          return Infinity
        }
      }

      return 0
    })
  }
  return ilkToTokenMappings
}

export function earnPageCardsData<T extends IlkTokenMap>({
  ilkToTokenMapping,
}: {
  ilkToTokenMapping: Array<T>
}): Array<T> {
  return ilkToTokenMapping.filter((data) =>
    // ['GUNIV3DAIUSDC1-A', 'GUNIV3DAIUSDC2-A'].includes(data.ilk),
    productCardsConfig.earn.featuredIlkCards.includes(data.ilk),
  )
}

export function multiplyPageCardsData<T extends IlkTokenMap>({
  ilkToTokenMapping,
  cardsFilter,
}: {
  ilkToTokenMapping: Array<T>
  cardsFilter?: ProductLandingPagesFiltersKeys
}): Array<T> {
  ilkToTokenMapping = sortCards(
    ilkToTokenMapping,
    productCardsConfig.multiply.ordering,
    cardsFilter,
  )

  if (cardsFilter === 'Featured') {
    return ilkToTokenMapping.filter((ilk) =>
      productCardsConfig.multiply.featuredIlkCards.includes(ilk.ilk),
    )
  }

  if (cardsFilter === 'BTC') {
    return btcProductCards(ilkToTokenMapping)
  }

  if (cardsFilter === 'ETH') {
    return ethProductCards(ilkToTokenMapping)
  }

  return ilkToTokenMapping.filter((ilk) => ilk.token === cardsFilter)
}

export function borrowPageCardsData<T extends IlkTokenMap>({
  ilkToTokenMapping,
  cardsFilter,
}: {
  ilkToTokenMapping: Array<T>
  cardsFilter?: ProductLandingPagesFiltersKeys
}): Array<T> {
  ilkToTokenMapping = sortCards(ilkToTokenMapping, productCardsConfig.borrow.ordering, cardsFilter)

  if (cardsFilter === 'Featured') {
    return ilkToTokenMapping.filter(({ ilk }) =>
      productCardsConfig.borrow.featuredIlkCards.includes(ilk),
    )
  }

  if (cardsFilter === 'BTC') {
    return btcProductCards(ilkToTokenMapping)
  }

  if (cardsFilter === 'ETH') {
    return ethProductCards(ilkToTokenMapping)
  }

  return ilkToTokenMapping.filter(({ token }) => token === cardsFilter)
}

export function cardFiltersFromBalances(
  productCardsData: ProductCardData[],
): Array<ProductLandingPagesFiltersKeys> {
  return productCardsData
    .filter((cardData) => cardData.balance && cardData.balance.isGreaterThan(0))
    .map((d) => (d.token as unknown) as ProductLandingPagesFiltersKeys)
}

export function createProductCardsWithBalance$(
  ilksWithBalance$: Observable<IlkWithBalance[]>,
  oraclePrice$: (args: OraclePriceDataArgs) => Observable<OraclePriceData>,
): Observable<ProductCardData[]> {
  return ilksWithBalance$.pipe(
    switchMap((ilkDataList) =>
      combineLatest(
        ...ilkDataList
          .filter((ilk) => ilk.debtCeiling.gt(zero))
          .map((ilk) => {
            const tokenMeta = getToken(ilk.token)
            return oraclePrice$({ token: ilk.token, requestedData: ['currentPrice'] }).pipe(
              switchMap((priceInfo) => {
                return of({
                  token: ilk.token,
                  balance: ilk.balance,
                  balanceInUsd: ilk.balancePriceInUsd,
                  ilk: ilk.ilk as Ilk,
                  liquidationRatio: ilk.liquidationRatio,
                  liquidityAvailable: ilk.ilkDebtAvailable,
                  stabilityFee: ilk.stabilityFee,
                  debtFloor: ilk.debtFloor,
                  currentCollateralPrice: priceInfo.currentPrice,
                  bannerIcon: tokenMeta.bannerIcon,
                  bannerGif: tokenMeta.bannerGif,
                  background: tokenMeta.background,
                  name: tokenMeta.name,
                  isFull: ilk.ilkDebtAvailable.lt(ilk.debtFloor),
                })
              }),
            )
          }),
      ),
    ),
    startWith<ProductCardData[]>([]),
  )
}

export function createProductCardsData$(
  supportedIlks$: Observable<string[]>,
  ilkData$: (ilk: string) => Observable<IlkData>,
  oraclePrice$: (args: OraclePriceDataArgs) => Observable<OraclePriceData>,
  visibleIlks: Array<Ilk>,
): Observable<ProductCardData[]> {
  if (visibleIlks.length === 0) {
    return of([])
  }

  const hydratedIlkData$ = supportedIlks$.pipe(
    switchMap((ilksSupportedOnNetwork) => {
      const displayedIlks = visibleIlks.filter((ilk) => ilksSupportedOnNetwork.includes(ilk))
      if (displayedIlks.length === 0) {
        return of([])
      }
      return combineLatest(displayedIlks.map((ilk) => ilkData$(ilk)))
    }),
  )

  const hydratedOraclePriceData$ = hydratedIlkData$.pipe(
    switchMap((ilkDatas) => {
      if (ilkDatas.length === 0) {
        return of([])
      }
      return combineLatest(
        ilkDatas.map((ilkData) =>
          oraclePrice$({ token: ilkData.token, requestedData: ['currentPrice'] }),
        ),
      )
    }),
  )

  return combineLatest(hydratedIlkData$, hydratedOraclePriceData$).pipe(
    map(([ilkDatas, oraclePriceDatas]) => {
      return ilkDatas.map((ilkData, index) => {
        const oraclePriceData = oraclePriceDatas[index]
        const tokenMeta = getToken(ilkData.token)
        return {
          token: ilkData.token,
          ilk: ilkData.ilk as Ilk,
          liquidationRatio: ilkData.liquidationRatio,
          liquidityAvailable: ilkData.ilkDebtAvailable,
          stabilityFee: ilkData.stabilityFee,
          debtFloor: ilkData.debtFloor,
          currentCollateralPrice: oraclePriceData.currentPrice,
          bannerIcon: tokenMeta.bannerIcon,
          bannerGif: tokenMeta.bannerGif,
          background: tokenMeta.background,
          name: tokenMeta.name,
          isFull: ilkData.ilkDebtAvailable.lt(ilkData.debtFloor),
        }
      })
    }),
  )
}
