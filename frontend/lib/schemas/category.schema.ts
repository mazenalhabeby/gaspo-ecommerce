import {z} from "zod"

export const categoryResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const categoriesResponseSchema = categoryResponseSchema.extend({
  _count: z.object({
    products: z.number(),
  }),
})

export const categoryWithProductsResponseSchema = categoryResponseSchema.extend(
  {
    products: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        price: z.number(),
        imageUrl: z.string().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
    ),
  }
)

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  image: z
    .any()
    .refine((file) => file instanceof File || file === undefined, {
      message: "Image must be a file",
    })
    .optional(),
})

export type CategoryResponse = z.infer<typeof categoryResponseSchema>
export type CategoryFormValues = z.infer<typeof categoryFormSchema>
export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>
export type CategoryWithProductsResponse = z.infer<
  typeof categoryWithProductsResponseSchema
>
