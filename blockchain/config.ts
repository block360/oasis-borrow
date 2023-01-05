import { ContractDesc } from '@oasisdex/web3-context'
import { Abi } from 'helpers/types'
import { keyBy } from 'lodash'
import getConfig from 'next/config'
import { Dictionary } from 'ts-essentials'

import * as aaveLendingPool from './abi/aave-lending-pool.json'
import * as aavePriceOracle from './abi/aave-price-oracle.json'
import * as aaveProtocolDataProvider from './abi/aave-protocol-data-provider.json'
import * as automationBotAggregator from './abi/automation-bot-aggregator.json'
import * as automationBot from './abi/automation-bot.json'
import * as cdpRegistry from './abi/cdp-registry.json'
import * as eth from './abi/ds-eth-token.json'
import * as dsProxyFactory from './abi/ds-proxy-factory.json'
import * as dsProxyRegistry from './abi/ds-proxy-registry.json'
import * as dssCdpManager from './abi/dss-cdp-manager.json'
import * as dssCharter from './abi/dss-charter.json'
import * as dssCropper from './abi/dss-cropper.json'
import * as guniProxyActions from './abi/dss-guni-proxy-actions.json'
import * as dssProxyActionsCharter from './abi/dss-proxy-actions-charter.json'
import * as dssProxyActionsCropjoin from './abi/dss-proxy-actions-cropjoin.json'
import * as dssProxyActionsDsr from './abi/dss-proxy-actions-dsr.json'
import * as dssProxyActions from './abi/dss-proxy-actions.json'
import * as erc20 from './abi/erc20.json'
import * as exchange from './abi/exchange.json'
import * as getCdps from './abi/get-cdps.json'
import * as guniToken from './abi/guni-token.json'
import * as lidoCrvLiquidityFarmingReward from './abi/lido-crv-liquidity-farming-reward.json'
import * as otc from './abi/matching-market.json'
import * as mcdDog from './abi/mcd-dog.json'
import * as mcdEnd from './abi/mcd-end.json'
import * as mcdJoinDai from './abi/mcd-join-dai.json'
import * as mcdJug from './abi/mcd-jug.json'
import * as mcdPot from './abi/mcd-pot.json'
import * as mcdSpot from './abi/mcd-spot.json'
import * as merkleRedeemer from './abi/merkle-redeemer.json'
import * as dssMultiplyProxyActions from './abi/multiply-proxy-actions.json'
import * as operationExecutor from './abi/operation-executor.json'
import * as otcSupport from './abi/otc-support-methods.json'
import * as vat from './abi/vat.json'
import {
  getCollateralJoinContracts,
  getCollaterals,
  getCollateralTokens,
  getOsms,
} from './addresses/addressesUtils'
import { default as goerliAddresses } from './addresses/goerli.json'
import { default as mainnetAddresses } from './addresses/mainnet.json'

export function contractDesc(abi: Abi[], address: string): ContractDesc {
  return { abi, address }
}

const infuraProjectId =
  process.env.INFURA_PROJECT_ID || getConfig()?.publicRuntimeConfig?.infuraProjectId || ''
const etherscanAPIKey =
  process.env.ETHERSCAN_API_KEY || getConfig()?.publicRuntimeConfig?.etherscan || ''
const mainnetCacheUrl =
  process.env.MAINNET_CACHE_URL ||
  getConfig()?.publicRuntimeConfig?.mainnetCacheURL ||
  'https://oazo-bcache.new.oasis.app/api/v1'

export const charterIlks = []

export const cropJoinIlks = []

export const supportedIlks = [
  /* export just for test purposes */ 'ETH-A',
  'ETH-B',
  'ETH-C',
  'DAI',
  'WBTC-A',
  'WBTC-B',
  'WBTC-C',
  ...charterIlks,
  ...cropJoinIlks,
] as const

export const ilksNotSupportedOnGoerli = [
  'GUNIV3DAIUSDC1-A',
  'GUNIV3DAIUSDC2-A',
  ...charterIlks,
  ...cropJoinIlks,
] as const

