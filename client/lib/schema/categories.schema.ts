import {z} from "zod"

export const categorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().optional().nullable(),
})

export const categoryResponseSchema = categorySchema.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const categoriesResponseSchema = categoryResponseSchema.extend({
  _count: z.object({
    products: z.number(),
  }),
})

export const createCategorySchema = categorySchema
  .extend({
    name: z
      .string()
      .min(2, "Name is required")
      .max(100, "Name must be less than 100 characters"),
    slug: z
      .string()
      .min(2, "Slug is required")
      .max(100, "Slug must be less than 100 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 2 characters")
      .max(500, "Description must be less than 500 characters"),
  })
  .omit({imageUrl: true, parentId: true})

export const createCategorySchemaWithImage = createCategorySchema.extend({
  image: z
    .any()
    .refine(
      (file) => file instanceof File || file === undefined,
      "Image must be a valid file"
    ),
})

export const updateCategorySchemaWithImage = createCategorySchema.extend({
  image: z.union([z.instanceof(File), z.string()]).optional(),
})

export const updateCategorySchema = categorySchema

export type CategoryType = z.infer<typeof categorySchema>
export type CategoryResponseType = z.infer<typeof categoryResponseSchema>
export type CategoriesResponseType = z.infer<typeof categoriesResponseSchema>
export type CreateCategoryType = z.infer<typeof createCategorySchema>
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>
export type CreateCategoryWithImageType = z.infer<
  typeof createCategorySchemaWithImage
>
export type UpdateCategoryWithImageType = z.infer<
  typeof updateCategorySchemaWithImage
>

export type CategoryFormValues = Partial<UpdateCategoryWithImageType> &
  CreateCategoryWithImageType
