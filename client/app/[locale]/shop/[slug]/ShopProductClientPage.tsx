"use client"

import {useProduct} from "@/hooks/use-products"

import React from "react"
import ProductDetailClient from "../components/product/ProductDetailClient"
import ProductDetailSkeleton from "../components/loading/ProductDetailSkeleton"

export default function ShopProductClientPage({slug}: {slug: string}) {
  const {data: product, isLoading} = useProduct(slug)

  if (isLoading) {
    return <ProductDetailSkeleton />
  }
  if (!product) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">Product not found</p>
      </div>
    )
  }

  return <ProductDetailClient product={product} />
}
