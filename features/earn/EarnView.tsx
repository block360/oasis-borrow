import { getTokens } from 'blockchain/tokensMetadata'
import { useAppContext } from 'components/AppContextProvider'
import { ProductCardEarnAave } from 'components/productCards/ProductCardEarnAave'
import { ProductCardEarnDsr } from 'components/productCards/ProductCardEarnDsr'
import { ProductCardEarnMaker } from 'components/productCards/ProductCardEarnMaker'
import {
  ProductCardsLoader,
  ProductCardsWrapper,
} from 'components/productCards/ProductCardsWrapper'
import { ProductHeader } from 'components/ProductHeader'
import { WithLoadingIndicator } from 'helpers/AppSpinner'
import { WithErrorHandler } from 'helpers/errorHandlers/WithErrorHandler'
import { useObservable } from 'helpers/observableHook'
import { supportedEarnIlks } from 'helpers/productCards'
import { useFeatureToggle } from 'helpers/useFeatureToggle'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { Grid } from 'theme-ui'

import { aaveStrategiesList } from '../aave/strategyConfig'

export function EarnView() {
  const showAaveStETHETHProductCard = useFeatureToggle('ShowAaveStETHETHProductCard')
  const { t } = useTranslation()
  const { productCardsData$ } = useAppContext()
  const [productCardsIlksData, productCardsIlksDataError] = useObservable(
    productCardsData$(supportedEarnIlks),
  )
  const daiSavingsRate = useFeatureToggle('DaiSavingsRate')

  const aaveStrategiesTokens = getTokens(aaveStrategiesList)
  return (
    <Grid
      sx={{
        flex: 1,
        position: 'relative',
        mb: ['123px', '187px'],
      }}
    >
      <ProductHeader
        title={t('product-page.earn.title')}
        description={t('product-page.earn.description')}
        link={{
          href: '/inprogress',
          text: t('product-page.earn.link'),
        }}
      />

      <WithErrorHandler error={[productCardsIlksDataError]}>
        <WithLoadingIndicator value={[productCardsIlksData]} customLoader={<ProductCardsLoader />}>
          {([_productCardsIlksData]) => (
            <ProductCardsWrapper>
              {/* TODO move logic regarding dsr to productCardsData$ */}
              {daiSavingsRate && <ProductCardEarnDsr />}
              {_productCardsIlksData.map((cardData) => (
                <ProductCardEarnMaker cardData={cardData} key={cardData.ilk} />
              ))}
              {showAaveStETHETHProductCard &&
              _productCardsIlksData.length && // just to show them simultanously
                aaveStrategiesTokens.map((cardData) => (
                  <ProductCardEarnAave
                    key={`ProductCardEarnAave_${cardData.symbol}`}
                    cardData={cardData}
                  />
                ))}
            </ProductCardsWrapper>
          )}
        </WithLoadingIndicator>
      </WithErrorHandler>
    </Grid>
  )
}
