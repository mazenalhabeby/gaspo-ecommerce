"use client"
import React, {useEffect} from "react"
import CategoryForm from "../../../components/forms/CategoryForm"
import {useForm} from "react-hook-form"
import {useAppToast} from "@/hooks/use-app-toast"
import {useRouter} from "next/navigation"
import {
  updateCategorySchemaWithImage,
  UpdateCategoryWithImageType,
} from "@/lib/schema/categories.schema"
import {zodResolver} from "@hookform/resolvers/zod"
import {useCategoryEditor} from "@/hooks/use-categories"
import CategoryFormSkeleton from "../../../components/loading/CategoryFormSkeleton"

export default function CategoryClientEditPage({slug}: {slug: string}) {
  const {category, isLoading, updateCategory, isUpdating} =
    useCategoryEditor(slug)

  const notify = useAppToast()
  const router = useRouter()

  const form = useForm<UpdateCategoryWithImageType>({
    resolver: zodResolver(updateCategorySchemaWithImage),
    mode: "onChange",
  })

  const {reset} = form
  useEffect(() => {
    if (category) {
      reset({
        name: category.name ?? "",
        slug: category.slug ?? "",
        description: category.description ?? "",
        image: category.imageUrl ?? "",
      })
    }
  }, [category, reset])

  if (isLoading) {
    return <CategoryFormSkeleton />
  }

  const handleUpdateCategory = async (data: FormData) => {
    try {
      await updateCategory(data)
      notify({
        type: "success",
        message: "Category successfully updated!",
      })
      router.push("/admin/categories")
    } catch (error) {
      notify({
        type: "error",
        message: (error as Error).message || "Failed to update category",
      })
    }
  }

  return (
    <CategoryForm
      onSubmitHandler={handleUpdateCategory}
      mode="edit"
      form={form}
      isDisabled={isUpdating}
    />
  )
}
