"use client"
import React from "react"
import CategoryForm from "../../components/forms/CategoryForm"
import {useForm} from "react-hook-form"
import {
  createCategorySchemaWithImage,
  CreateCategoryWithImageType,
} from "@/lib/schema/categories.schema"
import {zodResolver} from "@hookform/resolvers/zod"
import {useAppToast} from "@/hooks/use-app-toast"
import {useRouter} from "next/navigation"
import {useCreateCategory} from "@/hooks/use-categories"

export default function CategoriesClientCreatePage() {
  const notify = useAppToast()
  const router = useRouter()

  const {mutateAsync: createCategory, isPending} = useCreateCategory()

  const form = useForm<CreateCategoryWithImageType>({
    resolver: zodResolver(createCategorySchemaWithImage),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: undefined, // Optional field for image upload
    },
  })

  const handleAddCategory = async (data: FormData) => {
    try {
      await createCategory(data)
      notify({
        type: "success",
        message: "Category successfully created!",
      })
      router.push("/admin/categories")
    } catch (error) {
      notify({
        type: "error",
        message: (error as Error).message || "Failed to create category",
      })
    }
  }

  return (
    <CategoryForm
      onSubmitHandler={handleAddCategory}
      mode="add"
      form={form}
      isDisabled={isPending}
    />
  )
}
