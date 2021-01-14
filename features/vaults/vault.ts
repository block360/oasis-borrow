import { amountFromWei } from '@oasisdex/utils'
import BigNumber from 'bignumber.js'
import { amountFromRay } from 'components/blockchain/utils'
import { zero } from 'helpers/zero'
import { combineLatest, Observable, of } from 'rxjs'
import { map, mergeMap, switchMap, take } from 'rxjs/operators'

import {
  cdpManagerIlks,
  cdpManagerOwner,
  cdpManagerUrns,
} from '../../components/blockchain/calls/cdpManager'
import { jugIlks } from '../../components/blockchain/calls/jug'
import { CallObservable } from '../../components/blockchain/calls/observe'
import { spotIlks, spotPar } from '../../components/blockchain/calls/spot'
import { vatGem, vatIlks, vatUrns } from '../../components/blockchain/calls/vat'

export interface Vault {
  /*
   * The "Vault.id" is recorded in a list in the cdpManager contract.
   * On creation (open) of a vault using the cdpManager contract, two
   * actions occur:
   *
   * 1) a new id is generated from the cdpManager.cdpi variable, a counter
   * variable which increments on each creation of a vault.
   * 2) an UrnHandler contract is created which is a used as a memory location
   * for the Urn struct in the Vat contract.
   *
   * After these two actions, three mappings are instantiated:
   * - urns :: id => urnHandler
   * - owns :: id => address
   * - ilks :: id => ilk
   *
   */
  id: string

  /*
   * As mentioned in Vault.id, the "Vault.owner" is found in the cdpManager.owns
   * mapping. It requires just an address but for the majority of cases will
   * be an address for a proxy contract created by an oasis borrow user.
   *
   * The owner here is the controller of the vault through the cdpManager
   */
  owner: string

  /*
   * The "Vault.controller" is the assumed address of the user. It can be found
   * by calling "owner()" in a deployed instance of a DSProxy contract.
   * Assuming again the majority of cases, the oasis borrow's user address
   * should match the address found by calling DSProxy.owner at address
   * Vault.owner.
   */
  controller: string // address of owner of proxy which controls the vault

  /*
   * A "Vault.token" is referred to as a "gem" in the core contracts. The gems
   * are the series of tokens which are valid collateral tokens.
   */
  token: string

  /*
   * The "Vault.ilk" is also called "ilk" in the core contracts. We can
   * name it more generally as the "collateral type" as each has it's own set
   * of parameters or characteristics, e.g
   * - ETH-A, gem is ETH, Stability Fee is 2.5%, ...
   * - ETH-B, gem is ETH, Stability Fee is 5% ...
   * - WBTC-A, gem is WBTC, Stability Fee is 4.5% ...
   */
  ilk: string

  /*
   * The "Vault.address" is as mentioned in Vault.id, an address for the
   * UrnHandler contract which is a storage location in memory for the Urn
   * struct contained in the Vat contract. The struct contains two variables,
   * the ink and the art.
   */
  address: string

  /*
   * The "Vault.collateral" is called the "ink" in the core contracts.
   * It is a record of the (wad) amount of collateral tokens (gems) "locked"
   * in the Vat.
   *
   * To be specific, there can be ambiguity in terms of what is meant by
   * "locked".
   * The deposit process in the protocol as done by the cdpManager which
   * this frontend uses is done in two actions via dssProxyActions.lock(Eth|Gem)
   *
   * 1) The user executes a function "join" on the relevant join adapter to
   * transfer the collateral token amount from the users wallet into the Vat.
   * The actual tokens will reside on the adapter but are recorded as a wad
   * amount in the Vat.gems[ilk][owner], owner being the users proxy.
   *
   * 2) The user executes Vat.frob which specifically "locks" the collateral
   * into the system by subtracting the amount from Vat.gems[ilk][usr] and
   * adding it to Vat.urns[ilk][urn].ink
   *
   * We classify the token amounts in both cases as "unencumbered collateral"
   * and "encumbered" collateral.
   *
   * - unencumbered :: where the collateral is only "joined" to the vat. It is
   * not backing any DAI at this point and cannot be seized in the liquidation
   * process, "unlocked"
   * - encumbered :: where the collateral has been "frobbed" and is recorded
   * as the Urn.ink amount. It is backing DAI at this point and will be seized
   * in the event of a liquidation process. "locked"
   *
   * In terms of this type, Vault.collateral, we are specifying the latter
   * "encumbered collateral"
   */
  collateral: BigNumber

