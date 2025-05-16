"use client"

import {use} from "react"
import {ProductFormType} from "@/schemas/product.schema"
import ProductForm from "@/components/admin/product/product-form/ProductForm"
import {Product} from "@/types/types"
import {products} from "@/lib/dummyProductData"

type ExtendedProduct = Product & {
  images?: {url: string; altText: string}[]
  packages?: {
    length: string
    breadth: string
    width: string
    unit: "in" | "mm" | "m"
  }[]
  variants?: {
    slug: string
    sku: string
    price: number
    stock: number
    attributes?: Record<string, string>
  }[]
}

function mapProductToForm(product: ExtendedProduct): ProductFormType {
  return {
    name: product.name,
    slug: product.slug || "",
    description: product.description || "",
    category: product.categoryId || "",
    currency: "$",
    price: product.price?.toString() || "0.00",
    sku: product.sku || "",
    quantity: product.stock?.toString() || "0",
    weight: "0",
    weightUnit: "kg",
    packages: product.packages ?? [
      {length: "", breadth: "", width: "", unit: "in"},
    ],
    images: product.images ?? [],
    primaryImage: product.images?.[0] ?? null,
    variants:
      product.variants?.map((v) => ({
        id: (v as {id?: string; slug: string}).id ?? v.slug ?? "",
        vName: "", // if needed, populate
        sku: v.sku,
        price: v.price.toString(),
        stock: v.stock.toString(),
        attributes: v.attributes ?? {},
      })) ?? [],
    variantFields: Object.keys(product.variants?.[0]?.attributes || {}),
  }
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{id: string}>
}) {
  const {id} = use(params)

  const product = products.find((p) => p.id === id)

  if (!product)
    return <div className="p-6 text-red-500">❌ Product not found</div>

  const extendedProduct: ExtendedProduct = {
    ...product,
    images: (product as ExtendedProduct).images ?? [],
    packages: (product as ExtendedProduct).packages,
    variants: (product as ExtendedProduct).variants,
  }

  const productFormData = mapProductToForm(extendedProduct)

  const handleEditSubmit = (data: ProductFormType) => {
    console.log("✏️ Edited product data:", data)
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit: {product.name}</h1>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <ProductForm
        mode="edit"
        initialData={productFormData}
        onSubmitHandler={handleEditSubmit}
      />
    </main>
  )
}
