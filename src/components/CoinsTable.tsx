import type { CoinInterface } from "../interfaces/Coin"
import Coin from "./Coin"

const CoinsTable = ({coins, onRemoveFavorite} : {coins: CoinInterface[], onRemoveFavorite?: (id: string) => void}) => {

    return (
    <table
                className="w-full text-sm text-left text-gray-700 bg-white rounded-lg overflow-hidden shadow">
                <thead className="text-xs uppercase bg-gray-100 text-gray-600 border-b border-gray-200">
                    <tr>
                        <th scope="col" className="px-6 py-4">Orden</th>
                        <th scope="col" className="px-6 py-4">Nombre</th>
                        <th scope="col" className="px-6 py-4">Precio</th>
                        <th scope="col" className="px-6 py-4">Cambio 24h</th>
                        <th scope="col" className="px-6 py-4">Favorito</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        coins.map((coin, index) => (
                            <Coin key={`coin-${index}`} {...coin} onRemoveFavorite={onRemoveFavorite} />
                        ))
                    }

                </tbody>
            </table>
  )

}

export default CoinsTable