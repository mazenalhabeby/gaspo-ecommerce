import {z} from "zod"
import {
  packageSchema,
  productStatusEnum,
  weightUnitEnum,
} from "./products.schema"

/**
 * Schema for validating translation response objects.
 *
 * Represents a translation of a category, including its language, name, and description.
 *
 * @property id - Unique identifier for the translation.
 * @property categoryId - Identifier of the associated category.
 * @property language - Language code of the translation (e.g., 'en', 'fr').
 * @property name - Translated name of the category.
 * @property description - Translated description of the category.
 */
export const translationResponseSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  language: z.string(),
  name: z.string(),
  description: z.string(),
})
export type TranslationResponseType = z.infer<typeof translationResponseSchema>

/**
 * Schema for validating translation objects.
 *
 * This schema ensures that a translation contains:
 * - `language`: A string representing the language code, with a minimum length of 2 and a maximum of 5 characters.
 * - `name`: A string representing the translated name, with a minimum length of 2 and a maximum of 100 characters.
 * - `description`: A string representing the translated description, with a minimum length of 20 and a maximum of 500 characters.
 *
 * Validation error messages are provided for each constraint.
 */
const translationSchema = z.object({
  language: z
    .string()
    .min(2, "Language code must be at least 2 characters")
    .max(5, "Language code must be at most 5 characters"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be less than 500 characters"),
})
export type TranslationType = z.infer<typeof translationSchema>

/**
 * Schema for creating a new category.
 *
 * This schema validates the structure of the data required to create a category.
 *
 * Fields:
 * - `parentId` (optional): The CUID of the parent category, or null if this is a root category.
 * - `translations`: An array of translation objects (see `translationSchema`), must contain at least one translation (including English).
 * - `imageUrl` (optional): A valid URL string for the category image.
 *
 * Validation:
 * - `parentId` must be a valid CUID if provided, or null.
 * - `translations` must be a non-empty array of valid translation objects.
 * - `imageUrl` must be a valid URL if provided.
 */
export const createCategorySchema = z.object({
  parentId: z
    .string()
    .cuid("parentId must be a valid CUID")
    .nullable()
    .optional(),
  translations: z
    .array(translationSchema)
    .min(1, "At least one translation (including English) is required"),
  imageUrl: z.string().url("imageUrl must be a valid URL").optional(),
})

export type CreateCategoryType = z.infer<typeof createCategorySchema>

/**
 * Extends the `createCategorySchema` to include an optional `image` field.
 *
 * The `image` field accepts any value, but is validated to ensure that it is either
 * an instance of `File` or `undefined`. If the value does not meet this criteria,
 * a validation error with the message "Image must be a valid file" is thrown.
 *
 * @remarks
 * This schema is useful for category creation forms where an image upload is optional.
 *
 * @example
 * Valid usage with a File object
 * const file = new File([""], "image.png");
 * createCategorySchemaWithImage.parse({ name: "Category", image: file });
 *
 * Valid usage without an image
 * createCategorySchemaWithImage.parse({ name: "Category" });
 *
 * Invalid usage (throws validation error)
 * createCategorySchemaWithImage.parse({ name: "Category", image: "not-a-file" });
 */
export const createCategorySchemaWithImage = createCategorySchema.extend({
  image: z
    .any()
    .refine(
      (file) => file instanceof File || file === undefined,
      "Image must be a valid file"
    ),
})

export type CreateCategoryWithImageType = z.infer<
  typeof createCategorySchemaWithImage
>

/**
 * Schema for updating a category.
 *
 * This schema is a partial version of `createCategorySchema`, allowing for
 * optional fields when updating an existing category. It can be used to validate
 * update payloads where not all fields are required.
 */
export const updateCategorySchema = createCategorySchema.partial()
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>

/**
 * Schema for updating a category, allowing an optional image field.
 * The image can be either a File instance (for uploads) or a string (such as a URL or base64 representation).
 * Extends the base `createCategorySchema` with the additional `image` property.
 */
export const updateCategorySchemaWithImage = createCategorySchema.extend({
  image: z.union([z.instanceof(File), z.string()]).optional(),
})

export type UpdateCategoryWithImageType = z.infer<
  typeof updateCategorySchemaWithImage
>

/**
 * Schema for deleting categories by their slugs.
 *
 * This schema validates an array of slugs to ensure that at least one slug is provided
 * and that each slug is a non-empty string.
 */
export const deleteCategoriesSchema = z.object({
  slugs: z
    .array(z.string().nonempty("Each slug must be a nonempty string"))
    .min(1, "At least one slug is required"),
})
export type DeleteCategoriesDto = z.infer<typeof deleteCategoriesSchema>

/**
 * Schema for validating the response object of a category.
 *
 * Fields:
 * - `id`: Unique identifier of the category.
 * - `slug`: URL-friendly string representing the category.
 * - `name`: Name of the category.
 * - `imageUrl`: Optional URL of the category's image. Can be null or omitted.
 * - `parentId`: Optional identifier of the parent category. Can be null or omitted.
 * - `createdAt`: Date when the category was created.
 * - `updatedAt`: Date when the category was last updated.
 * - `translations`: Array of translation objects for the category.
 * - `_count`: Object containing the count of related products.
 */
export const categoryResponseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  imageUrl: z.string().url().nullable().optional(),
  parentId: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  translations: z.array(translationResponseSchema),
  _count: z.object({products: z.number()}),
})
export type CategoryResponseType = z.infer<typeof categoryResponseSchema>

