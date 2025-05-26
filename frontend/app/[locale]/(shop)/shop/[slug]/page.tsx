"use client"

import ProductDetailClient from "@/components/sections/product/ProductDetailClient"

import React, {use} from "react"
import {useProduct} from "@/hooks/products/useCreateProduct"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = use(params)
  const {data: product, isLoading} = useProduct(slug)

  if (isLoading) {
    return <div>Loading...</div>
  }
  return <ProductDetailClient product={product} />
}
