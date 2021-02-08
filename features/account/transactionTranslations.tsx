// @ts-ignore
import { Icon } from '@makerdao/dai-ui-icons'
import { TxState } from '@oasisdex/transactions'
import { TxMetaKind } from 'blockchain/calls/txMeta'
import { TxData } from 'components/AppContext'
import { LatamexOrder, MoonpayOrder, WyreOrder } from 'components/dashboard/onrampOrders'
import { formatCryptoBalance } from 'helpers/formatters/format'
import { roundHalfUp } from 'helpers/rounding'
import { zero } from 'helpers/zero'
import React from 'react'
import { Flex, Text } from 'theme-ui'

import { TxMgrTransaction, TxTranslator } from './transactionManager'

export function getTransactionTranslations(tx: TxMgrTransaction) {
  const { kind, raw } = tx
  if (kind === 'blockchain') {
    const { meta } = raw as TxState<TxData>

    switch (meta.kind) {
      case TxMetaKind.setupDSProxy:
        return {
          pending: <TxTranslator i18nKey="dsr-proxy-create-description-pending" />,
          recent: <TxTranslator i18nKey="dsr-proxy-create-description-recent" />,
          recentFailed: <TxTranslator i18nKey="dsr-proxy-create-description-recent-failed" />,
          notification: <TxTranslator i18nKey="dsr-proxy-create-notification" />,
          notificationPast: <TxTranslator i18nKey="dsr-proxy-create-notification-past" />,
        }
      case TxMetaKind.setOwner:
        return {
          pending: <TxTranslator i18nKey="dsr-proxy-set-owner-description-pending" />,
          recent: <TxTranslator i18nKey="dsr-proxy-set-owner-description-recent" />,
          recentFailed: <TxTranslator i18nKey="dsr-proxy-set-owner-description-recent-failed" />,
          notification: <TxTranslator i18nKey="dsr-proxy-set-owner-notification" />,
          notificationPast: <TxTranslator i18nKey="dsr-proxy-set-owner-notification-past" />,
        }
      case TxMetaKind.dsrJoin:
        return {
          pending: (
            <TxTranslator
              i18nKey="dsr-proxy-deposit-description-pending"
              params={{ amount: formatCryptoBalance(meta.amount) }}
            />
          ),
          recent: (
            <TxTranslator
              i18nKey="dsr-proxy-deposit-description-recent"
              params={{ amount: formatCryptoBalance(meta.amount) }}
            />
          ),
          recentFailed: (
            <TxTranslator
              i18nKey="dsr-proxy-deposit-description-recent-failed"
              params={{ amount: formatCryptoBalance(meta.amount) }}
            />
          ),
          notification: (
            <TxTranslator
              i18nKey="dsr-proxy-deposit-notification"
              params={{ amount: formatCryptoBalance(meta.amount) }}
            />
          ),
          notificationPast: (
            <TxTranslator
              i18nKey="dsr-proxy-deposit-notification-past"
              params={{ amount: formatCryptoBalance(meta.amount) }}
            />
          ),
        }
      case TxMetaKind.dsrExit:
        return {
          pending: (
            <TxTranslator
              i18nKey="dsr-proxy-withdraw-description-pending"
              params={{ amount: formatCryptoBalance(roundHalfUp(meta.amount, 'DAI')) }}
            />
          ),
          recent: (
            <TxTranslator
              i18nKey="dsr-proxy-withdraw-description-recent"
              params={{ amount: formatCryptoBalance(roundHalfUp(meta.amount, 'DAI')) }}
            />
          ),
          recentFailed: (
            <TxTranslator
              i18nKey="dsr-proxy-withdraw-description-recent-failed"
              params={{ amount: formatCryptoBalance(roundHalfUp(meta.amount, 'DAI')) }}
            />
          ),
          notification: (
            <TxTranslator
              i18nKey="dsr-proxy-withdraw-notification"
              params={{ amount: formatCryptoBalance(roundHalfUp(meta.amount, 'DAI')) }}
            />
          ),
          notificationPast: (
            <TxTranslator
              i18nKey="dsr-proxy-withdraw-notification-past"
              params={{ amount: formatCryptoBalance(roundHalfUp(meta.amount, 'DAI')) }}
            />
          ),
        }
      case TxMetaKind.approve:
        return {
          pending: (
            <TxTranslator
              i18nKey="erc20-approve-description-pending"
              params={{ token: meta.token }}
            />
          ),
          recent: (
            <TxTranslator
              i18nKey="erc20-approve-description-recent"
              params={{ token: meta.token }}
            />
          ),
          recentFailed: (
            <TxTranslator
              i18nKey="erc20-approve-description-recent-failed"
              params={{ token: meta.token }}
            />
          ),
          notification: (
            <TxTranslator i18nKey="erc20-approve-notification" params={{ token: meta.token }} />
          ),
          notificationPast: (
            <TxTranslator
              i18nKey="erc20-approve-notification-past"
              params={{ token: meta.token }}
            />
          ),
        }
      case TxMetaKind.disapprove:
        return {
          pending: (
            <TxTranslator
              i18nKey="erc20-disapprove-description-pending"
              params={{ token: meta.token }}
            />
          ),
          recent: (
            <TxTranslator
              i18nKey="erc20-disapprove-description-recent"
              params={{ token: meta.token }}
            />
          ),
          recentFailed: (
            <TxTranslator
              i18nKey="erc20-disapprove-description-recent-failed"
              params={{ token: meta.token }}
            />
          ),
          notification: (
            <TxTranslator i18nKey="erc20-disapprove-notification" params={{ token: meta.token }} />
          ),
          notificationPast: (
            <TxTranslator
              i18nKey="erc20-disapprove-notification-past"
              params={{ token: meta.token }}
            />
          ),
        }
      case TxMetaKind.transferEth:
        return {
          pending: (
            <TxTranslator
              i18nKey="eth-send-description-pending"
              params={{ amount: formatCryptoBalance(meta.amount) }}
            />
          ),
          recent: (
            <TxTranslator
              i18nKey="eth-send-description-recent"
              params={{ amount: formatCryptoBalance(meta.amount) }}
            />
          ),
          recentFailed: (
            <TxTranslator
              i18nKey="eth-send-description-recent-failed"
              params={{ amount: formatCryptoBalance(meta.amount) }}
            />
          ),
          notification: <TxTranslator i18nKey="eth-send-notification" />,
          notificationPast: <TxTranslator i18nKey="eth-send-notification-past" />,
        }
      case TxMetaKind.transferErc20:
        return {
          pending: (
            <TxTranslator
              i18nKey="erc20-send-description-pending"
              params={{ amount: formatCryptoBalance(meta.amount), token: meta.token }}
            />
          ),
          recent: (
            <TxTranslator
              i18nKey="erc20-send-description-recent"
              params={{ amount: formatCryptoBalance(meta.amount), token: meta.token }}
            />
          ),
          recentFailed: (
            <TxTranslator
              i18nKey="erc20-send-description-recent-failed"
              params={{ amount: formatCryptoBalance(meta.amount), token: meta.token }}
            />
          ),
          notification: (
            <TxTranslator i18nKey="erc20-send-notification" params={{ token: meta.token }} />
          ),
          notificationPast: (
            <TxTranslator i18nKey="erc20-send-notification-past" params={{ token: meta.token }} />
          ),
        }
      default:
        return {
          pending: 'missing translation description pending',
          recent: 'missing translation description recent',
          recentFailed: 'missing translation description recent failed',
          notification: 'missing translation notification',
          notificationPast: 'missing translation notification past',
        }
    }
  } else if (kind === 'wyre') {
    const { amount, token } = raw as WyreOrder

    return {
      pending: (
        <TxTranslator
          i18nKey="wyre-purchase-description-pending"
          params={{ order: `${formatCryptoBalance(amount)} ${token.toUpperCase()}` }}
        />
      ),
      recent: (
        <TxTranslator
          i18nKey="wyre-purchase-description-recent"
          params={{ order: `${formatCryptoBalance(amount)} ${token.toUpperCase()}` }}
        />
      ),
      recentFailed: (
        <TxTranslator
          i18nKey="wyre-purchase-description-recent-failed"
          params={{ order: `${formatCryptoBalance(amount)} ${token.toUpperCase()}` }}
        />
      ),
      notification: (
        <Flex sx={{ alignItems: 'center ' }}>
          <Icon name="wyre" size="auto" width="20" height="20" mr={1} />
          <Text variant="txManagerDescription">
            <TxTranslator i18nKey="wyre-purchase-notification" />
          </Text>
        </Flex>
      ),
      notificationPast: (
        <Flex sx={{ alignItems: 'center ' }}>
          <Icon name="wyre" size="auto" width="20" height="20" mr={1} />
          <Text variant="txManagerDescription">
            <TxTranslator i18nKey="wyre-purchase-notification-past" />
          </Text>
        </Flex>
      ),
    }
  } else if (kind === 'moonpay') {
    const { amount, token } = raw as MoonpayOrder

    return {
      pending: (
        <TxTranslator
          i18nKey="moonpay-purchase-description-pending"
          params={{
            order: `${!amount.eq(zero) ? formatCryptoBalance(amount) : ''} ${token.toUpperCase()}`,
          }}
        />
      ),
      recent: (
        <TxTranslator
          i18nKey="moonpay-purchase-description-recent"
          params={{
            order: `${!amount.eq(zero) ? formatCryptoBalance(amount) : ''} ${token.toUpperCase()}`,
          }}
        />
      ),
      recentFailed: (
        <TxTranslator
          i18nKey="moonpay-purchase-description-recent-failed"
          params={{
            order: `${!amount.eq(zero) ? formatCryptoBalance(amount) : ''} ${token.toUpperCase()}`,
          }}
        />
      ),
      notification: (
        <Flex sx={{ alignItems: 'center' }}>
          <Icon name="moonpay" size="auto" width="20" height="20" mr={1} />
          <Text variant="txManagerDescription">
            <TxTranslator i18nKey="moonpay-purchase-notification" />
          </Text>
        </Flex>
      ),
      notificationPast: (
        <Flex sx={{ alignItems: 'center' }}>
          <Icon name="moonpay" size="auto" width="20" height="20" mr={1} />
          <Text variant="txManagerDescription">
            <TxTranslator i18nKey="moonpay-purchase-notification-past" />
          </Text>
        </Flex>
      ),
    }
  } else if (kind === 'latamex') {
    const { amount, token } = raw as LatamexOrder

    return {
      pending: (
        <TxTranslator
          i18nKey="latamex-purchase-description-pending"
          params={{
            order: `${!amount.eq(zero) ? formatCryptoBalance(amount) : ''} ${token.toUpperCase()}`,
          }}
        />
      ),
      recent: (
        <TxTranslator
          i18nKey="latamex-purchase-description-recent"
          params={{
            order: `${!amount.eq(zero) ? formatCryptoBalance(amount) : ''} ${token.toUpperCase()}`,
          }}
        />
      ),
      recentFailed: (
        <TxTranslator
          i18nKey="latamex-purchase-description-recent-failed"
          params={{
            order: `${!amount.eq(zero) ? formatCryptoBalance(amount) : ''} ${token.toUpperCase()}`,
          }}
        />
      ),
      notification: (
        <Flex sx={{ alignItems: 'center' }}>
          <Icon name="latamex" size={20} mr={1} style={{ viewbox: '20 10 140 140' }} />
          <Text variant="txManagerDescription">
            <TxTranslator i18nKey="latamex-purchase-notification" />
          </Text>
        </Flex>
      ),
      notificationPast: (
        <Flex sx={{ alignItems: 'center' }}>
          <Icon name="latamex" size={20} mr={1} style={{ viewbox: '20 10 140 140' }} />
          <Text variant="txManagerDescription">
            <TxTranslator i18nKey="latamex-purchase-notification-past" />
          </Text>
        </Flex>
      ),
    }
  }

  return {
    pending: 'missing translation description pending',
    recent: 'missing translation description recent',
    recentFailed: 'missing translation description recent failed',
    notification: 'missing translation notification',
    notificationPast: 'missing translation notification past',
  }
}
