"use client"

import ProductForm from "@/components/admin/product/product-form/ProductForm"
import {ProductFormType} from "@/schemas/product.schema"

// async function simulateDelay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }

export default function AddProductPage() {
  const handleAddProduct = (data: ProductFormType) => {
    // Here you would typically send the data to your API to create a new product
    console.log("Product data submitted:", data)
    // You can also show a success message or redirect the user after submission
  }

  return <ProductForm onSubmitHandler={handleAddProduct} mode="add" />
}
