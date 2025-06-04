import {z} from "zod"
import {categoryResponseSchema} from "./categories.schema"

// enums (reuse these if defined elsewhere)
export const weightUnitEnum = z.enum(["KG", "G", "LB", "OZ"])
export const productStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"])

export const productReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string(),
  rating: z.number(),
  title: z.string().nullable(),
  comment: z.string().nullable(),
  isVerified: z.boolean(),
  isApproved: z.boolean(),
  createdAt: z.string(),
})

// schema for related models
export const productImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  altText: z.string().nullable().optional(),
  position: z.number(),
})

const packageSchema = z.object({
  id: z.string(),
  length: z.number(),
  breadth: z.number(),
  width: z.number(),
  unit: z.enum(["in", "mm", "m"]),
})

export const productVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  sku: z.string().nullable(),
  price: z.number(),
  stock: z.number(),
  metadata: z.any().nullable(),
  attributes: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  images: z.array(productImageSchema).optional(),
})

export const productTranslationSchema = z.object({
  id: z.string(),
  productId: z.string(),
  language: z.string(),
  name: z.string(),
  description: z.string(),
  seoTitle: z.string().nullable(),
  seoDesc: z.string().nullable(),
  descriptionJson: z.any().nullable(),
  createdAt: z.string(),
})

export const productResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  currency: z.string(),
  price: z.number(),
  stock: z.number(),
  weight: z.number(),
  weightUnit: weightUnitEnum,
  sku: z.string().optional().nullable(),
  metadata: z.any().nullable(),
  packages: z.array(packageSchema).optional(),
  images: z.array(productImageSchema),
  bundleMetadata: z.any().nullable(),
  status: productStatusEnum,
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
  variantFields: z.array(z.string()),
  createdById: z.string().optional().nullable(),
  pricingUnit: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  reviews: z.array(productReviewSchema).optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  categories: categoryResponseSchema.optional(),
  variants: z.array(productVariantSchema).optional(),
  ProductTranslations: z.array(productTranslationSchema), // alternative if not renamed
  bundles: z.array(z.string()).optional(),
})

export type ProductResponse = z.infer<typeof productResponseSchema>

// schema for creating/updating products

export const translationSchema = z.object({
  language: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
  descriptionJson: z.any().optional().nullable(),
})

export const productCreateSchema = z.object({
  currency: z.string().min(1),
  price: z.number().optional().nullable(),
  stock: z.number().optional().nullable(),
  weight: z.number().min(0),
  metadata: z.any().optional(),
  packages: z.array(packageSchema).optional(),
  categoryId: z.string(),
  sku: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
  weightUnit: weightUnitEnum,
  images: z.array(z.any()).optional(),
  bundles: z.array(z.string()).optional(),
  createdById: z.string().optional().nullable(),
  status: productStatusEnum,
  ProductTranslations: z.array(translationSchema),
  variantFields: z.array(z.string()).optional(),
  variants: z.any().optional(),
  bundleMetadata: z.any().optional(),
})

export const productUpdateSchema = productCreateSchema

export type ProductCreate = z.infer<typeof productCreateSchema>
export type ProductUpdate = z.infer<typeof productUpdateSchema>

export type ProductFormValues = Partial<ProductUpdate> & ProductCreate
