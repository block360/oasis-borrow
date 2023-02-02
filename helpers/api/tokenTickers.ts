
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
