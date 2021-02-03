import { amountFromWei } from '@oasisdex/utils'
import { BigNumber } from 'bignumber.js'
import { Erc20 } from 'types/web3-v1-contracts/erc20'

import { CallDef, TransactionDef } from './callsHelpers'
import { getToken } from '../tokensMetadata'
import { TxMetaKind } from './txMeta'

export const MIN_ALLOWANCE = new BigNumber('0xffffffffffffffffffffffffffffffff')
//
export const maxUint256 = new BigNumber(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  16,
)

export interface TokenBalanceArgs {
  token: string
  account: string
}

export const tokenBalance: CallDef<TokenBalanceArgs, BigNumber> = {
  call: ({ token }, { contract, tokens }) => contract<Erc20>(tokens[token]).methods.balanceOf,
  prepareArgs: ({ account }) => [account],
  postprocess: (result, { token }) =>
    amountFromWei(new BigNumber(result), getToken(token).precision),
}

interface TokenAllowanceArgs {
  token: string
  owner: string
  spender: string
}

export const tokenAllowance: CallDef<TokenAllowanceArgs, boolean> = {
  call: ({ token }, { contract, tokens }) => contract<Erc20>(tokens[token]).methods.allowance,
  prepareArgs: ({ owner, spender }) => [owner, spender],
  postprocess: (result: any) => new BigNumber(result).gte(maxUint256),
}

export type ApproveData = {
  kind: TxMetaKind.approve
  token: string
  spender: string
}

export const approve: TransactionDef<ApproveData> = {
  call: ({ token }, { tokens, contract }) => contract<Erc20>(tokens[token]).methods.approve,
  prepareArgs: ({ spender }) => [spender, maxUint256.toFixed()],
}

export type DisapproveData = {
  kind: TxMetaKind.disapprove
  token: string
  spender: string
}

export const disapprove: TransactionDef<DisapproveData> = {
  call: ({ token }, { tokens, contract }) => contract<Erc20>(tokens[token]).methods.approve,
  prepareArgs: ({ spender }) => [spender, 0],
}
