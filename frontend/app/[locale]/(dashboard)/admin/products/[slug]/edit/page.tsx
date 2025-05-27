"use client"

import {use} from "react"
import ProductForm from "@/components/admin/product/form/ProductForm"
import {Product} from "@/lib/types/types"
import {ProductResponse} from "@/lib/schemas/product.schema"
import {useProduct} from "@/hooks/products/useCreateProduct"

type ExtendedProduct = Product & {
  status?: string
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
  seoTitle?: string
  seoDescription?: string
}

function mapProductToForm(product: ExtendedProduct): ProductResponse {
  return {
    id: product.id || "",
    name: product.name,
    slug: product.slug || "",
    description: product.description || "",
    categoryId: product.categoryId || "",
    currency: "$",
    price: product.price || 0.0,
    stock: product.stock ?? 0,
    sku: product.sku || "",
    status: product.status || "draft",
    seoTitle: product.seoTitle ?? null,
    seoDesc: (product as {seoDesc?: string | null}).seoDesc ?? null,
    weight: 0,
    weightUnit: "kg",
    packages: product.packages
      ? product.packages.map((pkg, idx) => ({
          id: `pkg-${idx}`,
          weight: 0,
          length: Number(pkg.length) || 0,
          breadth: Number(pkg.breadth) || 0,
          width: Number(pkg.width) || 0,
          unit: pkg.unit,
        }))
      : [],
    images: product.images ?? [],
    variants:
      product.variants?.map((v) => ({
        id: (v as {id?: string; slug: string}).id ?? v.slug ?? "",
        name: v.slug ?? "", // or use a proper name if available
        slug: v.slug ?? "",
        sku: v.sku ?? null,
        price: v.price || 0.0,
        stock: v.stock || 0,
        metadata: undefined,
        attributes: v.attributes
          ? Object.entries(v.attributes).map(([key, value]) => ({
              id: key,
              name: key,
              value: String(value),
            }))
          : [],
      })) ?? [],
    variantFields: Object.keys(product.variants?.[0]?.attributes || {}),
    metadata: (product as {metadata?: Record<string, unknown>}).metadata || {},
    createdById: (product as {createdById?: string}).createdById ?? "",
    pricingUnit: (product as {pricingUnit?: string}).pricingUnit ?? "",
    createdAt: (product as {createdAt?: string}).createdAt ?? "",
    updatedAt: (product as {updatedAt?: string}).updatedAt ?? "",
  }
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = use(params)

  const {data: product} = useProduct(slug)

  if (!product)
    return <div className="p-6 text-red-500">❌ Product not found</div>

  const extendedProduct: ExtendedProduct = {
    ...(product as unknown as ExtendedProduct),
    imageUrl: (product as {imageUrl?: string}).imageUrl ?? "",
    images: (
      (product as {images?: {url: string; altText: string}[]}).images ?? []
    ).map((img, idx) => ({
      id: `${product.id ?? "unknown"}-img-${idx}`,
      url: img.url,
      altText: img.altText,
      position: idx,
      productId: product.id ?? "",
    })),
    packages: (product as unknown as ExtendedProduct).packages,
    variants: (product as unknown as ExtendedProduct).variants,
  }

  const productFormData = mapProductToForm(extendedProduct)

  const handleEditSubmit = async (data: FormData): Promise<void> => {
    // You may need to convert FormData to ProductResponse if needed
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
