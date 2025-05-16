"use client"

import {Product} from "@/types/types"
import {dummyProducts} from "@/data/dummyProductData"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import Image from "next/image"
import {TagIcon, LayersIcon, PencilIcon} from "lucide-react"
import Link from "next/link"
import React, {use} from "react"

export default function ProductPage({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params) // ✅ Unwrap the promise using `use`

  const product: Product | undefined = dummyProducts.find((p) => p.id === id)

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <React.Fragment>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-screen-xl mx-auto p-6 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-sm text-muted-foreground">{product.slug}</p>
            </div>

            <Button
              variant="default"
              className=" bg-primary text-primary-foreground"
              asChild
            >
              <Link href={`/admin/products/${product.id}/edit`}>
                <PencilIcon className="w-4 h-4" />
                Edit
              </Link>
            </Button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="space-y-4">
                {/* Primary Image */}
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt="Primary"
                    width={800}
                    height={800}
                    className="rounded-md w-full object-cover border"
                  />
                )}

                {/* Gallery Thumbnails */}
                {(product.images?.length ?? 0) > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {product.images!.map((img, i) => (
                      <Image
                        key={i}
                        src={img.url}
                        alt={img.altText || `Image ${i + 1}`}
                        width={200}
                        height={200}
                        className="aspect-square object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Info Panels */}
            <div className="space-y-6">
              <section className="border p-4 rounded-md bg-white">
                <h2 className="text-lg font-semibold mb-2">Overview</h2>
                <p>{product.description}</p>
                <div className="mt-4 text-sm space-y-1 text-muted-foreground">
                  <p>
                    <TagIcon className="inline w-4 h-4 mr-1" />
                    SKU: {product.sku}
                  </p>
                  <p>
                    <LayersIcon className="inline w-4 h-4 mr-1" />
                    Category ID: {product.categoryId}
                  </p>
                </div>
              </section>

              <section className="border p-4 rounded-md bg-white">
                <h2 className="text-lg font-semibold mb-2">Pricing</h2>
                <div className="text-xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stock}
                </p>
              </section>

              <section className="border p-4 rounded-md bg-white">
                <h2 className="text-lg font-semibold mb-2">Metadata</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(product.metadata || {}).map(([key, val]) => (
                    <Badge key={key} variant="outline">
                      {key}: {val.toString()}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}
