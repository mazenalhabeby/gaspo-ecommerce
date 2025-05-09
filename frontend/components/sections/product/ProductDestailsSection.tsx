import {Product} from "@/data/products"
import React from "react"

const ProductDestailsSection = ({product}: {product: Product}) => {
  return (
    <section>
      <h2 className="text-xl font-semibold">Details</h2>
      <p className="text-gray-600">{product.details}</p>
    </section>
  )
}

export default ProductDestailsSection
