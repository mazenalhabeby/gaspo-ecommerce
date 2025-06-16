import {makeApi, Zodios} from "@zodios/core"
import {
  categoriesResponseSchema,
  categoryResponseSchemaWithProducts,
} from "../schema/categories.schema"
import {z} from "zod"

export const api = makeApi([
  {
    method: "get",
    path: "/categories",
    alias: "getCategories",
    description: "Get all categories",
    response: z.array(categoriesResponseSchema),
  },
  {
    method: "get",
    path: "/categories/:slug",
    alias: "getCategoryBySlug",
    description: "Get category by slug",
    response: categoryResponseSchemaWithProducts,
  },
])

export const categoryClient = new Zodios(process.env.NEXT_PUBLIC_API_URL!, api)

export async function CreateCategory(formData: FormData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to create category")
  }

  return res.json()
}

export async function EditCategory(slug: string, formData: FormData) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`,
    {
      method: "PATCH",
      body: formData,
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to update category")
  }

  return res.json()
}

export const deleteCategory = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
    {
      method: "DELETE",
    }
  )
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to delete category")
  }
  return res.json()
}

export const deleteManyCategories = async (slugs: string[]) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({slugs}),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to delete categories")
  }
  return res.json()
}
