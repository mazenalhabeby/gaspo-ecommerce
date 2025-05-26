// lib/api/categories-api.ts
import {z} from "zod"
import {makeApi, Zodios} from "@zodios/core"
import {
  categoriesResponseSchema,
  categoryWithProductsResponseSchema,
} from "../schemas/category.schema"

export const api = makeApi([
  {
    method: "get",
    path: "/categories",
    alias: "getCategories",
    response: z.array(categoriesResponseSchema),
  },
  {
    method: "get",
    path: "/categories/:slug",
    alias: "getCategoryBySlug",
    response: categoryWithProductsResponseSchema,
  },
])

export const categoryClient = new Zodios(process.env.NEXT_PUBLIC_API_URL!, api)
