import { IlkDataChange } from 'blockchain/ilks'
import { BalanceInfoChange } from 'features/shared/balanceInfo'
import { PriceInfoChange } from 'features/shared/priceInfo'

import { LeverageVaultChange, LeverageVaultState } from './leverageVault'

export type OpenVaultEnvironmentChange = PriceInfoChange | BalanceInfoChange | IlkDataChange

export function applyOpenVaultEnvironment(
  change: LeverageVaultChange,
  state: LeverageVaultState,
): LeverageVaultState {
  if (change.kind === 'priceInfo') {
    return {
      ...state,
      priceInfo: change.priceInfo,
    }
  }

  if (change.kind === 'balanceInfo') {
    return {
      ...state,
      balanceInfo: change.balanceInfo,
    }
  }

  if (change.kind === 'ilkData') {
    return {
      ...state,
      ilkData: change.ilkData,
    }
  }

  return state
}
