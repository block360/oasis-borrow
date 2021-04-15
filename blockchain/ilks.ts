import BigNumber from 'bignumber.js'
import { CatIlk, catIlk } from 'blockchain/calls/cat'
import { JugIlk, jugIlk } from 'blockchain/calls/jug'
import { CallObservable } from 'blockchain/calls/observe'
import { SpotIlk, spotIlk } from 'blockchain/calls/spot'
import { VatIlk, vatIlk } from 'blockchain/calls/vat'
import { Context } from 'blockchain/network'
import { ilkToToken$ } from 'components/AppContext'
import { PriceInfo } from 'features/shared/priceInfo'
import { one, zero } from 'helpers/zero'
import { of } from 'rxjs'
import { combineLatest, Observable } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators'

export function createIlks$(context$: Observable<Context>): Observable<string[]> {
  return context$.pipe(
    map((context) => Object.keys(context.joins).filter((join) => join !== 'DAI' && join !== 'SAI')),
  )
}

interface DerivedIlkData {
  token: string
  ilk: string
  ilkDebt: BigNumber
  ilkDebtAvailable: BigNumber
  collateralizationDangerThreshold: BigNumber
  collateralizationWarningThreshold: BigNumber
}
export type IlkData = VatIlk & SpotIlk & JugIlk & CatIlk & DerivedIlkData

export const COLLATERALIZATION_DANGER_OFFSET = new BigNumber('0.2') // 150% * 1.2 = 180%
export const COLLATERALIZATION_WARNING_OFFSET = new BigNumber('0.5') // 150% * 1.5 = 225%

export function createIlkData$(
  vatIlks$: CallObservable<typeof vatIlk>,
  spotIlks$: CallObservable<typeof spotIlk>,
  jugIlks$: CallObservable<typeof jugIlk>,
  catIlks$: CallObservable<typeof catIlk>,
  ilkToToken$: Observable<(ilk: string) => string>,
  ilk: string,
): Observable<IlkData> {
  return combineLatest(
    vatIlks$(ilk),
    spotIlks$(ilk),
    jugIlks$(ilk),
    catIlks$(ilk),
    ilkToToken$,
  ).pipe(
    switchMap(
      ([
        { normalizedIlkDebt, debtScalingFactor, maxDebtPerUnitCollateral, debtCeiling, debtFloor },
        { priceFeedAddress, liquidationRatio },
        { stabilityFee, feeLastLevied },
        { liquidatorAddress, liquidationPenalty, maxAuctionLotSize },
        ilkToToken,
      ]) => {
        // Maybe should be in ilkData as they are ilk dependent not vault dependent
        const collateralizationDangerThreshold = liquidationRatio.times(
          COLLATERALIZATION_DANGER_OFFSET.plus(one),
        )
        const collateralizationWarningThreshold = liquidationRatio.times(
          COLLATERALIZATION_WARNING_OFFSET.plus(one),
        )

        return of({
          collateralizationDangerThreshold,
          collateralizationWarningThreshold,
          normalizedIlkDebt,
          debtScalingFactor,
          maxDebtPerUnitCollateral,
          debtCeiling,
          debtFloor,
          priceFeedAddress,
          liquidationRatio,
          stabilityFee,
          feeLastLevied,
          liquidatorAddress,
          liquidationPenalty,
          maxAuctionLotSize,
          token: ilkToToken(ilk),
          ilk,
          ilkDebt: debtScalingFactor
            .times(normalizedIlkDebt)
            .decimalPlaces(18, BigNumber.ROUND_DOWN),
          ilkDebtAvailable: BigNumber.max(
            debtCeiling
              .minus(debtScalingFactor.times(normalizedIlkDebt))
              .decimalPlaces(18, BigNumber.ROUND_DOWN),
            zero,
          ),
        })
      },
    ),
  )
}

export type IlkDataList = IlkData[]

