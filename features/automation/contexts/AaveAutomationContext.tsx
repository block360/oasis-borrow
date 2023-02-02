import { AaveReserveConfigurationData } from 'blockchain/calls/aave/aaveProtocolDataProvider'
import { StrategyConfig } from 'features/aave/common/StrategyConfigTypes'
import { ManageAaveContext } from 'features/aave/manage/state'
import { getAutomationAavePositionData } from 'features/automation/common/context/getAutomationAavePositionData'
import { AutomationContextInput } from 'features/automation/contexts/AutomationContextInput'
import { VaultProtocol } from 'helpers/getVaultProtocol'
import { zero } from 'helpers/zero'
import React, { PropsWithChildren, useMemo } from 'react'

export interface AaveManageVaultState {
  address: string
  aaveReserveState: AaveReserveConfigurationData
  strategyConfig: StrategyConfig
  context: ManageAaveContext
}

interface AaveAutomationContextProps {
  aaveManageVault: AaveManageVaultState
}

export function AaveAutomationContext({
  children,
  aaveManageVault,
}: PropsWithChildren<AaveAutomationContextProps>) {
  const positionData = useMemo(() => getAutomationAavePositionData({ aaveManageVault }), [
    aaveManageVault,
  ])

  const commonData = useMemo(
    () => ({
      controller: aaveManageVault.address,
      nextCollateralPrice: aaveManageVault.context.collateralPrice || zero,
      token: aaveManageVault.context.tokens.collateral,
    }),
    [aaveManageVault],
  )

  return (
    <AutomationContextInput
      positionData={positionData}
      commonData={commonData}
      protocol={VaultProtocol.Aave}
    >
      {children}
    </AutomationContextInput>
  )
}