/**
 * Schema for a category response that includes an array of associated products.
 *
 * This schema is based on `categoryResponseSchema`, omitting the `_count` and `name` fields,
 * and extending it with a `products` field. Each product in the `products` array contains
 * detailed information such as identifiers, pricing, stock, metadata, SEO fields, and more.
 *
 * @remarks
 * - The `products` array contains objects with fields like `id`, `name`, `slug`, `description`,
 *   `currency`, `price`, `stock`, `weight`, `weightUnit`, `sku`, `metadata`, `packages`,
 *   `categoryId`, `bundleMetadata`, `status`, `seoTitle`, `seoDesc`, `variantFields`,
 *   `createdById`, `pricingUnit`, `createdAt`, and `updatedAt`.
 * - Some fields are nullable or optional as indicated.
 * - The `weightUnit` and `status` fields are enums.
 * - The `packages` field is an optional array of `packageSchema`.
 */
export const categoryResponseSchemaWithProducts = categoryResponseSchema
  .omit({
    _count: true,
    name: true,
  })
  .extend({
    products: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string(),
        currency: z.string(),
        price: z.number(),
        stock: z.number(),
        weight: z.number(),
        weightUnit: weightUnitEnum,
        sku: z.string().nullable(),
        metadata: z.any().nullable(),
        packages: z.array(packageSchema).optional(),
        categoryId: z.string(),
        bundleMetadata: z.any().nullable(),
        status: productStatusEnum,
        seoTitle: z.string().nullable(),
        seoDesc: z.string().nullable(),
        variantFields: z.array(z.string()),
        createdById: z.string().nullable(),
        pricingUnit: z.string().nullable(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
      })
    ),
  })

export type CategoryResponseWithProductsType = z.infer<
  typeof categoryResponseSchemaWithProducts
>

/**
 * Schema representing the response structure for multiple categories.
 *
 * This schema is based on the `categoryResponseSchema` and is used to validate
 * or type-check API responses that return a list or collection of categories.
 *
 * @see categoryResponseSchema
 */
export const categoriesResponseSchema = categoryResponseSchema
export type CategoriesResponseType = z.infer<typeof categoriesResponseSchema>

/**
 * Represents the form values for a category, combining both creation and update types.
 *
 * This type merges all properties from `CreateCategoryWithImageType` (required)
 * with the optional properties from `UpdateCategoryWithImageType` (using `Partial`).
 * It is typically used to type the values of a category form that can handle both
 * creating a new category and updating an existing one, including image data.
 *
 * @see CreateCategoryWithImageType
 * @see UpdateCategoryWithImageType
 */
export type CategoryFormValues = Partial<UpdateCategoryWithImageType> &
  CreateCategoryWithImageType
