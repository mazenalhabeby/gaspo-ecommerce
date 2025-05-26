"use client"

import ProductForm from "@/components/admin/product/form/ProductForm"
import {useCreateProduct} from "@/hooks/products/useCreateProduct"
import {useAppToast} from "@/hooks/useAppToast"
import {useRouter} from "next/navigation"

export default function Page() {
  const notify = useAppToast()
  const router = useRouter()
  const {mutateAsync: createProduct} = useCreateProduct()
  const handleAddProduct = async (data: FormData) => {
    try {
      await createProduct(data)
      notify({
        message: "Product successfully created!",
        type: "success",
      })
      router.push("/admin/products")
    } catch (error) {
      notify({
        message: (error as Error).message || "Failed to create product",
        type: "error",
      })
    }
  }

  return <ProductForm onSubmitHandler={handleAddProduct} mode="add" />
}
