"use client"

import CreateCategoryForm from "@/components/admin/category/form/CreateCategoryForm"
import {useCreateCategory} from "@/hooks/categories/useCategories"
import {useAppToast} from "@/hooks/useAppToast"
import {useRouter} from "next/navigation"

export default function Page() {
  const notify = useAppToast()
  const router = useRouter()
  const {mutateAsync: createCategory} = useCreateCategory()
  const handleAddCategory = async (data: FormData) => {
    try {
      await createCategory(data)
      notify({
        message: "Category successfully created!",
        type: "success",
      })
      router.push("/admin/categories")
    } catch (error) {
      notify({
        message: (error as Error).message || "Failed to create category",
        type: "error",
      })
    }
  }

  return <CreateCategoryForm onSubmitHandler={handleAddCategory} mode="add" />
}