const tokensMainnet = {
  ...getCollateralTokens(mainnetAddresses, supportedIlks),
  WETH: contractDesc(eth, mainnetAddresses['ETH']),
  DAI: contractDesc(erc20, mainnetAddresses['MCD_DAI']),
  MKR: contractDesc(erc20, mainnetAddresses['MCD_GOV']),
} as Dictionary<ContractDesc>
const protoMain = {
  id: '1',
  name: 'main',
  label: 'Mainnet',
  infuraUrl: `https://mainnet.infura.io/v3/${infuraProjectId}`,
  infuraUrlWS: `wss://mainnet.infura.io/ws/v3/${infuraProjectId}`,
  safeConfirmations: 10,
  openVaultSafeConfirmations: 6,
  otc: contractDesc(otc, '0x794e6e91555438aFc3ccF1c5076A74F42133d08D'),
  collaterals: getCollaterals(mainnetAddresses, supportedIlks),
  tokens: tokensMainnet,
  tokensMainnet,
  joins: {
    ...getCollateralJoinContracts(mainnetAddresses, supportedIlks),
  },
  getCdps: contractDesc(getCdps, mainnetAddresses.GET_CDPS),
  mcdOsms: getOsms(mainnetAddresses, supportedIlks),
  mcdJug: contractDesc(mcdJug, mainnetAddresses.MCD_JUG),
  mcdPot: contractDesc(mcdPot, mainnetAddresses.MCD_POT),
  mcdEnd: contractDesc(mcdEnd, mainnetAddresses.MCD_END),
  mcdSpot: contractDesc(mcdSpot, mainnetAddresses.MCD_SPOT),
  mcdDog: contractDesc(mcdDog, mainnetAddresses.MCD_DOG),
  merkleRedeemer: contractDesc(merkleRedeemer, '0xd9fabf81Ed15ea71FBAd0C1f77529a4755a38054'),
  dssCharter: contractDesc(dssCharter, '0x0000123'),
  dssCdpManager: contractDesc(dssCdpManager, mainnetAddresses.CDP_MANAGER),
  otcSupportMethods: contractDesc(otcSupport, '0x9b3f075b12513afe56ca2ed838613b7395f57839'),
  vat: contractDesc(vat, mainnetAddresses.MCD_VAT),
  mcdJoinDai: contractDesc(mcdJoinDai, mainnetAddresses.MCD_JOIN_DAI),
  dsProxyRegistry: contractDesc(dsProxyRegistry, mainnetAddresses.PROXY_REGISTRY),
  dsProxyFactory: contractDesc(dsProxyFactory, mainnetAddresses.PROXY_FACTORY),
  dssProxyActions: contractDesc(dssProxyActions, mainnetAddresses.PROXY_ACTIONS),
  dssProxyActionsCharter: contractDesc(dssProxyActionsCharter, '0x0000'),
  // automationBot: contractDesc(automationBot, '0x6E87a7A0A03E51A741075fDf4D1FCce39a4Df01b'),
  // automationBotAggregator: contractDesc(
  //   automationBotAggregator,
  //   '0x5f1d184204775fBB351C4b2C61a2fD4aAbd3fB76',
  // ),
  // serviceRegistry: '0x9b4Ae7b164d195df9C4Da5d08Be88b2848b2EaDA',
  // guniProxyActions: contractDesc(guniProxyActions, '0xed3a954c0adfc8e3f85d92729c051ff320648e30'),
  // guniResolver: '0x0317650Af6f184344D7368AC8bB0bEbA5EDB214a',
  // guniRouter: '0x14E6D67F824C3a7b4329d3228807f8654294e4bd',
  // dssMultiplyProxyActions: contractDesc(
  //   dssMultiplyProxyActions,
  //   '0x2a49eae5cca3f050ebec729cf90cc910fadaf7a2',
  // ),
  // dssCropper: contractDesc(dssCropper, '0x8377CD01a5834a6EaD3b7efb482f678f2092b77e'),
  cdpRegistry: contractDesc(cdpRegistry, '0xBe0274664Ca7A68d6b5dF826FB3CcB7c620bADF3'),
  // dssProxyActionsCropjoin: contractDesc(
  //   dssProxyActionsCropjoin,
  //   '0xa2f69F8B9B341CFE9BfBb3aaB5fe116C89C95bAF',
  // ),
  // defaultExchange: contractDesc(exchange, '0xb5eB8cB6cED6b6f8E13bcD502fb489Db4a726C7B'),
  // noFeesExchange: contractDesc(exchange, '0x99e4484dac819aa74b347208752306615213d324'),
  // lowerFeesExchange: contractDesc(exchange, '0xf22f17b1d2354b4f4f52e4d164e4eb5e1f0a6ba6'),
  fmm: mainnetAddresses.MCD_FLASH,
  etherscan: {
    url: 'https://etherscan.io',
    apiUrl: 'https://api.etherscan.io/api',
    apiKey: etherscanAPIKey || '',
  },
  ethtx: {
    url: 'https://ethtx.info/mainnet',
  },
  taxProxyRegistries: ['0xaa63c8683647ef91b3fdab4b4989ee9588da297b'],
  dssProxyActionsDsr: contractDesc(
    dssProxyActionsDsr,
    '0x07ee93aEEa0a36FfF2A9B95dd22Bd6049EE54f26',
  ),
  magicLink: {
    apiKey: '',
  },
  cacheApi: mainnetCacheUrl,
  lidoCrvLiquidityFarmingReward: contractDesc(
    lidoCrvLiquidityFarmingReward,
    // address from here: https://docs.lido.fi/deployed-contracts
    '0x99ac10631f69c753ddb595d074422a0922d9056b',
  ),
  aaveTokens: {},
  aaveProtocolDataProvider: contractDesc(
    aaveProtocolDataProvider,
    // address from here:https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts
    mainnetAddresses.AAVE_PROTOCOL_DATA_PROVIDER,
  ),
  aavePriceOracle: contractDesc(
    aavePriceOracle,
    // address from here:https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts
    mainnetAddresses.AAVE_PRICE_ORACLE,
  ),
  aaveLendingPool: contractDesc(aaveLendingPool, mainnetAddresses.AAVE_LENDING_POOL),
  operationExecutor: contractDesc(operationExecutor, mainnetAddresses.OPERATION_EXECUTOR),
  // swapAddress: mainnetAddresses.SWAP,
  // chainlinkEthUsdPriceFeedAddress: mainnetAddresses.CHAINLINK_ETH_USD_PRICE_FEED,
}

