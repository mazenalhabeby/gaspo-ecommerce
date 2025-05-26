import {
  CategoryFormValues,
  CategoryResponse,
} from "@/lib/schemas/category.schema"

export function mapCategoryToFormValues(
  category: CategoryResponse
): CategoryFormValues {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    image: category.imageUrl || "",
  }
}

export function mapCategoryFormToFormData(data: CategoryFormValues): FormData {
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("slug", data.slug)
  if (data.description) formData.append("description", data.description)
  if (data.image) formData.append("image", data.image)
  return formData
}
