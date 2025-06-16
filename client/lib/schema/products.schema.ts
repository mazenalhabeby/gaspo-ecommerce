// lib/schema/products.schema.ts
import {z} from "zod"

//
// ─── 1) ENUMS & SHARED ───────────────────────────────────────────────────────────
//

// weight units used in your DB:
export const weightUnitEnum = z.enum(["KG", "G", "LB", "OZ"])
export type WeightUnit = z.infer<typeof weightUnitEnum>

// product status in your DB:
export const productStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
export type ProductStatus = z.infer<typeof productStatusEnum>

// units for your package dimensions
export const dimensionUnitEnum = z.enum(["in", "mm", "m", "cm", "ft"])
export type DimensionUnit = z.infer<typeof dimensionUnitEnum>

//
// ─── 2) PACKAGES & IMAGES ────────────────────────────────────────────────────────
//

// how you store dimension packages in the DB
export const packageSchema = z.object({
  id: z.string(),
  length: z.number(),
  breadth: z.number(),
  width: z.number(),
  unit: dimensionUnitEnum,
})
export type Package = z.infer<typeof packageSchema>

// full image object (used in detail view):
export const productImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  position: z.number(),
  altText: z.string().nullable().optional(),
})
export type ProductImage = z.infer<typeof productImageSchema>

// summary image (only show url on list):
export const productImageSummarySchema = z.object({
  url: z.string().url(),
})
export type ProductImageSummary = z.infer<typeof productImageSummarySchema>

//
// ─── 3) VARIANTS ────────────────────────────────────────────────────────────────
//

// extra attributes on a variant
export const variantAttributeSchema = z.object({
  id: z.string(),
  name: z.string(), // this is the field index (e.g. "0", "1")
  value: z.string().transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val)
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        typeof parsed.name === "string" &&
        typeof parsed.value === "string"
      ) {
        return parsed
      }
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid attribute value format",
      })
      return z.NEVER
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid JSON string in attribute.value",
      })
      return z.NEVER
    }
  }),
})

export type VariantAttribute = z.infer<typeof variantAttributeSchema>

// translations for a given variant
export const productVariantTranslationSchema = z.object({
  id: z.string(),
  variantId: z.string(),
  language: z.string(),
  name: z.string(),
})
export type ProductVariantTranslation = z.infer<
  typeof productVariantTranslationSchema
>

// complete variant in detail endpoint
export const productVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  sku: z.string().nullable(),
  price: z.number(),
  stock: z.number(),
  metadata: z.any().nullable(),
  attributes: z.array(variantAttributeSchema).optional(),
  translations: z.array(productVariantTranslationSchema),
})
export type ProductVariant = z.infer<typeof productVariantSchema>

//
// ─── 4) TRANSLATIONS & REVIEWS ───────────────────────────────────────────────────
//

// name/description per language for the product itself
export const productTranslationSchema = z.object({
  id: z.string(),
  productId: z.string(),
  language: z.string(),
  name: z.string(),
  description: z.string(),
  seoTitle: z.string().nullable(),
  seoDesc: z.string().nullable(),
  descriptionJson: z.any().nullable(),
  createdAt: z.coerce.date(),
})
export type ProductTranslation = z.infer<typeof productTranslationSchema>

// user reviews attached to product
export const productReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string(),
  rating: z.number(),
  title: z.string().nullable(),
  comment: z.string().nullable(),
  isVerified: z.boolean(),
  isApproved: z.boolean(),
  createdAt: z.coerce.date(),
})
export type ProductReview = z.infer<typeof productReviewSchema>

//
// ─── 5) CATEGORY MINI (for detail) ──────────────────────────────────────────────
export const categoryMiniSchema = z.object({
  id: z.string(),
  slug: z.string(),
  translations: z.array(
    z.object({
      language: z.string(),
      name: z.string(),
      description: z.string().nullable().optional(),
    })
  ),
})
export type CategoryMini = z.infer<typeof categoryMiniSchema>

//
// ─── 6) PRODUCT SUMMARY & LIST META ─────────────────────────────────────────────
//

