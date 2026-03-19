import { useQuery } from "@tanstack/react-query"
import { getCoins } from "../services/coinServices"

export const useCoins = () => {
    return useQuery({
        queryKey: ["cryptos"],
        queryFn: getCoins,
        refetchOnWindowFocus: false,
        refetchInterval: 3000 
    })
}
    
