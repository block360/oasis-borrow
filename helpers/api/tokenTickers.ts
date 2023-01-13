import { getCoinbaseTickers } from 'server/services/coinbase'
import { getCoingeckoTickers } from 'server/services/coingecko'
import { getCoinPaprikaTickers } from 'server/services/coinPaprika'
import { getGSURatesTickers } from 'server/services/gsuRates'

export async function tokenTickers() {
  const results = await Promise.all([
    // getCoinPaprikaTickers(),
    // getCoinbaseTickers(),
    // getCoingeckoTickers(),
    getGSURatesTickers()
  ])
  const mergedTickers = results.reduce((acc, el) => ({ ...acc, ...el }), {})
  return mergedTickers
}
