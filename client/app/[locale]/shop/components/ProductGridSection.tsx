'"use client"'
import React from "react"

import ProductCard from "./ProductCard"
import {ProductSummaryType} from "@/lib/schema/products.schema"

interface ProductGridSectionProps {
  visibleProducts: ProductSummaryType[]
}

const ProductGridSection: React.FC<ProductGridSectionProps> = ({
  visibleProducts,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {visibleProducts.map((product: ProductSummaryType, index: number) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductGridSection
