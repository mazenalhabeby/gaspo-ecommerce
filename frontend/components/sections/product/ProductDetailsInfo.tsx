"use client"

import {Product} from "@/data/products"
import RatingStars from "../../RatingStars"
import {LiaCartPlusSolid} from "react-icons/lia"
import QuantityInput from "../../QuantityInput"
import FavoriteButton from "@/components/FavoriteButton"
import React from "react"

interface ProductInfoProps {
  product: Product
  selectedColor: string
  setSelectedColor: (color: string) => void
  selectedSize: string
  setSelectedSize: (size: string) => void
  quantity: number
  setQuantity: (qty: number) => void
  handleAddToCart: () => void
}

export default function ProductInfo({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  handleAddToCart,
}: ProductInfoProps) {
  return (
    <div className="space-y-6 border p-6 rounded-lg shadow-md bg-white sticky top-28">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold leading-tight">
            {product.name}
          </h1>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <RatingStars
            rating={product.rating || 0}
            count={product.reviews?.length}
            size="md"
          />
        </div>

        {product.inStock && (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <p className="text-gray-400 line-through text-xs md:text-sm font-medium">
                ${(product.price * 1.5).toFixed(2)}
              </p>
              <span className="text-xs text-red-500 font-medium">Save 30%</span>
            </div>
            <p className="text-3xl md:text-5xl font-extrabold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p
          className={`text-sm font-medium flex flex-row items-center justify-start gap-2 ${
            product.inStock ? "text-green-600" : "text-gray-400"
          }`}
        >
          <span
            className={`${
              product.inStock ? "bg-green-600" : "bg-gray-400"
            } w-2 h-2 rounded-full`}
          ></span>
          {product.inStock ? "Available now" : "Out of stock"}
        </p>
        {(product.colors ?? []).length > 0 && (
          <div>
            <label className="font-semibold block mb-1">Color:</label>
            <div className="flex flex-wrap gap-2">
              {product.colors?.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`border rounded px-4 py-1 text-sm capitalize ${
                    selectedColor === color
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800"
                  } disabled:bg-gray-200 disabled:text-gray-400`}
                  disabled={!product.inStock}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Size */}
        {(product.sizes ?? []).length > 0 && (
          <div>
            <label className="font-semibold block mb-1">Size:</label>
            <div className="flex gap-2 flex-wrap">
              {(product.sizes ?? []).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border text-sm rounded ${
                    selectedSize === size
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-800"
                  } disabled:bg-gray-200 disabled:text-gray-400`}
                  disabled={!product.inStock}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Quantity */}
        {product.inStock && (
          <QuantityInput
            quantity={quantity}
            onChange={(newQty) => setQuantity(Math.max(1, Number(newQty)))}
          />
        )}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className=" flex flex-row items-center justify-center py-3 w-full bg-primary text-white font-medium rounded hover:bg-primary/90 transition gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {!product.inStock ? (
            <React.Fragment>
              <LiaCartPlusSolid className="text-2xl" />
              <span>Out of stock</span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <LiaCartPlusSolid className="text-2xl" />
              <span>Add to Cart</span>
            </React.Fragment>
          )}
        </button>
        <FavoriteButton product={product} productId={product.id} />
      </div>
    </div>
  )
}
