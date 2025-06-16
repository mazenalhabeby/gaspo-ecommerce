"use client"

import React from "react"
import {LiaCartPlusSolid} from "react-icons/lia"
import QuantityInput from "@/components/QuantityInput"
import RatingStars from "@/components/RatingStars"
import FavoriteButton from "@/components/FavoriteButton"
import {ProductDetailType} from "@/lib/schema/products.schema"

interface Props {
  product: ProductDetailType
  attributeFields: string[]
  selectedAttributes: Record<string, string>
  setSelectedAttributes: (
    value:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>)
  ) => void
  quantity: number
  setQuantity: (qty: number) => void
  selectedVariant?: NonNullable<ProductDetailType["variants"]>[number]
  handleAddToCart: () => void
}

export default function ProductInfo({
  product,
  attributeFields,
  selectedAttributes,
  setSelectedAttributes,
  quantity,
  setQuantity,
  selectedVariant,
  handleAddToCart,
}: Props) {
  const handleSelect = (field: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const price = selectedVariant?.price ?? product.price
  const stock = selectedVariant?.stock ?? product.stock
  const isAvailable = stock > 0

  return (
    <div className="space-y-6 border p-6 rounded-lg shadow-md bg-white sticky top-28">
      {/* Title + Price */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-bold">{product.name}</h1>
          <RatingStars
            rating={
              (product.reviews ?? []).reduce((sum, r) => sum + r.rating, 0) /
              ((product.reviews ?? []).length || 1)
            }
            count={product.reviews?.length}
            size="md"
          />
        </div>
        <div className="text-3xl font-extrabold text-primary">
          €{price.toFixed(2)}
        </div>
      </div>

      {/* Variant Selection */}
      {attributeFields.map((field) => {
        const options = Array.from(
          new Map(
            product.variants
              ?.flatMap((v) =>
                v.attributes
                  ?.filter((a) => a.value.name === field)
                  .map((a) => a.value)
              )
              .map((val) => [val.value, val]) // Map key = "Natural", value = object
          ).values()
        )

        return (
          <div key={field} className="mb-4">
            <label className="font-semibold block mb-1 capitalize">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={`${field}-${option.value}`}
                  onClick={() => handleSelect(field, option.value)}
                  disabled={
                    !product.variants?.some(
                      (v) =>
                        v.attributes?.some(
                          (a) =>
                            a.value.name === field &&
                            a.value.value === option.value
                        ) && v.stock > 0
                    )
                  }
                  className={`px-4 py-1 border text-sm rounded capitalize ${
                    selectedAttributes[field] === option.value
                      ? "bg-primary text-white"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                  } ${
                    !product.variants?.some(
                      (v) =>
                        v.attributes?.some(
                          (a) =>
                            a.value.name === field &&
                            a.value.value === option.value
                        ) && v.stock > 0
                    )
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {option.value}
                </button>
              ))}
            </div>
          </div>
        )
      })}

      {/* Quantity */}
      {isAvailable && (
        <QuantityInput
          quantity={quantity}
          onChange={(qty) => setQuantity(Math.max(1, Number(qty)))}
        />
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable || price <= 0}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded hover:bg-primary/90 transition disabled:bg-gray-200 disabled:text-gray-400"
        >
          <LiaCartPlusSolid className="text-2xl" />
          <span>{isAvailable ? "Add to Cart" : "Out of Stock"}</span>
        </button>
        <FavoriteButton product={product} productId={product.id} />
      </div>
    </div>
  )
}
