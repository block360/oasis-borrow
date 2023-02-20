import { amountFromWei } from '@oasisdex/utils'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { tokens } from 'blockchain/tokensMetadata'
import { PriceServiceResponse } from 'helpers/types'

interface GSURateApiResponse {
  price: string
}

const requiredTickers = tokens
  .filter((token) => token.gsuRatesTicker)
  .map((token) => token.gsuRatesTicker) as any[]

async function fetchTicker(product_id: string): Promise<{ data: GSURateApiResponse }> {
  return axios({
    method: 'get',
    timeout: 5000,
    url: `https://api.gsucoin.app/Products/GSULive/?symbol=${product_id}`,
    responseType: 'json',
    headers: {
      Accept: 'application/json',
    },
  })
}

export async function getGSURatesTickers(): Promise<PriceServiceResponse> {
  const result = await Promise.allSettled(requiredTickers.map((ticker) => fetchTicker(ticker)))

  const mappedResult = result
    .filter((res) => res.status === 'fulfilled')
    .map((res) => (res as PromiseFulfilledResult<{ data: GSURateApiResponse }>).value.data)
    .map((res, idx) => ({ ...res, ticker: requiredTickers[idx] }))

  return mappedResult.reduce((acc, res) => {
    return {
      ...acc,
      [res.ticker]: res.price,
    }
  }, {})
}
