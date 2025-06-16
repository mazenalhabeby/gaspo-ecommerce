"use client"

import {useProduct} from "@/hooks/use-products"

import React from "react"
import ProductDetailClient from "../components/product/ProductDetailClient"
import ProductDetailSkeleton from "../components/loading/ProductDetailSkeleton"
import {NProgressLink} from "@/components/NProgressLink"

export default function ShopProductClientPage({slug}: {slug: string}) {
  const {data: product, isLoading} = useProduct(slug)

  if (isLoading) {
    return <ProductDetailSkeleton />
  }
  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-semibold mb-2">
          Woops, cannot find that product
        </h2>
        <p className="text-gray-500 mb-4">
          It looks like this item doesn’t exist or has been removed.
        </p>
        <NProgressLink href="/shop">
          <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
            Back to Shop
          </button>
        </NProgressLink>
      </main>
    )
  }

  return <ProductDetailClient product={product} />
}
