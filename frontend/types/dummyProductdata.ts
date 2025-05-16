// types/product.ts
export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: string
  currency: string
  price: string
  compareAtPrice?: string
  sku: string
  quantity: string
  weight: string
  weightUnit: "kg" | "g" | "lb" | "oz"
  packages: {
    length: string
    breadth: string
    width: string
    unit: "cm" | "in" | "mm" | "m"
  }[]
  images: File[]
  primaryImage: File | null
  variants: {
    vName: string
    sku: string
    price: string
    stock: string
    attributes: Record<string, string>
  }[]
  variantFields: string[]
}
