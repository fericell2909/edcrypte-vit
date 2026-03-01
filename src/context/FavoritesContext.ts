import { createContext } from "react"

// Lista de favoritos
// funcion agregar un favorito
// funcion eliminar un favorito
// Verificar un favorito

export interface FavoritesContextType {
    favorites: any[],
    addFavorite: (id: string) => void,
    removeFavorite: (id: string) => void,
    isFavorite: (id: string) => boolean,
    clearFavorites: () => void
}

export const FavoritesContext = createContext<FavoritesContextType>({} as FavoritesContextType)

