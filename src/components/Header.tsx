import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white border-b border-gray-800">
      <Link to="/" className="text-xl font-bold tracking-wide hover:text-amber-400 transition-colors">
        ₿ CryptoTracker
      </Link>
      <nav>
        <ul className="flex gap-6 text-sm uppercase tracking-wider">
          <li>
            <Link to="/" className="hover:text-amber-400 transition-colors">
              OverView
            </Link>
          </li>
          <li>
            <Link to="/watchlist" className="hover:text-amber-400 transition-colors">
              Watchlist
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header