export function createIlkDataList$(
  ilkData$: (ilk: string) => Observable<IlkData>,
  ilks$: Observable<string[]>,
): Observable<IlkDataList> {
  return ilks$.pipe(
    switchMap((ilks) => combineLatest(ilks.map((ilk) => ilkData$(ilk)))),
    distinctUntilChanged(),
    shareReplay(1),
  )
}

export interface IlkDataChange {
  kind: 'ilkData'
  ilkData: IlkData
}

export function createIlkDataChange$(
  ilkData$: (ilk: string) => Observable<IlkData>,
  ilk: string,
): Observable<IlkDataChange> {
  return ilkData$(ilk).pipe(map((ilkData) => ({ kind: 'ilkData', ilkData })))
}

export const DEFAULT_DEBT_SCALING_FACTOR = one

export interface BuildIlkDataProps {
  _priceInfo$?: Observable<PriceInfo>
  _vatIlk$?: Observable<VatIlk>
  _spotIlk$?: Observable<SpotIlk>
  _jugIlk$?: Observable<JugIlk>
  _catIlk$?: Observable<CatIlk>
  debtFloor?: BigNumber
  debtCeiling?: BigNumber
  ilkDebt?: BigNumber
  liquidationRatio?: BigNumber
  stabilityFee?: BigNumber
  currentCollateralPrice?: BigNumber
  ilk?: string
}

const defaultDebtFloor = new BigNumber('2000')
const defaultIlkDebt = new BigNumber('8000000')
const defaultLiquidationRatio = new BigNumber('1.5')
const defaultStabilityFee = new BigNumber('0.045')
const defaultCollateralPrice = new BigNumber('1000')
const defaultIlk = 'WBTC-A'

export function buildIlkData$({
  _priceInfo$,
  _vatIlk$,
  _spotIlk$,
  _jugIlk$,
  _catIlk$,
  debtFloor = defaultDebtFloor,
  debtCeiling,
  ilkDebt = defaultIlkDebt,
  liquidationRatio = defaultLiquidationRatio,
  stabilityFee = defaultStabilityFee,
  currentCollateralPrice = defaultCollateralPrice,
  ilk = defaultIlk,
}: BuildIlkDataProps): Observable<IlkData> {
  const normalizedIlkDebt = ilkDebt.div(DEFAULT_DEBT_SCALING_FACTOR)

  const maxDebtPerUnitCollateral$ = _priceInfo$
    ? _priceInfo$.pipe(
        switchMap(({ currentCollateralPrice }) => of(currentCollateralPrice.div(liquidationRatio))),
      )
    : of(currentCollateralPrice.div(liquidationRatio))

  function vatIlks$() {
    return (
      _vatIlk$ ||
      maxDebtPerUnitCollateral$.pipe(
        switchMap((maxDebtPerUnitCollateral) =>
          of({
            normalizedIlkDebt,
            debtScalingFactor: DEFAULT_DEBT_SCALING_FACTOR,
            maxDebtPerUnitCollateral,
            debtCeiling:
              debtCeiling || normalizedIlkDebt.times(DEFAULT_DEBT_SCALING_FACTOR).times(2.5),
            debtFloor,
          }),
        ),
      )
    )
  }

  function spotIlks$() {
    return _spotIlk$ || of({ priceFeedAddress: '0xPriceFeedAddress', liquidationRatio })
  }

  function jugIlks$() {
    return _jugIlk$ || of({ feeLastLevied: new Date(), stabilityFee })
  }

  function catIlks$() {
    return (
      _catIlk$ ||
      of({
        liquidatorAddress: '0xLiquidatorAddress',
        liquidationPenalty: new BigNumber('0.13'),
        maxAuctionLotSize: new BigNumber('50000'),
      })
    )
  }

  return createIlkData$(vatIlks$, spotIlks$, jugIlks$, catIlks$, ilkToToken$, ilk).pipe(
    switchMap((ilkData) =>
      of({
        ...ilkData,
        ...(debtCeiling ? { ilkDebtAvailable: debtCeiling.minus(ilkData.ilkDebt) } : {}),
      }),
    ),
  )
}
