"use client"

import React from "react"
import {LiaCartPlusSolid} from "react-icons/lia"
import QuantityInput from "@/components/QuantityInput"
import RatingStars from "@/components/RatingStars"
import FavoriteButton from "@/components/FavoriteButton"
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
  selectedVariant?: NonNullable<ProductResponse["variants"]>[number]
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

      {/* Availability */}
      {/* <p
        className={`text-sm font-medium ${
          isAvailable ? "text-green-600" : "text-gray-400"
        }`}
      >
        <span
          className={`inline-block w-2 h-2 mr-2 rounded-full ${
            isAvailable ? "bg-green-600" : "bg-gray-400"
          }`}
        ></span>
        {isAvailable ? "Available now" : "Out of stock"}
      </p> */}

      {/* Variant Selection */}
      {attributeFields.map((field) => {
        const options = Array.from(
          new Set(
            product.variants
              ?.flatMap((v) =>
                v.attributes
                  ?.filter((a) => a.name === field)
                  .map((a) => a.value)
              )
              .filter(Boolean)
          )
        )

        return (
          <div key={field} className="mb-4">
            <label className="font-semibold block mb-1 capitalize">
              {(() => {
                // Try to find the attribute with this field as name
                const attr = product.variants?.[0]?.attributes?.find(
                  (a) => a.name === field
                )
                if (attr) {
                  try {
                    const parsed = JSON.parse(attr.value)
                    if (parsed && typeof parsed.name === "string") {
                      return parsed.name
                    }
                  } catch {
                    // Not a JSON string, fallback
                  }
                }
                return field
              })()}
            </label>
            <div className="flex flex-wrap gap-2">
              {Array.from(
                new Map(
                  options.map((option) => {
                    let displayValue = option
                    try {
                      const parsed = JSON.parse(option as string)
                      if (parsed && typeof parsed.value === "string") {
                        displayValue = parsed.value
                      }
                    } catch {
                      // Not a JSON string, use as is
                    }
                    return [displayValue, option] as [string, string]
                  })
                ).values()
              ).map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(field, option!)}
                  disabled={
                    !product.variants?.some(
                      (v) =>
                        v.attributes?.some(
                          (a) => a.name === field && a.value === option
                        ) && v.stock > 0
                    )
                  }
                  className={`px-4 py-1 border text-sm rounded capitalize ${
                    selectedAttributes[field] === option
                      ? "bg-primary text-white"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                  } ${
                    !product.variants?.some(
                      (v) =>
                        v.attributes?.some(
                          (a) => a.name === field && a.value === option
                        ) && v.stock > 0
                    )
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {(() => {
                    try {
                      const parsed = JSON.parse(option as string)
                      if (parsed && typeof parsed.value === "string") {
                        return parsed.value
                      }
                    } catch {
                      // Not a JSON string, use as is
                    }
                    return option
                  })()}
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