export type NetworkConfig = typeof protoMain

const main: NetworkConfig = protoMain

const goerli: NetworkConfig = {
  id: '5',
  name: 'goerli',
  label: 'goerli',
  infuraUrl: `https://goerli.block360.io/https`,
  infuraUrlWS: `wss://goerli.block360.io/wss`,
  safeConfirmations: 6,
  openVaultSafeConfirmations: 6,
  otc: contractDesc(otc, '0x0000000000000000000000000000000000000000'),
  collaterals: getCollaterals(goerliAddresses, supportedIlks),
  tokens: {
    ...getCollateralTokens(goerliAddresses, supportedIlks),
    WETH: contractDesc(eth, goerliAddresses.ETH),
    DAI: contractDesc(erc20, goerliAddresses.MCD_DAI),
    MKR: contractDesc(erc20, goerliAddresses['MCD_GOV']),
  },
  tokensMainnet: protoMain.tokensMainnet,
  joins: {
    ...getCollateralJoinContracts(goerliAddresses, supportedIlks),
  },
  getCdps: contractDesc(getCdps, goerliAddresses.GET_CDPS),
  mcdOsms: getOsms(goerliAddresses, supportedIlks),
  mcdPot: contractDesc(mcdPot, goerliAddresses.MCD_POT),
  mcdJug: contractDesc(mcdJug, goerliAddresses.MCD_JUG),
  mcdEnd: contractDesc(mcdEnd, goerliAddresses.MCD_END),
  mcdSpot: contractDesc(mcdSpot, goerliAddresses.MCD_SPOT),
  mcdDog: contractDesc(mcdDog, goerliAddresses.MCD_DOG),
  merkleRedeemer: contractDesc(merkleRedeemer, '0x23440aC6c8a10EA89132da74B705CBc6D99a805b'),
  dssCharter: contractDesc(dssCharter, '0x0000123'),
  dssCdpManager: contractDesc(dssCdpManager, goerliAddresses.CDP_MANAGER),
  otcSupportMethods: contractDesc(otcSupport, '0x0000000000000000000000000000000000000000'),
  vat: contractDesc(vat, goerliAddresses.MCD_VAT),
  mcdJoinDai: contractDesc(mcdJoinDai, goerliAddresses.MCD_JOIN_DAI),
  dsProxyRegistry: contractDesc(dsProxyRegistry, goerliAddresses.PROXY_REGISTRY),
  dsProxyFactory: contractDesc(dsProxyFactory, goerliAddresses.PROXY_FACTORY),
  dssProxyActions: contractDesc(dssProxyActions, goerliAddresses.PROXY_ACTIONS),
  dssProxyActionsCharter: contractDesc(dssCropper, '0x00000'),
  cdpRegistry: contractDesc(cdpRegistry, '0xb769554194c37a7eBFcE27CF8D492CeCb9AE2E39'),
  // dssProxyActionsCropjoin: contractDesc(dssProxyActionsCropjoin, '0x'),
  // dssMultiplyProxyActions: contractDesc(
  //   dssMultiplyProxyActions,
  //   '0xc9628adc0a9f95D1d912C5C19aaBFF85E420a853',
  // ),
  // guniProxyActions: contractDesc(guniProxyActions, '0x'), // TODO: add address
  // dssCropper: contractDesc(dssCropper, '0x00000'), // DOES NOT EXISTS
  // guniResolver: '0x',
  // guniRouter: '0x',
  // automationBot: contractDesc(automationBot, '0xabDB63B4b3BA9f960CF942800a6982F88e9b1A6b'),
  // automationBotAggregator: contractDesc(
  //   automationBotAggregator,
  //   '0xeb3c922A805FAEEac8f311E1AdF34fBC518099ab',
  // ),
  // serviceRegistry: '0x5A5277B8c8a42e6d8Ab517483D7D59b4ca03dB7F',
  // defaultExchange: contractDesc(exchange, '0x2b0b4c5c58fe3CF8863c4948887099A09b84A69c'),
  // lowerFeesExchange: contractDesc(exchange, '0x2b0b4c5c58fe3CF8863c4948887099A09b84A69c'),
  // noFeesExchange: contractDesc(exchange, '0x2b0b4c5c58fe3CF8863c4948887099A09b84A69c'),
  // Currently this is not supported on Goerli - no deployed contract
  fmm: goerliAddresses.MCD_FLASH,
  etherscan: {
    url: 'https://goerli.etherscan.io',
    apiUrl: 'https://api-goerli.etherscan.io/api',
    apiKey: etherscanAPIKey || '',
  },
  ethtx: {
    url: 'https://ethtx.info/goerli',
  },
  taxProxyRegistries: [goerliAddresses.PROXY_REGISTRY],
  dssProxyActionsDsr: contractDesc(dssProxyActionsDsr, goerliAddresses.PROXY_ACTIONS_DSR),
  magicLink: {
    apiKey: '',
  },
  cacheApi: 'https://oazo-bcache-goerli-staging.new.oasis.app/api/v1',
  lidoCrvLiquidityFarmingReward: contractDesc(lidoCrvLiquidityFarmingReward, '0x00'),
  aaveTokens: {},
  aaveProtocolDataProvider: contractDesc(
    aaveProtocolDataProvider,
    // address from here:https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts
    goerliAddresses.AAVE_PROTOCOL_DATA_PROVIDER,
  ),
  aavePriceOracle: contractDesc(
    aavePriceOracle,
    // address from here:https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts
    goerliAddresses.AAVE_PRICE_ORACLE,
  ),
  aaveLendingPool: contractDesc(aaveLendingPool, goerliAddresses.AAVE_LENDING_POOL),
  operationExecutor: contractDesc(operationExecutor, goerliAddresses.OPERATION_EXECUTOR),
  // swapAddress: goerliAddresses.SWAP,
  // chainlinkEthUsdPriceFeedAddress: goerliAddresses.CHAINLINK_ETH_USD_PRICE_FEED,
}

const hardhat: NetworkConfig = {
  ...protoMain,
  id: '2137',
  name: 'hardhat',
  label: 'Hardhat',
  infuraUrl: `http://localhost:8545`,
  infuraUrlWS: `ws://localhost:8545`,
  cacheApi: 'https://oazo-bcache-mainnet-staging.new.oasis.app/api/v1',
  /* dssMultiplyProxyActions: contractDesc(
    dssMultiplyProxyActions,
    getConfig()?.publicRuntimeConfig?.multiplyProxyActions ||
      '0x2a49eae5cca3f050ebec729cf90cc910fadaf7a2',
  ),
  // guniProxyActions: contractDesc(guniProxyActions, '0xBEc49fA140aCaA83533fB00A2BB19bDdd0290f25'),
  defaultExchange: contractDesc(
    exchange,
    getConfig()?.publicRuntimeConfig?.exchangeAddress ||
      '0x4C4a2f8c81640e47606d3fd77B353E87Ba015584',
  ), */
}

export const networksById = keyBy([main, hardhat, goerli], 'id')
export const networksByName = keyBy([main, hardhat, goerli], 'name')

export const dappName = 'GSUcoin.app'
export const pollingInterval = 12000
