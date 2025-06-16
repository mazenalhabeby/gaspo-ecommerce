"use client"

import {useFavoritesStore} from "@/store/favoritesStore"
import Image from "next/image"
import {Trash2} from "lucide-react"
import {useCartStore} from "@/store/cartStore"
import {FaRegHeart} from "react-icons/fa6"
import {useDelayedLoading} from "@/hooks/useDelayedLoading"
import {shoppingRoutes} from "@/lib/routes"
import FavoritesPageSkeleton from "../components/loading/FavoritesPageSkeleton"
import {NProgressLink} from "@/components/NProgressLink"
export default function FavoritesClientPage() {
  const {favorites, toggleFavorite} = useFavoritesStore()
  const {addToCart} = useCartStore()

  const loading = useDelayedLoading(1500)

  if (loading) {
    return <FavoritesPageSkeleton count={favorites.length || 2} />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh_-_210px)] w-full">
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 h-full text-center">
          <FaRegHeart className="text-gray-400 w-16 h-16" />
          <p className="text-gray-500 text-sm">
            No items in the favorites yet.
          </p>
          <NProgressLink
            href={shoppingRoutes.shop}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Browse Products
          </NProgressLink>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold mb-2">❤️ Favoriten</h1>
          <p className="text-gray-500 text-sm mb-6">
            Hier sind alle Produkte, die du zu deinen Favoriten hinzugefügt
            hast.
          </p>
          <div className="space-y-6">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg flex flex-col sm:flex-row gap-4"
              >
                <Image
                  src={item.images?.[0]?.url}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded object-cover border"
                />

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <NProgressLink
                        href={`/shop/${item.slug}`}
                        className="font-semibold"
                      >
                        {item.name}
                      </NProgressLink>
                      <p className="text-sm text-gray-500 line-through">
                        ${(item.price * 1.4).toFixed(2)}
                      </p>
                      <p className="text-lg text-red-600 font-bold">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleFavorite(item)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      addToCart({
                        id: `${item.id}-default`,
                        name: item.name,
                        image: item.images?.[0]?.url,
                        price: item.price,
                        slug: item.slug,
                        quantity: 1,
                      })
                    }
                    className="px-4 py-2 mt-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
                  >
                    {"Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
