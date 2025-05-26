import {logo} from "@/assets/images"
import ProductCardSkeleton from "@/components/loading/ProductCardSkeleton"
import ProductCard from "@/components/sections/shop/ProductCard"
import {Product} from "@/data/products"
import Image from "next/image"
import React from "react"

interface ProductGridSectionProps {
  loading: boolean
  itemPerPage: number
  visibleProducts: Product[]
}

const ProductGridSection: React.FC<ProductGridSectionProps> = ({
  loading,
  itemPerPage,
  visibleProducts,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {loading ? (
          Array.from({length: itemPerPage}).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : visibleProducts.length > 0 ? (
          visibleProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
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
        )}
      </div>
    </section>
  )
}

export default ProductGridSection
