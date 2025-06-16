import React from "react"
import ProductDetailSkeleton from "../components/loading/ProductDetailSkeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col gap-8 p-6">
      <div>
        <span className="text-sm text-gray-400">←</span>{" "}
        <span className="text-sm text-gray-400">Shop</span>
      </div>
      <ProductDetailSkeleton />
    </div>
  )
}