  /*
   * "Vault.unlockedCollateral" references the amount of unencumbered collateral
   * as mentioned in Vault.collateral
   *
   * Necessary for functionality to reclaim leftover collateral on the adapter
   */
  unlockedCollateral: BigNumber

  /*
   * "Vault.collateralPrice" is the value of the collateral denominated in USD
   * locked in a vault
   */
  collateralPrice: BigNumber

  /*
   * "Vault.backingCollateral" is the minimum amount of collateral which
   * must be locked in the vault given the current amount of debt.
   * "minSafeCollateralAmount"
   */
  backingCollateral: BigNumber

  /*
   * "Vault.backingCollateralPrice" is the minimum amount of collateral in USD
   * which must be locked in the vault given the current amount of debt.
   */
  backingCollateralPrice: BigNumber

  /*
   * "Vault.freeCollateral" is the amount of collateral that can be
   * withdrawn from a vault without being liquidated
   */
  freeCollateral: BigNumber

  /*
   * "Vault.freeCollateralPrice" is the amount of collateral in USD that
   * can be withdrawn from a vault without being liquidated
   */
  freeCollateralPrice: BigNumber

  /*
   * The "Vault.debt" represents an amount of "internal DAI" generated through a
   * vault. It is a function of two values contained in the Vat:
   *
   * Vat.ilks[ilk].rate - "debtScalingFactor", this is a value which is used to
   * compute the stability fees for each vault of a certain collateral type.
   * It is updated via the Jug.drip function which is executed each time DAI
   * is withdrawn from the Vat through proxyActions.
   *
   * Vat.urns[ilk][urn].art - "normalized debt", see Vault.normalizedDebt
   *
   * The calculation then is:
   *
   * debt = normalizedDebt * debtScalingFactor
   *
   * Note: "Vault.debt" in this context is like the "Vault.collateral" and
   * only represents a record of the "internal DAI" within the system. All DAI
   * exists as "internal DAI", a recorded amount of debt in the system.
   * It becomes it's tokenised form when it is minted through executing exit
   * on the daiJoin adapter
   */
  debt: BigNumber

  /*
   * The "Vault.normalizedDebt" is called the "art" (lowercase) in the core
   * contracts and is recorded alongside the "ink" in the Urn struct.
   *
   * It is used in combination with the Vat.ilks[ilk].rate (debtScalingFactor) to
   * calculate the amount of debt generated by this vault.
   */
  normalizedDebt: BigNumber

  /*
   * "Vault.debtAvailable" is the maximum amount of debt denominated in DAI a
   * vault can generate without being liquidated
   */
  availableDebt: BigNumber

  /*
   * "Vault.globalDebtAvailable" is the maximum amount of debt available to
   * generate that does not break the debt ceiling for that ilk
   */
  availableGlobalDebt: BigNumber

  /*
   * Vault.liquidationRatio is found in Spot.ilks[ilk].mat, if the
   * collateralizationRatio is lower than this value then the vault is deemed
   * to be at risk of liquidation
   */
  liquidationRatio: BigNumber

  /*
   * "Vault.collateralizationRatio" is the ratio of the collateralPrice in USD
   * to the amount of debt in USD. A value less then liquidationRatio means that
   * the vault is at risk of being liquidated.
   */
  collateralizationRatio: BigNumber

  /*
   * "Vault.tokenOraclePrice" is the USD value of 1 unit of Vault.token as calculated
   * by the Maker Protocol;
   *
   * It can be computed by multiplying three values:
   *
   * Vat.ilks[ilk].spot - maxDebtPerUnitCollateral, sometimes called
   * "priceWithSafetyMargin", this is the maximum amount of DAI that can be
   * generated per unit token of that ilk.
   * Spot.par - daiPrice, The ratio of DAI to the reference asset, it being USD
   * Spot.ilks[ilk].mat - See Vault.liquidationRatio
   *
   * tokenPrice = daiPrice * maxDebtPerUnitCollateral * liquidationRatio
   */
  tokenOraclePrice: BigNumber

