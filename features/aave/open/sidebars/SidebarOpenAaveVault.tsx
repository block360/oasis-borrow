import { useActor } from '@xstate/react'
import { SidebarSection, SidebarSectionProps } from 'components/sidebar/SidebarSection'
import { useFeatureToggle } from 'helpers/useFeatureToggle'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { Box, Flex, Grid, Image } from 'theme-ui'
import { Sender } from 'xstate'

import { ContextConnected } from '../../../../blockchain/network'
import { MessageCard } from '../../../../components/MessageCard'
import { staticFilesRuntimeUrl } from '../../../../helpers/staticPaths'
import { zero } from '../../../../helpers/zero'
import { OpenVaultAnimation } from '../../../../theme/animations'
import { ProxyView } from '../../../proxyNew'
import { StrategyInformationContainer } from '../../common/components/informationContainer'
import { useAaveRedirect } from '../../helpers/useAaveRedirect'
import { useOpenAaveStateMachineContext } from '../containers/AaveOpenStateMachineContext'
import { OpenAaveEvent, OpenAaveStateMachine, OpenAaveStateMachineState } from '../state'
import { SidebarOpenAaveVaultEditingState } from './SidebarOpenAaveVaultEditingState'

function isLoading(state: OpenAaveStateMachineState) {
  return state.matches('background.loading')
}

export interface OpenAaveVaultProps {
  readonly aaveStateMachine: OpenAaveStateMachine
}

interface OpenAaveStateProps {
  readonly state: OpenAaveStateMachineState
  readonly send: Sender<OpenAaveEvent>
  redirectAddress?: string
  isLoading: () => boolean
}

function OpenAaveTransactionInProgressStateView({ state }: OpenAaveStateProps) {
  const { t } = useTranslation()

  const sidebarSectionProps: SidebarSectionProps = {
    title: t('open-earn.aave.vault-form.title'),
    content: (
      <Grid gap={3}>
        <OpenVaultAnimation />
        <StrategyInformationContainer state={state} />
      </Grid>
    ),
    primaryButton: {
      steps: [state.context.currentStep, state.context.totalSteps],
      isLoading: true,
      disabled: true,
      label: t('open-earn.aave.vault-form.confirm-btn'),
    },
  }

  return <SidebarSection {...sidebarSectionProps} />
}

function OpenAaveReviewingStateView({ state, send, isLoading }: OpenAaveStateProps) {
  const { t } = useTranslation()

  const sidebarSectionProps: SidebarSectionProps = {
    title: t('open-earn.aave.vault-form.title'),
    content: (
      <Grid gap={3}>
        <StrategyInformationContainer state={state} />
      </Grid>
    ),
    primaryButton: {
      steps: [state.context.currentStep, state.context.totalSteps],
      isLoading: isLoading(),
      disabled: !state.can('NEXT_STEP'),
      label: t('open-earn.aave.vault-form.confirm-btn'),
      action: () => send('NEXT_STEP'),
    },
  }

  return (
    <SidebarSection
      {...sidebarSectionProps}
      textButton={{
        label: t('open-earn.aave.vault-form.back-to-editing'),
        action: () => send('BACK_TO_EDITING'),
      }}
    />
  )
}

function OpenAaveFailureStateView({ state, send }: OpenAaveStateProps) {
  const { t } = useTranslation()

  const sidebarSectionProps: SidebarSectionProps = {
    title: t('open-earn.aave.vault-form.title'),
    content: (
      <Grid gap={3}>
        <StrategyInformationContainer state={state} />
      </Grid>
    ),
    primaryButton: {
      isLoading: false,
      disabled: false,
      label: t('open-earn.aave.vault-form.retry-btn'),
      action: () => send({ type: 'RETRY' }),
    },
  }

  return (
    <SidebarSection
      {...sidebarSectionProps}
      textButton={{
        label: t('open-earn.aave.vault-form.back-to-editing'),
        action: () => send('BACK_TO_EDITING'),
      }}
    />
  )
}

