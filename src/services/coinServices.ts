import { URL_COINS } from "../constants/api"
import type { CoinInterface } from "../interfaces/Coin"

const getCoins = async (): Promise<CoinInterface[]> => {
  const response = await fetch(`${URL_COINS}`)
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }

  return response.json()

}

export { getCoins }