export type SectionType = "general" | "images" | "variants" | "discounts"

export interface ProductSection {
  id: string
  type: SectionType
}
