"use client"

import React, {useEffect} from "react"
import {useRouter} from "next/navigation"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {
  productFormSchema,
  ProductFormValues,
} from "@/lib/schema/products.schema"
import {useAppToast} from "@/hooks/use-app-toast"
import {useSupportedLanguages} from "@/hooks/use-supported-languages"
import {initTranslationFieldsProducts} from "@/lib/utils"
import {useProductEditor} from "@/hooks/use-products"
import ProductForm from "../../../components/forms/ProductForm"

export default function ProductClientUpdatePage({slug}: {slug: string}) {
  const router = useRouter()
  const toast = useAppToast()
  const languages = useSupportedLanguages()

  const {product, isLoading, updateProduct, isUpdating} = useProductEditor(slug)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: "onChange",
    defaultValues: {
      currency: product?.currency ?? "",
      categoryId: product?.categories.id ?? "",
      price: 0,
      stock: 0,
      weight: 0,
      weightUnit: "KG",
      status: "DRAFT",
      metadata: {},
      packages: [],
      sku: null,
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

  // Prefill data
  useEffect(() => {
    if (!product) return

    form.reset({
      categoryId: product.categories.id ?? "",
      currency: product.currency,
      price: product.price,
      stock: product.stock,
      weight: product.weight,
      weightUnit: product.weightUnit,
      sku: product.sku ?? "",
      status: product.status,
      seoTitle: product.seoTitle ?? "",
      seoDesc: product.seoDesc ?? "",
      metadata: product.metadata ?? {},
      bundleMetadata: product.bundleMetadata ?? {},
      createdById: product.createdById ?? "",
      variantFields: product.variantFields || [],
      packages: product.packages ?? [],
      images: product.images ?? [],
      ProductTranslations: languages.map((lang) => {
        const t = product.ProductTranslations.find(
          (pt) => pt.language === lang.code
        )

        return {
          language: lang.code,
          name: t?.name || "",
          description: t?.description || "",
          seoTitle: t?.seoTitle || "",
          seoDesc: t?.seoDesc || "",
        }
      }),
      variants: (product.variants ?? []).map((variant) => ({
        ...variant,
        sku: variant.sku ?? undefined,
      })),
    })
  }, [product, form, languages])

  const handleUpdate = async (formData: FormData) => {
    try {
      await updateProduct(formData)
      toast({message: "Product updated successfully!", type: "success"})
      router.push("/admin/products")
    } catch (error) {
      toast({
        message: (error as Error).message || "Failed to update product",
        type: "error",
      })
    }
  }

  if (isLoading) return <p className="p-4 text-muted">Loading product...</p>
  if (!product) return <p className="p-4 text-red-500">Product not found</p>

  return (
    <ProductForm
      mode="edit"
      form={form}
      languages={languages}
      onSubmitHandler={handleUpdate}
      isDisabled={isUpdating}
    />
  )
}
