import { useEffect, useState } from "react"
import { FavoritesContext } from "./FavoritesContext"

const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    
    const[favorites, setFavorites] = useState<string[]>(() => {
        const storedFavorites = localStorage.getItem("favorites")
        return storedFavorites ? JSON.parse(storedFavorites) : []
    })

     // Guardar favoritos en localStorage cada vez que cambien
     useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites))
    }, [favorites])
    
    const addFavorite = (id: string) => {
        setFavorites([...favorites, id])
    }
    const removeFavorite = (id: string) => {
        setFavorites(favorites.filter(favorite => favorite !== id))
    }

    const isFavorite = (id: string) => {
        return favorites.includes(id)
    }

    const clearFavorites = () => {
        setFavorites([])
    }

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export default FavoritesProvider