  /*
   * "Vault.liquidationPrice" is the price of the collateral of a vault
   * in USD if the Vault.collateralizationRatio is equal to the
   * Vault.liquidationRatio
   */
  liquidationPrice: BigNumber

  /*
   * "Vault.liquidationPenalty" is used if a vault is liquidated, the penalty
   * is applied after a portion of the collateral in a vault is sold to
   * pay back the outstanding debt. This percentage penalty is then applied
   * on the remaining collateral.
   */
  liquidationPenalty: BigNumber

  /*
   * "Vault.stabilityFee" is the annual percentage rate of interest that
   * accumulates over time for the amount of debt issued by a vault
   */
  stabilityFee: BigNumber

  /*
   * "Vault.debtFloor" is the minimum amount of debt that can be issued by
   * a vault. The reasons for this is that it becomes inefficient to liquidate
   * vaults if the amount collateral backing the debt does not cover the gas
   * required
   */
  debtFloor: BigNumber
}

export const mockVault: Vault = {
  id: '500',
  ilk: 'ETH-A',
  token: 'ETH',
  owner: '0x05623eb676A8abA2d381604B630ded1A81Dc05a9',
  address: '0x882cd8B63b4b6cB5ca2Bda899f6A8c968d66643e',
  controller: '0x8A0Bfe04D175D345b5FDcD3e9Ca5d00b608Ce6A3',
  collateral: new BigNumber('98'),
  unlockedCollateral: new BigNumber('0'),
  collateralPrice: new BigNumber('122014.90'),
  backingCollateral: new BigNumber('20.28'),
  backingCollateralPrice: new BigNumber('20.28'),
  freeCollateral: new BigNumber('77.72'),
  freeCollateralPrice: new BigNumber('96770.74'),
  normalizedDebt: new BigNumber('16403.419856003889170145'),
  collateralizationRatio: new BigNumber('7.25'),
  debt: new BigNumber('16829.44'),
  availableDebt: new BigNumber('64513.82'),
  availableGlobalDebt: new BigNumber('110593468.87'),
  debtFloor: new BigNumber('500'),
  stabilityFee: new BigNumber(
    '0.024999999999905956943812259791573533789860268487320672821177905084121745214484109204754426155886843',
  ),
  liquidationPrice: new BigNumber('257.59'),
  liquidationRatio: new BigNumber('1.50'),
  liquidationPenalty: new BigNumber('0.13'),
  tokenOraclePrice: new BigNumber('1245.05'),
}

// export const minSafeCollateralAmount = {
//   generate: id => ({
//     dependencies: [
//       [DEBT_VALUE, id],
//       [LIQUIDATION_RATIO, [VAULT_TYPE, id]],
//       [COLLATERAL_TYPE_PRICE, [VAULT_TYPE, id]]
//     ],
//     computed: (debtValue, liquidationRatio, price) =>
//       calcMinSafeCollateralAmount(debtValue, liquidationRatio, price)
//   })
// };
//
// function minSafeCollateralAmount(
//   debtValue: BigNumber, liquidationRatio: BigNumber, price: BigNumber
// ) {
//   return debtValue.times(liquidationRatio).div(price);
// }

export function createTokenOraclePrice$(
  vatIlks$: CallObservable<typeof vatIlks>,
  ratioDAIUSD$: CallObservable<typeof spotPar>,
  liquidationRatio$: CallObservable<typeof spotIlks>,
  ilk: string,
) {
  return combineLatest(vatIlks$(ilk), liquidationRatio$(ilk), ratioDAIUSD$()).pipe(
    map(([{ maxDebtPerUnitCollateral }, { liquidationRatio }, ratioDAIUSD]) =>
      maxDebtPerUnitCollateral.times(ratioDAIUSD).times(liquidationRatio),
    ),
  )
}