function OpenAaveEditingStateView({ state, send, isLoading }: OpenAaveStateProps) {
  const { t } = useTranslation()
  useAaveRedirect() // redirects to active position if user has one

  const hasProxy = state.context.connectedProxyAddress !== undefined
  const isProxyCreationDisabled = useFeatureToggle('ProxyCreationDisabled')

  const amountTooHigh =
    state.context.userInput.amount?.gt(state.context.tokenBalance || zero) ?? false

  const sidebarSectionProps: SidebarSectionProps = {
    title: t('open-earn.aave.vault-form.title'),
    content: (
      <Grid gap={3}>
        <SidebarOpenAaveVaultEditingState state={state} send={send} />
        {amountTooHigh && (
          <MessageCard
            messages={[t('vault-errors.deposit-amount-exceeds-collateral-balance')]}
            type="error"
          />
        )}
        <StrategyInformationContainer state={state} />
      </Grid>
    ),
    primaryButton: {
      steps: [state.context.currentStep, state.context.totalSteps],
      isLoading: isLoading(),
      disabled: !state.can('NEXT_STEP') || (!hasProxy && isProxyCreationDisabled),
      label: hasProxy ? t('open-earn.aave.vault-form.open-btn') : t('create-proxy-btn'),
      action: () => send('NEXT_STEP'),
    },
  }

  return <SidebarSection {...sidebarSectionProps} />
}

function OpenAaveSuccessStateView({ state, redirectAddress }: OpenAaveStateProps) {
  const { t } = useTranslation()

  const sidebarSectionProps: SidebarSectionProps = {
    title: t('open-earn.aave.vault-form.success-title'),
    content: (
      <Grid gap={3}>
        <Box>
          <Flex sx={{ justifyContent: 'center', mb: 4 }}>
            <Image src={staticFilesRuntimeUrl('/static/img/protection_complete_v2.svg')} />
          </Flex>
        </Box>
        <StrategyInformationContainer state={state} />
      </Grid>
    ),
    primaryButton: {
      label: t('open-earn.aave.vault-form.go-to-position'),
      url: `/aave/${redirectAddress}`,
    },
  }

  return <SidebarSection {...sidebarSectionProps} />
}

export function SidebarOpenAaveVault() {
  const { stateMachine } = useOpenAaveStateMachineContext()
  const [state, send] = useActor(stateMachine)
  const { t } = useTranslation()
  const { hasOpenedPosition } = state.context

  function loading(): boolean {
    return isLoading(state)
  }

  const AdjustRiskView = state.context.strategyConfig.viewComponents.adjustRiskView
  switch (true) {
    case state.matches('frontend.editing'):
      return <OpenAaveEditingStateView state={state} send={send} isLoading={loading} />
    case state.matches('frontend.proxyCreating'):
      return (
        <ProxyView
          proxyMachine={state.context.refProxyMachine!}
          steps={[state.context.currentStep, state.context.totalSteps]}
        />
      )
    case state.matches('frontend.settingMultiple'):
      return (
        <AdjustRiskView
          state={state}
          send={send}
          isLoading={loading}
          primaryButton={{
            steps: [state.context.currentStep, state.context.totalSteps],
            isLoading: isLoading(state),
            disabled: !state.can('NEXT_STEP'),
            label: t('open-earn.aave.vault-form.open-btn'),
            action: () => send('NEXT_STEP'),
          }}
          textButton={{
            label: t('open-earn.aave.vault-form.back-to-editing'),
            action: () => send('BACK_TO_EDITING'),
          }}
          viewLocked={hasOpenedPosition}
          showWarring={hasOpenedPosition}
        />
      )
    case state.matches('frontend.reviewing'):
      return <OpenAaveReviewingStateView state={state} send={send} isLoading={loading} />
    case state.matches('frontend.txInProgress'):
      return (
        <OpenAaveTransactionInProgressStateView state={state} send={send} isLoading={loading} />
      )
    case state.matches('frontend.txFailure'):
      return <OpenAaveFailureStateView state={state} send={send} isLoading={loading} />
    case state.matches('frontend.txSuccess'):
      return (
        <OpenAaveSuccessStateView
          state={state}
          send={send}
          redirectAddress={(state.context.web3Context as ContextConnected)?.account}
          isLoading={loading}
        />
      )
    default: {
      return <>{JSON.stringify(state.value)}</>
    }
  }
}
