// lib/hooks/useTranslatedProduct.ts
import {useLocale} from "next-intl"
import {
  ProductDetailType,
  ProductSummaryType,
} from "@/lib/schema/products.schema"

export function useTranslatedProduct(
  product: ProductDetailType | ProductSummaryType
) {
  const locale = useLocale()

  const translation = product?.ProductTranslations?.find(
    (t) => t.language === locale
  )

  const name = translation?.name || product?.name
  const description = translation?.description || product?.description

  const categoryName =
    product?.categories?.translations.find((t) => t.language === locale)
      ?.name || "Uncategorized"

  return {
    productName: name,
    productDescription: description,
    productCategoryName: categoryName,
  }
}
