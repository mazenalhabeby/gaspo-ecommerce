"use client"

import {useState, useMemo, useEffect} from "react"
import {useProducts} from "@/hooks/use-products"
import HeaderSection from "./components/HeaderSection"
import CategoryFiltersSection from "./components/CategoryFiltersSection"
import ProductGridSection from "./components/ProductGridSection"
import Image from "next/image"
import {logo} from "@/assets"
import ProductCardSkeleton from "./components/loading/ProductCardSkeleton"

const ITEMS_PER_PAGE = 6

export default function ShopClientPage() {
  const [category, setCategory] = useState("All")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [mounted, setMounted] = useState(false)

  const {data: products, isLoading} = useProducts()

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredProducts = useMemo(() => {
    return category === "All"
      ? products
      : products?.items.filter((p) => p.categoryId === category)
  }, [category, products])

  const visibleProducts = useMemo(() => {
    if (Array.isArray(filteredProducts)) {
      return filteredProducts.slice(0, visibleCount)
    } else if (filteredProducts && Array.isArray(filteredProducts.items)) {
      return filteredProducts.items.slice(0, visibleCount)
    }
    return []
  }, [filteredProducts, visibleCount])

  const canLoadMore =
    visibleCount <
    (Array.isArray(filteredProducts)
      ? filteredProducts.length
      : filteredProducts && Array.isArray(filteredProducts.items)
      ? filteredProducts.items.length
      : 0)

  return (
    <main className="py-10">
      <HeaderSection />
      <CategoryFiltersSection
        category={category}
        setCategory={setCategory}
        allProducts={products?.items ?? []}
        isStickySmall={false}
      />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4">
        {isLoading || !mounted ? (
          <div className="flex flex-row flex-wrap items-start gap-6">
            {Array.from({length: ITEMS_PER_PAGE}).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products && products.items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-2 py-10">
            <Image
              src={logo}
              alt="No products found"
              width={120}
              height={120}
              className="opacity-50 grayscale"
              priority
            />
            <p className="text-gray-500 font-semibold">No products found.</p>
          </div>
        ) : (
          <>
            <ProductGridSection visibleProducts={visibleProducts ?? []} />
            {canLoadMore && (
              <div className="text-center mt-4">
                <button
                  onClick={() =>
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                  }
                  className="px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
