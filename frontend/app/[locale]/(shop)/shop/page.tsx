"use client"

import {useState, useMemo, useEffect} from "react"
import {products as allProducts} from "@/data/products"
import {useDelayedLoading} from "@/hooks/useDelayedLoading"
import HeaderSection from "@/components/sections/shop/HeaderSection"
import CategoryFiltersSection from "@/components/sections/shop/CategoryFiltersSection"
import ProductGridSection from "@/components/sections/shop/ProductGridSection"

const ITEMS_PER_PAGE = 6

export default function ShopPage() {
  const [category, setCategory] = useState("All")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [isStickySmall, setIsStickySmall] = useState(false)
  const loading = useDelayedLoading(1500)

  const filteredProducts = useMemo(() => {
    return category === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === category)
  }, [category])

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount)
  }, [filteredProducts, visibleCount])

  const canLoadMore = visibleCount < filteredProducts.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsStickySmall(window.scrollY > 150)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <main className="py-10">
      <HeaderSection />
      <CategoryFiltersSection
        category={category}
        setCategory={setCategory}
        allProducts={allProducts}
        isStickySmall={isStickySmall}
      />
      <ProductGridSection
        loading={loading}
        itemPerPage={ITEMS_PER_PAGE}
        visibleProducts={visibleProducts}
      />
      {!loading && canLoadMore && (
        <div className="text-center mt-4">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            Load More
          </button>
        </div>
      )}
    </main>
  )
}
