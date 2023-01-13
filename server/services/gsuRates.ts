import axios from 'axios'
import { tokens } from 'blockchain/tokensMetadata'
import { PriceServiceResponse } from 'helpers/types'
import { amountFromWei } from '@oasisdex/utils'
import BigNumber from 'bignumber.js'


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
    url: `https://goerli.gsu.io/Umbraco/Api/Rates/GSU/?symbol=${product_id}`,
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
      [res.ticker]: Number(amountFromWei(new BigNumber(res.price))),
    }
  }, {})
}
