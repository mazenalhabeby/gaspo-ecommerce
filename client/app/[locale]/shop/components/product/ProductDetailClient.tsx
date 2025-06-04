"use client"

import {useState, useMemo} from "react"
import {useCartStore} from "@/store/cartStore"
import {toast} from "sonner"
import {useRouter} from "next/navigation"
import {useLocale} from "next-intl"

import BreadcrumbBar from "./BreadcrumbBar"
import RatingStars from "@/components/RatingStars"
import ProductReviewsSection from "./ProductReviewsSection"
import ProductDestailsSection from "./ProductDestailsSection"
import ProductInfoSection from "./ProductInfoSection"

import {ProductResponse} from "@/lib/schema/products.schema"
import {Separator} from "@/components/ui/separator"
import {Routes} from "@/lib/routes"

type Props = {
  product: ProductResponse
}

export default function ProductDetailClient({product}: Props) {
  const [quantity, setQuantity] = useState(1)
  const locale = useLocale()
  const router = useRouter()
  const addToCart = useCartStore((s) => s.addToCart)

  const translations = product.ProductTranslations.find(
    (t) => t.language === locale
  )

  const productName = translations?.name || product.name
  const productDescription = translations?.description || product.description
  const categoryName =
    product.categories?.translations.find((t) => t.language === locale)?.name ||
    "Uncategorized"

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({})

  const allAttributeFields = useMemo(() => {
    const set = new Set<string>()
    product.variants?.forEach((v) =>
      v.attributes?.forEach((attr) => set.add(attr.name))
    )
    return Array.from(set)
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    return product.variants?.find((variant) =>
      variant.attributes?.every(
        (attr) => selectedAttributes[attr.name] === attr.value
      )
    )
  }, [selectedAttributes, product.variants])

  const activePrice = selectedVariant?.price || product.price
  const activeImage =
    selectedVariant?.metadata?.imageUrl || product.images?.[0]?.url

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${Object.values(selectedAttributes).join("-")}`,
      name: `${productName} ${Object.entries(selectedAttributes)
        .map(([, v]) => {
          try {
            const parsed = JSON.parse(v)
            return `(${parsed.value})`
          } catch {
            return `(${v})`
          }
        })
        .join(" ")}`,
      image: activeImage,
      price: activePrice,
      slug: product.slug,
      quantity,
    })

    toast.success(`${productName} added to cart`, {
      description: `Quantity: ${quantity} | Total: €${(
        activePrice * quantity
      ).toFixed(2)}`,
      action: {
        label: "View cart",
        onClick: () => router.push(Routes.shopping.cart),
      },
    })
  }

  return (
    <main className="container mx-auto flex flex-col gap-6 px-4 py-8 md:px-8 lg:px-16">
      <BreadcrumbBar name={productName} />
      <div>
        <h1 className="text-3xl font-bold">{productName}</h1>
        <p className="text-gray-600">{categoryName}</p>
        <RatingStars
          rating={
            (product.reviews?.reduce((sum, r) => sum + r.rating, 0) ?? 0) /
            ((product.reviews?.length ?? 0) || 1)
          }
          count={product.reviews?.length}
          size="sm"
        />
      </div>

      <div className="flex flex-col gap-10">
        <ProductInfoSection
          product={{
            ...product,
            name: productName,
            description: productDescription,
          }}
          quantity={quantity}
          setQuantity={setQuantity}
          attributeFields={allAttributeFields}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
          handleAddToCart={handleAddToCart}
          selectedVariant={selectedVariant}
        />
        <Separator />
        <ProductDestailsSection description={productDescription} />
        <Separator />
        <ProductReviewsSection reviews={product.reviews || []} rating={0} />
      </div>
    </main>
  )
}
