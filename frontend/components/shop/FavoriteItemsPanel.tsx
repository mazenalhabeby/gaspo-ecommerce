"use client"

import {useFavoritesStore} from "@/store/favoritesStore"
import {FaRegHeart} from "react-icons/fa"
import ItemSheetPanel from "../ItemSheetPanel"

export default function FavoriteItemsPanel() {
  const {favorites, removeFavorite} = useFavoritesStore()

  const emptyMessage = (
    <div className="flex flex-col items-center justify-center gap-2 col-span-3">
      <FaRegHeart className="text-gray-400 w-16 h-16" />
      <p className="text-gray-500 text-sm">No items in the favorites yet.</p>
    </div>
  )

  return (
    <ItemSheetPanel
      icon={<FaRegHeart className="text-2xl" />}
      title="Favorites"
      discription="Your saved products. Easily access the items you love. You can view details, remove items."
      items={favorites}
      badgeColor="bg-red-600"
      emptyMessage={emptyMessage}
      linkHref="/favorites"
      linkLabel="View Favorites"
      onRemove={removeFavorite}
    />
  )
}
