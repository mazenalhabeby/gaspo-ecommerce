import * as z from "zod"
import {categoryResponseSchema} from "./categories.schema"

// Enums matching your Prisma schema
export const weightUnitEnum = z.enum(["KG", "G", "LB", "OZ"])
export const productStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"])

// Package schema
export const productPackageSchema = z.object({
  id: z.string(),
  weight: z.number(),
  width: z.number(),
  breadth: z.number(),
  length: z.number(),
  unit: z.enum(["in", "mm", "m"]),
})

// Image schema
export const productImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  altText: z.string().nullable().optional(),
  position: z.number(),
})

// Variant attribute + translation
export const variantAttributeTranslationSchema = z.object({
  id: z.string(),
  language: z.string(),
  name: z.string(),
  value: z.string(),
})

export const productVariantAttributeSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string(),
  translations: z.array(variantAttributeTranslationSchema).optional(),
})

// Variant schema
export const productVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  sku: z.string(),
  price: z.number(),
  stock: z.number(),
  metadata: z.any().optional().nullable(),
  attributes: z.array(productVariantAttributeSchema).optional(),
  images: z.array(productImageSchema).optional(),
  translations: z
    .array(
      z.object({
        id: z.string(),
        language: z.string(),
        name: z.string(),
        createdAt: z.string(),
      })
    )
    .optional(),
})

// Product translation
export const productTranslationSchema = z.object({
  id: z.string(),
  productId: z.string(),
  language: z.string(),
  name: z.string(),
  description: z.string(),
  descriptionJson: z.any().nullable(),
  seoTitle: z.string().nullable(),
  seoDesc: z.string().nullable(),
  createdAt: z.string(),
})

// Full product response schema
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
  sku: z.string(),
  metadata: z.any().nullable(),
  packages: z.array(productPackageSchema).optional().nullable(),
  images: z.array(productImageSchema),
  bundleMetadata: z.any().nullable(),
  status: productStatusEnum,
  seoTitle: z.string().nullable(),
  seoDesc: z.string().nullable(),
  variantFields: z.array(z.string()),
  createdById: z.string().nullable(),
  pricingUnit: z.string().nullable(),
  categoryId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  variants: z.array(productVariantSchema).optional(),
  translations: z.array(productTranslationSchema),
  bundles: z.array(z.string()).optional(), // or use full product schema if nested
})

// Extended schema with category
export const productWithCategorySchema = productResponseSchema.extend({
  Category: categoryResponseSchema.optional(),
})

// List
export const productListResponseSchema = z.array(productResponseSchema)
