import { useEffect, useRef, useState } from "react"
import type { CoinInterface } from "../interfaces/Coin"
import CoinsTable from "./CoinsTable"
import { URL_COINS } from "../constants/api"

const CoinsContainer = () => {

    const [coinsList, setCoinsList] = useState<CoinInterface[]>([])
    const [coinsListOriginal, setCoinsListOriginal] = useState<CoinInterface[]>([])
    const [loading, setLoading] = useState<Boolean>(true)
    const [error, setError] = useState<String | null>(null)
    const serchtInput = useRef<HTMLInputElement>(null)
    
    const handleSearch = () => {
        const searchTerm = serchtInput.current?.value.toLowerCase() || ""
        const filteredCoins = coinsListOriginal.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm)
        )
        setCoinsList(filteredCoins)
    }

    

    useEffect(() => {

        fetch(URL_COINS)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`)
                }
                return response.json()
            })
            .then(data => {

                setCoinsList(data)
                setCoinsListOriginal(data)
            })
            .catch(error => {
                console.error("Error fetching coins data:", error)
                setError("No se pudieron cargar los datos de las criptomonedas.")
            })
            .finally(() => setLoading(false))

    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <p className="flex justify-center px-4 py-4 text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <>
            <input
                type="text"
                placeholder="Buscar criptomoneda"
                onChange={handleSearch}
                ref={serchtInput}
                className="w-full text-center bg-white border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {coinsList.length > 0 && <CoinsTable coins={coinsList} />}
            {coinsList.length === 0 && (
                <div>
                    <p className="flex justify-center px-4 py-4">No se encontraron resultados</p>
                </div>
            )}
        </>
    )
}

export default CoinsContainer