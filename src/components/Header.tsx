import { Link } from "react-router-dom"
import { useFavoritesStore } from "../store/favoritesStore"

const Header = () => {
  const { countFavorites } = useFavoritesStore()
  
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white border-b border-gray-800">
      <Link to="/" className="text-xl font-bold tracking-wide hover:text-amber-400 transition-colors">
        ₿ CryptoTracker
      </Link>
      <nav>
        <ul className="flex gap-6 text-sm uppercase tracking-wider">
          <li>
            <Link to="/" className="hover:text-amber-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/watchlist" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
              Favorites
              {countFavorites() > 0 && (
                <span className="bg-amber-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {countFavorites()}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header