import { BigNumber } from 'bignumber.js'
import { getToken } from 'components/blockchain/config'
import { Context, every10Seconds$ } from 'components/blockchain/network'
import { bindNodeCallback, combineLatest, forkJoin, Observable, of } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { catchError, distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators'

export interface Ticker {
  [label: string]: BigNumber
}

export type GasPrice$ = Observable<BigNumber>

export function createGasPrice$(
  onEveryBlock$: Observable<number>,
  context$: Observable<Context>,
): GasPrice$ {
  return combineLatest(onEveryBlock$, context$).pipe(
    switchMap(([, { web3 }]) => bindNodeCallback(web3.eth.getGasPrice)()),
    map((x) => new BigNumber(x)),
    distinctUntilChanged((x: BigNumber, y: BigNumber) => x.eq(y)),
    shareReplay(1),
  )
}

const tradingTokens = ['DAI', 'ETH']

export const tokenPricesInUSD$: Observable<Ticker> = every10Seconds$.pipe(
  switchMap(() =>
    forkJoin(
      tradingTokens.map((token) =>
        ajax({
          url: `https://api.pro.coinbase.com/products/${getToken(token).coinbaseTicker}/book`,
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }).pipe(
          map(({ response }) => {
            const bid = new BigNumber(response.bids[0][0])
            const ask = new BigNumber(response.asks[0][0])
            return {
              [token]: bid.plus(ask).div(2),
            }
          }),
          catchError((error) => {
            console.debug(`Error fetching price data: ${error}`)
            return of({})
          }),
        ),
      ),
    ),
  ),
  map((prices) => prices.reduce((a, e) => ({ ...a, ...e }))),
  shareReplay(1),
)
