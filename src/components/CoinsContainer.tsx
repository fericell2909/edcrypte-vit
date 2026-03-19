
import { useState } from "react"
import { useCoins } from "../hooks/useCoins"
import CoinsTable from "./CoinsTable"

const CoinsContainer = () => {
    const [search,setSearch] = useState<string>("")
    const {data: coinsList, isLoading,isFetching, error} = useCoins()
    
    const filteredCoins = coinsList?.filter(coin => coin.name.toLowerCase().includes(search.toLowerCase()) || coin.symbol.toLowerCase().includes(search.toLowerCase()))

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <p className="flex justify-center px-4 py-4 text-red-500">{(error as Error).message}</p>
            </div>
        )
    }

    return (
        <>
            <input
                type="text"
                placeholder="Buscar criptomoneda"
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-center bg-white border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />{isFetching && <div className="">Actualizando datos . . .</div>}
            {filteredCoins && filteredCoins.length > 0 ? (
                <CoinsTable coins={filteredCoins} />
            ) : (
                <p className="text-center text-gray-500">No se encontraron criptomonedas.</p>
            )}
        </>
    )
}

export default CoinsContainer