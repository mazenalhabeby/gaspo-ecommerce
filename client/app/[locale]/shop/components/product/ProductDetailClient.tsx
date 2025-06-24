"use client"

import {useState, useMemo, useEffect} from "react"
import {useCartStore} from "@/store/cartStore"
import {toast} from "sonner"
import {useRouter} from "next/navigation"
import BreadcrumbBar from "./BreadcrumbBar"
import RatingStars from "@/components/RatingStars"
import ProductReviewsSection from "./ProductReviewsSection"
import ProductDetailsSection from "./ProductDestailsSection"
import ProductInfoSection from "./ProductInfoSection"
import {Separator} from "@/components/ui/separator"
import {Routes} from "@/lib/routes"
import {ProductDetailType} from "@/lib/schema/products.schema"
import {useTranslatedProduct} from "@/hooks/useTranslatedProduct"

type Props = {
  product: ProductDetailType
}

export default function ProductDetailClient({product}: Props) {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const addToCart = useCartStore((s) => s.addToCart)
  const {productName, productDescription, productCategoryName} =
    useTranslatedProduct(product)

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({})

  const allAttributeFields = useMemo(() => {
    const set = new Set<string>()
    product.variants?.forEach((v) =>
      v.attributes?.forEach(
        (attr) => set.add(attr.value.name) // ✅ use parsed name, not attr.name
      )
    )
    return Array.from(set)
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    return product.variants?.find((variant) =>
      variant.attributes?.every(
        (attr) => selectedAttributes[attr.value.name] === attr.value.value
      )
    )
  }, [selectedAttributes, product.variants])

  const activePrice = selectedVariant?.price || product.price
  const activeImage =
    selectedVariant?.metadata?.imageUrl || product.images?.[0]?.url

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${Object.values(selectedAttributes).join("-")}`,
      name: `${name} ${Object.entries(selectedAttributes)
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

  useEffect(() => {
    if (!product.variants?.length) return

    const initialAttributes: Record<string, string> = {}

    product.variants[0]?.attributes?.forEach((attr) => {
      if (typeof attr.value === "object") {
        initialAttributes[attr.value.name] = attr.value.value
      }
    })

    setSelectedAttributes(initialAttributes)
  }, [product.variants])

  return (
    <main className="container mx-auto flex flex-col gap-6 px-4 py-8 md:px-8 lg:px-16">
      <BreadcrumbBar name={productName as string} />
      <div>
        <h1 className="text-3xl font-bold">{productName}</h1>
        <p className="text-gray-600">{productCategoryName}</p>
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
            name: productName as string,
            description: productDescription as string,
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
        <ProductDetailsSection description={productDescription as string} />
        <Separator />
        <ProductReviewsSection reviews={product.reviews || []} rating={0} />
      </div>
    </main>
  )
}
