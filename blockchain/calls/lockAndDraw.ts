import dsProxy from 'blockchain/abi/ds-proxy.json'
import { TransactionDef } from 'blockchain/calls/callsHelpers'
import { contractDesc } from 'blockchain/config'
import { ContextConnected } from 'blockchain/network'
import { amountToWei } from 'blockchain/utils'
import { zero } from 'helpers/zero'
import { DsProxy } from 'types/web3-v1-contracts/ds-proxy'
import { DssProxyActions } from 'types/web3-v1-contracts/dss-proxy-actions'
import Web3 from 'web3'

import { LockAndDrawData } from '../../features/deposit/deposit'

function getCallData(data: LockAndDrawData, context: ContextConnected) {
  const { dssProxyActions, dssCdpManager, mcdJoinDai, mcdJug, joins, contract } = context
  const { id, tkn, lockAmount, drawAmount, ilk, proxyAddress } = data

  if (lockAmount.eq(zero) && drawAmount.eq(zero)) {
    return contract<DssProxyActions>(dssProxyActions).methods.open(
      dssCdpManager.address,
      Web3.utils.utf8ToHex(ilk),
      proxyAddress,
    )
  }
  if (id && tkn === 'ETH') {
    return contract<DssProxyActions>(dssProxyActions).methods.lockETHAndDraw(
      dssCdpManager.address,
      mcdJug.address,
      joins[ilk],
      mcdJoinDai.address,
      id,
      amountToWei(drawAmount, 'DAI').toFixed(0),
    )
  }
  if (tkn === 'ETH') {
    return contract<DssProxyActions>(dssProxyActions).methods.openLockETHAndDraw(
      dssCdpManager.address,
      mcdJug.address,
      joins[ilk],
      mcdJoinDai.address,
      Web3.utils.utf8ToHex(ilk),
      amountToWei(drawAmount, 'DAI').toFixed(0),
    )
  }
  if (id) {
    return contract<DssProxyActions>(dssProxyActions).methods.lockGemAndDraw(
      dssCdpManager.address,
      mcdJug.address,
      joins[ilk],
      mcdJoinDai.address,
      id,
      amountToWei(lockAmount, tkn).toFixed(0),
      amountToWei(drawAmount, 'DAI').toFixed(0),
      true,
    )
  }

  return contract<DssProxyActions>(dssProxyActions).methods.openLockGemAndDraw(
    dssCdpManager.address,
    mcdJug.address,
    joins[ilk],
    mcdJoinDai.address,
    Web3.utils.utf8ToHex(ilk),
    amountToWei(lockAmount, tkn).toFixed(0),
    amountToWei(drawAmount, 'DAI').toFixed(0),
    true,
  )
}
export const lockAndDraw: TransactionDef<LockAndDrawData> = {
  call: ({ proxyAddress }, { contract }) => {
    return (contract<DsProxy>(contractDesc(dsProxy, proxyAddress)).methods as any)[
      'execute(address,bytes)'
    ]
  },
  prepareArgs: (data, context) => {
    const { dssProxyActions } = context
    return [dssProxyActions.address, getCallData(data, context).encodeABI()]
  },
  options: ({ tkn, lockAmount }) =>
    tkn === 'ETH' ? { value: amountToWei(lockAmount, 'ETH').toString() } : {},
}