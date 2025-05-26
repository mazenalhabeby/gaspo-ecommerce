"use client"

import {use} from "react"
import {useCategory, useEditCategory} from "@/hooks/categories/useCategories"
import CreateCategoryForm from "@/components/admin/category/form/CreateCategoryForm"
import {mapCategoryToFormValues} from "@/lib/mappers/category.mapper"
import {CategoryFormValues} from "@/lib/schemas/category.schema"
import CategoryFormSkeleton from "@/components/loading/category/CategoryFormSkeleton"
import CategoryNotFound from "@/components/not-found/CategoryNotFound"
import {useAppToast} from "@/hooks/useAppToast"
import {useRouter} from "next/navigation"

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = use(params)

  const {data: category, isLoading} = useCategory(slug)

  const {mutateAsync: editCategory} = useEditCategory(slug || "")

  const notify = useAppToast()

  const router = useRouter()

  if (isLoading) return <CategoryFormSkeleton />

  if (!category) {
    return <CategoryNotFound slug={slug} />
  }

  const initialData: CategoryFormValues = mapCategoryToFormValues(category)

  const handleSubmit = async (formData: FormData) => {
    try {
      await editCategory(formData)
      notify({type: "success", message: "Category updated successfully!"})
      router.push("/admin/categories")
    } catch (error) {
      notify({
        type: "error",
        message: (error as Error)?.message || "Failed to update category",
      })
    }
  }

  return (
    <CreateCategoryForm
      initialData={initialData}
      onSubmitHandler={handleSubmit}
      mode="edit"
    />
  )
}
