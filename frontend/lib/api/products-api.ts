import {makeApi, Zodios} from "@zodios/core"
import {
  productListResponseSchema,
  productWithCategory,
} from "../schemas/product.schema"
import {z} from "zod"

export const api = makeApi([
  {
    method: "get",
    path: "/products",
    alias: "getProducts",
    response: productListResponseSchema,
  },
  {
    method: "get",
    path: "/products/:slug",
    alias: "getProduct",
    description: "Get single product by slug",
    parameters: [
      {
        name: "slug",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: productWithCategory,
  },
])

export const productClient = new Zodios(process.env.NEXT_PUBLIC_API_URL!, api)
