
import { useEffect, useState } from 'react'

import type { CoinInterface }  from '../interfaces/Coin'
import { Link } from 'react-router-dom'

const Coin = ({ id, name, symbol, image, current_price, price_change_percentage_24h, onRemoveFavorite }: CoinInterface & { onRemoveFavorite?: (id: string) => void }) => {
  
  const [isFavorite, setIsFavorite] = useState<Boolean | null>(null)
  
  useEffect(() => { 
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")  
    setIsFavorite(favorites.some((fav: CoinInterface) => fav.id === id))
  }, [id])

  const handleFavorites = () => {

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav: CoinInterface) => fav.id !== id)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      onRemoveFavorite?.(id)
    } else {
      favorites.push({ id, name, symbol, image, current_price, price_change_percentage_24h })
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
    setIsFavorite(!isFavorite)
  }
  
  return (
    <tr className="border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-gray-500">{id}</td>
      <td className="px-6 py-4">
          <Link to={`/coin/${id}`} className="flex items-center gap-3">
            <img
              src={image}
              alt={symbol}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <span className="font-medium text-gray-900">{name}</span>
              <span className="ml-2 text-sm text-gray-400">{symbol}</span>
            </div>
          </Link>
      </td>
      <td className="px-6 py-4 font-medium text-gray-900">${current_price}</td>
      <td className={`px-6 py-4 font-medium ${price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-500'}`}>
        {price_change_percentage_24h >= 0 ? '+' : ''}{price_change_percentage_24h.toFixed(2)}%
      </td>
      <td className="px-6 py-4">
        <button
          onClick={handleFavorites}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            isFavorite
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isFavorite ? "Quitar de Favoritos" : "Agregar a Favoritos"}
        </button>
      </td>
    </tr>

  )
}

export default Coin