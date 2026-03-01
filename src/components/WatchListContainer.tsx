import { useContext, useEffect, useState } from "react"
import type { CoinInterface } from "../interfaces/Coin"
import CoinsTable from "./CoinsTable"
import { URL_COINS } from "../constants/api"
import { FavoritesContext } from "../context/FavoritesContext"

const WatchListContainer = () => {

    const [coinsList, setCoinsList] = useState<CoinInterface[]>([])
    const [loading, setLoading] = useState<Boolean>(true)
    const [error, setError] = useState<String | null>(null)

    const {favorites, clearFavorites} = useContext(FavoritesContext)

    const handleClearFavorites = () => {
        clearFavorites()
        setCoinsList([])
    }

    const handleRemoveFavorite = (id: string) => {
        setCoinsList(prev => prev.filter(coin => coin.id !== id))
    }

    useEffect(() => {

        if (favorites.length === 0) {
            setLoading(false)
            return
        }
        fetch(`${URL_COINS}&ids=${Array.isArray(favorites) ? favorites.join(",") : JSON.parse(favorites || "[]").join(",")}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                setCoinsList(data)
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
            <div className="mb-4 flex items-center justify-end   gap-2">
                <button
                onClick={handleClearFavorites}
                className="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
                Limpiar Favoritos
            </button>
            </div>
            {coinsList.length > 0 && <CoinsTable coins={coinsList} onRemoveFavorite={handleRemoveFavorite} />}
            {coinsList.length === 0 && (
                <div>
                    <p className="flex justify-center px-4 py-4">No se encontraron resultados</p>
                </div>
            )}
        </>
    )
}

export default WatchListContainer