/*
 * TODO Determine if "controller" is best name for
 * communicating relationship of
 * id -> cdpManager.owns -> DsProxy(owner) -> controller/externalAddress/user
 *
 * Assumption breaks the vault in question uses a different cdpManager or if
 * the vault has been given away
 */
export function createController$(
  proxyOwner$: (proxyAddress: string) => Observable<string>,
  cdpManagerOwner$: CallObservable<typeof cdpManagerOwner>,
  id: BigNumber,
) {
  return cdpManagerOwner$(id).pipe(mergeMap((owner) => proxyOwner$(owner)))
}
// type CL = <T, T2, T3, T4, T5, T6, T7>(
//   v1: ObservableInput<T>,
//   v2: ObservableInput<T2>,
//   v3: ObservableInput<T3>,
//   v4: ObservableInput<T4>,
//   v5: ObservableInput<T5>,
//   v6: ObservableInput<T6>,
//   v7: ObservableInput<T7>
// ) => Observable<[T, T2, T3, T4, T5, T6, T7]>;
//
// const fixedCombineLatest: CL = combineLatest as any;

interface CreateVaultArgs {
  cdpManagerUrns$: CallObservable<typeof cdpManagerUrns>
  cdpManagerIlks$: CallObservable<typeof cdpManagerIlks>
  vatUrns$: CallObservable<typeof vatUrns>
  vatIlks$: CallObservable<typeof vatIlks>
  vatGem$: CallObservable<typeof vatGem>
  cdpManagerOwner$: CallObservable<typeof cdpManagerOwner>
  spotIlks$: CallObservable<typeof spotIlks>
  jugIlks$: CallObservable<typeof jugIlks>
  tokenOraclePrice$: (ilk: string) => Observable<BigNumber>
  controller$: (id: BigNumber) => Observable<string>
}

export function createVault$(
  {
    cdpManagerUrns$,
    cdpManagerIlks$,
    vatUrns$,
    vatIlks$,
    vatGem$,
    cdpManagerOwner$,
    spotIlks$,
    jugIlks$,
    tokenOraclePrice$,
    controller$,
  }: CreateVaultArgs,
  id: BigNumber,
): Observable<Vault> {
  return combineLatest(
    cdpManagerUrns$(id),
    cdpManagerIlks$(id),
    cdpManagerOwner$(id),
    controller$(id),
  ).pipe(
    switchMap(([urnAddress, ilk, owner, controller]) => {
      const token = 'ABC' // TODO
      return combineLatest(
        vatIlks$(ilk),
        tokenOraclePrice$(ilk),
        spotIlks$(ilk),
        jugIlks$(ilk),
        vatUrns$({ ilk, urnAddress }),
        vatGem$({ ilk, urnAddress }),
      ).pipe(
        switchMap(
          ([
            { debtFloor, debtScalingFactor },
            tokenOraclePrice,
            { liquidationRatio },
            { stabilityFee },
            { collateral, normalizedDebt },
            unlockedCollateral,
          ]) => {
            const collateralPrice = collateral.times(tokenOraclePrice)
            const debt = debtScalingFactor.times(normalizedDebt)

            const backingCollateral = debt.times(liquidationRatio)
            const freeCollateral = backingCollateral.gt(collateral)
              ? zero
              : collateral.minus(backingCollateral)

            const backingCollateralPrice = backingCollateral.div(tokenOraclePrice)
            const freeCollateralPrice = freeCollateral.div(tokenOraclePrice)
            const collateralizationRatio = debt.eq(zero) ? zero : collateralPrice.div(debt)
            return of({
              ...mockVault,
              id: id.toString(),
              address: urnAddress,
              ilk,
              owner,
              controller,
              collateral,
              collateralPrice,
              unlockedCollateral,
              normalizedDebt,
              debt,
              debtFloor,
              token,
              backingCollateral,
              backingCollateralPrice,
              freeCollateral,
              freeCollateralPrice,
              collateralizationRatio,
              // debtAvailable,
              // globalDebtAvailable,
              stabilityFee,
              // liquidationPrice,
              liquidationRatio,
              // liquidationPenalty,
              tokenOraclePrice,
            })
          },
        ),
      )
    }),
    take(1),
  )
}
