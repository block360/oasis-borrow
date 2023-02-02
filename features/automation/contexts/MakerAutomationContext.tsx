import { getAutomationMakerPositionData } from 'features/automation/common/context/getAutomationMakerPositionData'
import { AutomationContextInput } from 'features/automation/contexts/AutomationContextInput'
import { GeneralManageVaultState } from 'features/generalManageVault/generalManageVault'
import { VaultProtocol } from 'helpers/getVaultProtocol'
import React, { PropsWithChildren, useMemo } from 'react'

interface MakerAutomationContextProps {
  generalManageVault: GeneralManageVaultState
}

export function MakerAutomationContext({
  children,
  generalManageVault,
}: PropsWithChildren<MakerAutomationContextProps>) {
  const positionData = useMemo(() => getAutomationMakerPositionData({ generalManageVault }), [
    generalManageVault,
  ])
  const {
    vault: { token, controller },
    priceInfo: { nextCollateralPrice },
  } = generalManageVault!.state

  const commonData = useMemo(
    () => ({
      controller,
      nextCollateralPrice,
      token,
    }),
    [controller, nextCollateralPrice.toString(), token],
  )

  return (
    <AutomationContextInput
      positionData={positionData}
      commonData={commonData}
      protocol={VaultProtocol.Maker}
    >
      {children}
    </AutomationContextInput>
  )
}
