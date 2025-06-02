"use client"
import React, {useEffect} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useRouter} from "next/navigation"

import CategoryForm from "../../../components/forms/CategoryForm"
import CategoryFormSkeleton from "../../../components/loading/CategoryFormSkeleton"

import {useAppToast} from "@/hooks/use-app-toast"
import {useSupportedLanguages} from "@/hooks/use-supported-languages"
import {useCategoryEditor} from "@/hooks/use-categories"
import {
  updateCategorySchemaWithImage,
  UpdateCategoryWithImageType,
} from "@/lib/schema/categories.schema"
import {initTranslationFields} from "@/lib/utils"

export default function CategoryClientEditPage({slug}: {slug: string}) {
  const router = useRouter()
  const notify = useAppToast()
  const languages = useSupportedLanguages()
  const {category, isLoading, updateCategory, isUpdating} =
    useCategoryEditor(slug)

  const form = useForm<UpdateCategoryWithImageType>({
    resolver: zodResolver(updateCategorySchemaWithImage),
    mode: "onChange",
    defaultValues: {
      image: undefined,
      translations: initTranslationFields(languages),
    },
  })

  const {reset} = form

  useEffect(() => {
    if (category) {
      const filledTranslations = languages.map((lang) => {
        const match = category.translations.find(
          (t) => t.language === lang.code
        )
        return {
          language: lang.code,
          name: match?.name || "",
          description: match?.description || "",
        }
      })

      reset({
        image: category.imageUrl,
        translations: filledTranslations,
      })
    }
  }, [category, languages, reset])

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
      languages={languages}
    />
  )
}
