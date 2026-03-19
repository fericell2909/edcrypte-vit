import {create} from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface FavoritesStore {
    favorites: string[]
    addFavorite: (id: string) => void
    removeFavorite: (id: string) => void
    isFavorite: (id: string) => boolean,
    countFavorites: () => number,
    clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (id: string) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites
            : [...state.favorites, id],
        })),

      removeFavorite: (id: string) =>
        set((state) => ({
          favorites: state.favorites.filter((favId) => favId !== id),
        })),

      isFavorite: (id: string) => get().favorites.includes(id),

      countFavorites: () => get().favorites.length,

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
