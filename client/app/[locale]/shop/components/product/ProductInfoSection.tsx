"use client"

import {useState} from "react"
import ProductImageGallery from "./ProductImageGallery"
import ProductInfo from "./ProductDetailsInfo"
import {ProductResponse} from "@/lib/schema/products.schema"

interface Props {
  product: ProductResponse
  attributeFields: string[]
  selectedAttributes: Record<string, string>
  setSelectedAttributes: (
    value:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void
  quantity: number
  setQuantity: (qty: number) => void
  handleAddToCart: () => void
  selectedVariant?: NonNullable<ProductResponse["variants"]>[number]
}

export default function ProductInfoSection({
  product,
  attributeFields,
  selectedAttributes,
  setSelectedAttributes,
  quantity,
  setQuantity,
  handleAddToCart,
  selectedVariant,
}: Props) {
  const [mainImage, setMainImage] = useState(product?.images?.[0]?.url)

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
      <div className="col-span-1 xl:col-span-2">
        <ProductImageGallery
          mainImage={mainImage || product.images?.[0]?.url}
          setMainImage={setMainImage}
          gallery={product.images?.map((img) => img.url)}
          productName={product.name}
        />
      </div>
      <div className="col-span-1 flex flex-col gap-10">
        <ProductInfo
          product={product}
          attributeFields={attributeFields}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
          quantity={quantity}
          setQuantity={setQuantity}
          handleAddToCart={handleAddToCart}
          selectedVariant={selectedVariant}
        />
      </div>
    </section>
  )
}
