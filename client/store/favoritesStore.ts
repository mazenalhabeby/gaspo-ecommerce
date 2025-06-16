// lib/store/favoritesStore.ts
import {
  ProductDetailType,
  ProductSummaryType,
} from "@/lib/schema/products.schema"
import {create} from "zustand"
import {persist} from "zustand/middleware"

interface FavoritesStore {
  favorites: (ProductSummaryType | ProductDetailType)[]
  toggleFavorite: (product: ProductSummaryType | ProductDetailType) => void
  isFavorite: (id: string) => boolean
  removeFavorite: (id: string) => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (product) => {
        const exists = get().favorites.find((p) => p.id === product.id)
        if (exists) {
          set({favorites: get().favorites.filter((p) => p.id !== product.id)})
        } else {
          set({favorites: [...get().favorites, product]})
        }
      },
      isFavorite: (id) => !!get().favorites.find((p) => p.id === id),
      removeFavorite: (id) =>
        set({favorites: get().favorites.filter((p) => p.id !== id)}),
    }),
    {
      name: "favorites-storage",
    }
  )
)
