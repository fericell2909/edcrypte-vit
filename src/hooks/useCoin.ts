import { useQuery } from "@tanstack/react-query"
import { getCoinById } from "../services/coinServices"

export const useCoin = (id: string) => {
    return useQuery({
        queryKey: ["coin", id],
        queryFn: () => getCoinById(id),
        refetchOnWindowFocus: false,
        refetchInterval: 3000
    })
}
