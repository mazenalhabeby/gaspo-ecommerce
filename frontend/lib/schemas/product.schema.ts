// lib/schemas/product.schema.ts
import * as z from "zod"
import {categoryResponseSchema} from "./category.schema"

export const productImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  altText: z.string().nullable().optional(),
  position: z.number(),
})

export const productVariantAttributeSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string(),
})

export const productVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  sku: z.string().nullable().optional(),
  price: z.number(),
  stock: z.number(),
  metadata: z.any().optional(),
  attributes: z.array(productVariantAttributeSchema).optional(),
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
  weightUnit: z.string(),
  sku: z.string().nullable(),
  metadata: z.any().nullable(),
  packages: z.any(),
  bundleMetadata: z.any().nullable(),
  status: z.string(),
  seoTitle: z.string().nullable(),
  seoDesc: z.string().nullable(),
  variantFields: z.array(z.string()),
  createdById: z.string().nullable(),
  pricingUnit: z.string().nullable(),
  categoryId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  images: z.array(productImageSchema),
  variants: z.array(productVariantSchema).optional(),
})

export const productWithCategory = productResponseSchema.extend({
  Category: categoryResponseSchema.optional(),
})

export const productListResponseSchema = z.array(productResponseSchema)

export type ProductResponse = z.infer<typeof productResponseSchema>
export type ProductListResponse = z.infer<typeof productListResponseSchema>
export type Products = ProductResponse & {
  imageUrl: string
}
export type ProductWithCategory = z.infer<typeof productWithCategory>
