import BigNumber from 'bignumber.js'
import { maxUint256 } from 'blockchain/calls/erc20'
import { expect } from 'chai'
import { mockManageVault$ } from 'helpers/mocks/manageVault.mock'
import { DEFAULT_PROXY_ADDRESS } from 'helpers/mocks/vaults.mock'
import { getStateUnpacker } from 'helpers/testHelpers'
import { zero } from 'helpers/zero'

describe('manageVaultValidations', () => {
  it('validates if deposit amount exceeds collateral balance or depositing all ETH', () => {
    const depositAmountExceeds = new BigNumber('2')
    const depositAmountAll = new BigNumber('1')

    const state = getStateUnpacker(
      mockManageVault$({
        balanceInfo: {
          collateralBalance: new BigNumber('1'),
        },
        vault: {
          ilk: 'ETH-A',
        },
      }),
    )

    state().updateDeposit!(depositAmountExceeds)
    expect(state().errorMessages).to.deep.equal(['depositAmountExceedsCollateralBalance'])
    state().updateDeposit!(depositAmountAll)
    expect(state().errorMessages).to.deep.equal(['depositingAllEthBalance'])
  })

  it(`validates if generate doesn't exceeds debt ceiling, debt floor`, () => {
    const depositAmount = new BigNumber('2')
    const generateAmountAboveCeiling = new BigNumber('30')
    const generateAmountBelowFloor = new BigNumber('9')

    const state = getStateUnpacker(
      mockManageVault$({
        ilkData: {
          debtCeiling: new BigNumber('8000025'),
          debtFloor: new BigNumber('2000'),
        },
        vault: {
          collateral: new BigNumber('3'),
          debt: new BigNumber('1990'),
          ilk: 'ETH-A',
        },
        priceInfo: {
          ethChangePercentage: new BigNumber(-0.1),
        },
      }),
    )

    state().updateDeposit!(depositAmount)
    state().toggleDepositAndGenerateOption!()
    state().updateGenerate!(generateAmountAboveCeiling)
    expect(state().errorMessages).to.deep.equal(['generateAmountExceedsDebtCeiling'])

    state().updateGenerate!(generateAmountBelowFloor)
    expect(state().errorMessages).to.deep.equal(['generateAmountLessThanDebtFloor'])
  })

  it(`validates if generate or withdraw amounts are putting vault at risk, danger or exceeding day yield`, () => {
    const withdrawAmount = new BigNumber('0.1')
    const generateAmountExceedsYield = new BigNumber(60)
    const generateAmountWarnings = new BigNumber(20)

    const state = getStateUnpacker(
      mockManageVault$({
        ilkData: {
          debtFloor: new BigNumber('1500'),
        },
        vault: {
          collateral: new BigNumber('3'),
          debt: new BigNumber('1990'),
          ilk: 'ETH-A',
        },
        priceInfo: {
          ethChangePercentage: new BigNumber(-0.25),
        },
      }),
    )

    state().updateWithdraw!(withdrawAmount)
    expect(state().errorMessages).to.deep.equal(['withdrawAmountExceedsFreeCollateralAtNextPrice'])
    state().updateWithdraw!(undefined)

    state().updateDeposit!(zero)
    state().toggleDepositAndGenerateOption!()
    state().updateGenerate!(generateAmountExceedsYield)
    expect(state().errorMessages).to.deep.equal([
      'generateAmountExceedsDaiYieldFromTotalCollateralAtNextPrice',
    ])

    state().updateGenerate!(generateAmountWarnings)
    expect(state().warningMessages).to.deep.equal([
      'vaultWillBeAtRiskLevelDangerAtNextPrice',
      'vaultWillBeAtRiskLevelWarning',
    ])
  })

  it(`validates if generate will result in warning at next price`, () => {
    const generateAmountWarnings = new BigNumber(20)

    const state = getStateUnpacker(
      mockManageVault$({
        ilkData: {
          debtFloor: new BigNumber('1500'),
        },
        vault: {
          collateral: new BigNumber('3'),
          debt: new BigNumber('1690'),
          ilk: 'ETH-A',
        },
        priceInfo: {
          ethChangePercentage: new BigNumber(-0.1),
        },
      }),
    )

    state().updateDeposit!(zero)
    state().toggleDepositAndGenerateOption!()

    state().updateGenerate!(generateAmountWarnings)
    expect(state().warningMessages).to.deep.equal(['vaultWillBeAtRiskLevelWarningAtNextPrice'])
  })

  it('validates custom allowance setting for collateral', () => {
    const depositAmount = new BigNumber('100')
    const customAllowanceAmount = new BigNumber('99')

    const state = getStateUnpacker(
      mockManageVault$({
        proxyAddress: DEFAULT_PROXY_ADDRESS,
        collateralAllowance: zero,
      }),
    )

    state().updateDeposit!(depositAmount)

    state().progress!()
    expect(state().stage).to.deep.equal('collateralAllowanceWaitingForConfirmation')
    state().resetCollateralAllowanceAmount!()
    state().updateCollateralAllowanceAmount!(customAllowanceAmount)
    expect(state().collateralAllowanceAmount!).to.deep.equal(customAllowanceAmount)
    expect(state().errorMessages).to.deep.equal([
      'customCollateralAllowanceAmountLessThanDepositAmount',
    ])

    state().updateCollateralAllowanceAmount!(maxUint256.plus(new BigNumber('1')))
    expect(state().errorMessages).to.deep.equal([
      'customCollateralAllowanceAmountExceedsMaxUint256',
    ])
  })

  it('validates custom allowance setting for dai', () => {
    const paybackAmount = new BigNumber('100')
    const customAllowanceAmount = new BigNumber('99')

    const state = getStateUnpacker(
      mockManageVault$({
        proxyAddress: DEFAULT_PROXY_ADDRESS,
        daiAllowance: zero,
      }),
    )

    state().toggle!()
    state().updatePayback!(paybackAmount)

    state().progress!()
    expect(state().stage).to.deep.equal('daiAllowanceWaitingForConfirmation')
    state().resetDaiAllowanceAmount!()
    state().updateDaiAllowanceAmount!(customAllowanceAmount)
    expect(state().daiAllowanceAmount!).to.deep.equal(customAllowanceAmount)
    expect(state().errorMessages).to.deep.equal(['customDaiAllowanceAmountLessThanPaybackAmount'])

    state().updateDaiAllowanceAmount!(maxUint256.plus(new BigNumber('1')))
    expect(state().errorMessages).to.deep.equal(['customDaiAllowanceAmountExceedsMaxUint256'])
  })

  it('validates payback amount', () => {
    const paybackAmountExceedsVaultDebt = new BigNumber('100')
    const paybackAmountNotEnough = new BigNumber('20')

    const state = getStateUnpacker(
      mockManageVault$({
        vault: {
          debt: new BigNumber('40'),
        },
      }),
    )

    state().toggle!()
    state().updatePayback!(paybackAmountExceedsVaultDebt)
    expect(state().errorMessages).to.deep.equal(['paybackAmountExceedsVaultDebt'])

    state().updatePayback!(paybackAmountNotEnough)
    expect(state().errorMessages).to.deep.equal(['debtWillBeLessThanDebtFloor'])
  })
})
