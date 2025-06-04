"use client"

import React from "react"
import ProductForm from "../../components/forms/ProductForm"
import {useAppToast} from "@/hooks/use-app-toast"
import {useRouter} from "next/navigation"
import {useSupportedLanguages} from "@/hooks/use-supported-languages"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {initTranslationFieldsProducts} from "@/lib/utils"
import {productCreateSchema} from "@/lib/schema/products.schema"
import {useCreateProduct} from "@/hooks/use-products"

export default function ProductClientCreatePage() {
  const notify = useAppToast()
  const router = useRouter()
  const languages = useSupportedLanguages()
  const {mutateAsync: createProduct, isPending} = useCreateProduct()

  const form = useForm({
    resolver: zodResolver(productCreateSchema),
    mode: "onChange",
    defaultValues: {
      currency: "USD",
      price: 0,
      stock: 0,
      weight: 0,
      weightUnit: "KG",
      status: "DRAFT",
      metadata: {},
      packages: [
        {
          id: crypto.randomUUID(),
          length: 0,
          breadth: 0,
          width: 0,
          unit: "in",
        },
      ],
      categoryId: "", // must match `.optional().nullable()`
      sku: null, // match .optional().nullable()
      seoTitle: null,
      seoDesc: null,
      images: [],
      bundles: [],
      createdById: null,
      ProductTranslations: initTranslationFieldsProducts(languages),
      variantFields: [],
      variants: undefined,
      bundleMetadata: undefined,
    },
  })

  const handleAddProduct = async (data: FormData) => {
    try {
      await createProduct(data)
      notify({message: "Product successfully created!", type: "success"})
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
      isDisabled={isPending}
    />
  )
}
