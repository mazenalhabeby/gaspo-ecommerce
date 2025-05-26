"use client"

import {useState, useMemo, useEffect} from "react"
import {useProducts} from "@/hooks/products/useCreateProduct"
import HeaderSection from "@/components/sections/shop/HeaderSection"
import CategoryFiltersSection from "@/components/sections/shop/CategoryFiltersSection"
import ProductGridSection from "@/components/sections/shop/ProductGridSection"

const ITEMS_PER_PAGE = 6

export default function ShopPage() {
  const [category, setCategory] = useState("All")
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isStickySmall, setIsStickySmall] = useState(false)

  // Get products from backend
  const {data: rawProducts, isLoading} = useProducts()

  // Normalize products with fallback image
  const products = useMemo(
    () =>
      rawProducts?.map((product) => ({
        ...product,
        imageUrl:
          product.images?.find((img) => img.position === 0)?.url ??
          product.images?.[0]?.url ??
          "",
        details: product.description ?? "", // fallback if missing
        image: product.images?.[0]?.url ?? "", // fallback if missing
        category: product.categoryId ?? "", // fallback if missing
      })) ?? [],
    [rawProducts]
  )

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    return category === "All"
      ? products
      : products.filter((p) => p.categoryId === category)
  }, [category, products])

  // Paginate visible products
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
        allProducts={products}
        isStickySmall={false}
      />
      <ProductGridSection
        loading={isLoading}
        itemPerPage={ITEMS_PER_PAGE}
        visibleProducts={visibleProducts}
      />
      {!isLoading && canLoadMore && (
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
