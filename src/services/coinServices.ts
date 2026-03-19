import { URL_COINS } from "../constants/api"
import type { CoinDetailInterface, CoinInterface } from "../interfaces/Coin"

const getCoins = async (): Promise<CoinInterface[]> => {
  const response = await fetch(`${URL_COINS}`)
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }

  return response.json()

}

const getCoinById = async (id: string): Promise<CoinDetailInterface> => {
  const response = await fetch(`${URL_COINS}&ids=${id}`)
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }
  const data = await response.json()
  if (data.length === 0) throw new Error("Criptomoneda no encontrada")
  return data[0]
}

export { getCoins, getCoinById }