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
import {useSupportedLanguages} from "@/hooks/use-supported-languages"
import {initTranslationFields} from "@/lib/utils"

export default function CategoriesClientCreatePage() {
  const notify = useAppToast()
  const router = useRouter()

  const languages = useSupportedLanguages()

  const {mutateAsync: createCategory, isPending} = useCreateCategory()

  const form = useForm<CreateCategoryWithImageType>({
    resolver: zodResolver(createCategorySchemaWithImage),
    mode: "onChange",
    defaultValues: {
      image: undefined,
      translations: initTranslationFields(languages),
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
      languages={languages}
    />
  )
}
