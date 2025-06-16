import {z} from "zod"

export const translationSchema = z.object({
  language: z.string(),
  name: z.string(),
  description: z.string(),
})

export const createTranslationSchema = translationSchema.extend({
  name: z
    .string()
    .min(2, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be less than 500 characters"),
})

export const categorySchema = z.object({
  slug: z.string(),
  translations: z.array(translationSchema),
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
    translations: z
      .array(createTranslationSchema)
      .min(1, "At least one language is required"),
  })
  .omit({imageUrl: true, parentId: true, slug: true})

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
