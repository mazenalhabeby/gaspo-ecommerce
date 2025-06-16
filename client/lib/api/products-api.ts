import {makeApi, Zodios} from "@zodios/core"
import {
  productDetailSchema,
  productsListSchema,
} from "../schema/products.schema"
import {z} from "zod"

export const api = makeApi([
  {
    method: "get",
    path: "/products",
    alias: "getProducts",
    description: "Get all products",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "pageSize",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "categoryId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "status",
        type: "Query",
        schema: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
      },
    ],
    response: productsListSchema,
  },
  {
    method: "get",
    path: "/products/:slug",
    alias: "getProductBySlug",
    description: "Get product by slug",
    response: productDetailSchema,
  },
])

export const productClient = new Zodios(process.env.NEXT_PUBLIC_API_URL!, api)

export async function CreateProduct(formData: FormData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to create product")
  }

  return res.json()
}

export async function EditProduct(slug: string, formData: FormData) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
    {
      method: "PATCH",
      body: formData,
    }
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to update product")
  }

  return res.json()
}

export const deleteProduct = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to delete product")
  }
  return res.json()
}

export const deleteManyProducts = async (slugs: string[]) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({slugs}),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Failed to delete products ")
  }
  return res.json()
}
