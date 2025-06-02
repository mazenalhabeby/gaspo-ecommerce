"use client"

import React from "react"
import ProductForm from "../../components/forms/ProductForm"
import {useAppToast} from "@/hooks/use-app-toast"
import {useRouter} from "next/navigation"
import {useSupportedLanguages} from "@/hooks/use-supported-languages"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {ProductCreate, productCreateSchema} from "@/lib/schema/products.schema"
import {initTranslationFieldsProducts} from "@/lib/utils"

export default function ProductClientCreatePage() {
  const notify = useAppToast()
  const router = useRouter()
  const languages = useSupportedLanguages()

  const form = useForm<ProductCreate>({
    resolver: zodResolver(productCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      currency: "USD",
      price: 0,
      stock: 0,
      weight: 0,
      metadata: {},
      categoryId: "",
      sku: "",
      seoTitle: "",
      seoDesc: "",
      weightUnit: "kg",
      images: [],
      bundles: [],
      createdById: "",
      status: "draft",

      translations: initTranslationFieldsProducts(languages),
      variantFields: [],
    },
  })

  const handleAddProduct = async (data: FormData) => {
    try {
      console.log(data)
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

  return (
    <ProductForm
      onSubmitHandler={handleAddProduct}
      form={form}
      languages={languages}
      mode="add"
    />
  )
}
