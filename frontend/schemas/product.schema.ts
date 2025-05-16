import * as z from "zod"

export const unitTypes = ["in", "mm", "m"] as const
export type UnitType = (typeof unitTypes)[number]

export const productSchema = z.object({
  name: z.string().min(8, "Product name is required"),
  slug: z
    .string()
    .min(8, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and hyphen-separated"
    ),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long")
    .max(1000, "Description is too long"),
  category: z.string().min(1, "Category is required"),
  currency: z.string(),
  price: z.string().min(1, "Price is required"),
  sku: z.string().min(3, "SKU is required"),
  quantity: z.string().min(1, "Quantity is required"),
  weight: z.string().min(1, "Weight is required"),
  weightUnit: z.enum(["kg", "g", "lb", "oz"]),
  packages: z
    .array(
      z.object({
        length: z.string(),
        breadth: z.string(),
        width: z.string(),
        unit: z.enum(["in", "mm", "m"]),
      })
    )
    .min(1),
  images: z
    .array(z.any()) // type: File[]
    .min(2, "You must upload at least 2 images"),
  primaryImage: z.any().nullable(),
  variantFields: z.array(z.string()),
  variants: z.array(
    z.object({
      id: z.string().uuid(),
      vName: z.string().optional(),
      sku: z.string().optional(),
      price: z.string().optional(),
      stock: z.string().optional(),
      attributes: z.record(z.string()),
    })
  ),
})

export type ProductFormType = z.infer<typeof productSchema>