export const productSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  status: productStatusEnum,
  currency: z.string(),
  categoryId: z.string(),
  images: z.array(productImageSummarySchema).optional(),
  variants: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string().optional(),
      sku: z.string().optional(),
      price: z.number(),
      stock: z.number(),
      metadata: z.any().optional(),
      attributes: z.array(variantAttributeSchema).optional(),
    })
  ),
})
export type ProductSummaryType = z.infer<typeof productSummarySchema>

export const productsListSchema = z.object({
  items: z.array(productSummarySchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
})
export type ProductsListType = z.infer<typeof productsListSchema>

//
// ─── 7) PRODUCT DETAIL (findOne) ───────────────────────────────────────────────
//

export const productDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  seoTitle: z.string().nullable(),
  seoDesc: z.string().nullable(),

  currency: z.string(),
  price: z.number(),
  stock: z.number(),

  weight: z.number(),
  weightUnit: weightUnitEnum,

  sku: z.string().nullable(),
  metadata: z.any().nullable(),
  packages: z.array(packageSchema).optional(),
  variantFields: z.array(z.string()).optional(),
  bundleMetadata: z.any().nullable(),

  status: productStatusEnum,
  pricingUnit: z.string().nullable(),
  createdById: z.string().nullable(),

  images: z.array(productImageSchema),
  variants: z.array(productVariantSchema),
  ProductTranslations: z.array(productTranslationSchema),

  categories: categoryMiniSchema,
  reviews: z.array(productReviewSchema),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type ProductDetailType = z.infer<typeof productDetailSchema>

//
// ─── 8) CREATE / UPDATE DTOs ────────────────────────────────────────────────────
//

export const productCreateSchema = z.object({
  name: z.string().optional().nullable(),
  slug: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),

  categoryId: z.string(),
  currency: z.string().min(1),
  price: z.number().optional().nullable(),
  stock: z.number().optional().nullable(),

  weight: z.number().min(0),
  weightUnit: weightUnitEnum,

  sku: z.string().optional().nullable(),
  metadata: z.any().optional(),
  packages: z.array(packageSchema).optional(),
  variantFields: z.array(z.string()).optional(),
  bundleMetadata: z.any().optional(),

  status: productStatusEnum,
  pricingUnit: z.string().optional().nullable(),
  createdById: z.string().optional().nullable(),

  ProductTranslations: z
    .array(
      z.object({
        language: z.string(),
        name: z.string().min(1),
        description: z.string().min(1),
        seoTitle: z.string().optional().nullable(),
        seoDesc: z.string().optional().nullable(),
        descriptionJson: z.any().optional().nullable(),
      })
    )
    .min(1),

  variants: z
    .array(
      z.object({
        name: z.string(),
        slug: z.string().optional(),
        sku: z.string().optional(),
        price: z.number(),
        stock: z.number(),
        metadata: z.any().optional(),
        attributes: z
          .array(
            z.object({
              name: z.string(),
              value: z.string(),
            })
          )
          .optional(),
        ProductTranslations: z
          .array(
            z.object({
              language: z.string(),
              name: z.string(),
            })
          )
          .optional(),
      })
    )
    .optional(),

  images: z.array(
    z.union([
      z.instanceof(File),
      z.object({
        id: z.string(),
        url: z.string().url(),
        position: z.number(),
        altText: z.string().nullable().optional(),
      }),
    ])
  ),
  bundles: z.array(z.string()).optional(),
})
export type ProductCreate = z.infer<typeof productCreateSchema>

export const productUpdateSchema = productCreateSchema
  .partial()
  .omit({images: true})
  .extend({
    images: z.array(z.union([z.instanceof(File), productImageSchema])),
  })
export type ProductUpdate = z.infer<typeof productUpdateSchema>

export type ProductFormValues = Omit<ProductCreate, "images"> & {
  images: (File | ProductImage)[]
}

export const productFormSchema: z.ZodType<ProductFormValues> =
  productCreateSchema.omit({images: true}).extend({
    images: z.array(z.union([z.instanceof(File), productImageSchema])),
  })
