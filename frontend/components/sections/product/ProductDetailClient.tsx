"use client"

import {useState, useMemo} from "react"
import {useCartStore} from "@/store/cartStore"
import {Separator} from "../../ui/separator"
import {toast} from "sonner"
import {useRouter} from "next/navigation"
import ProductInfoSection from "./ProductInfoSection"
import ProductDestailsSection from "./ProductDestailsSection"
import ProductReviewsSection from "./ProductReviewsSection"
import BreadcrumbBar from "./BreadcrumbBar"
import RatingStars from "@/components/RatingStars"
import {useDelayedLoading} from "@/hooks/useDelayedLoading"
import ProductDetailSkeleton from "@/components/loading/ProductDetailSkeleton"
import {ProductWithCategory} from "@/lib/schemas/product.schema"

type Props = {
  product: ProductWithCategory
}

export default function ProductDetailClient({product}: Props) {
  const [mainImage, setMainImage] = useState(product.images?.[0]?.url || "")
  const [quantity, setQuantity] = useState(1)

  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({})

  const router = useRouter()
  const loading = useDelayedLoading(3000)
  const addToCart = useCartStore((s) => s.addToCart)

  // Get all unique attribute fields from variants
  const allAttributeFields = useMemo(() => {
    const fieldSet = new Set<string>()
    product.variants?.forEach((variant) =>
      variant.attributes?.forEach((attr) => fieldSet.add(attr.name))
    )
    return Array.from(fieldSet)
  }, [product.variants])

  // Match selected variant
  const selectedVariant = useMemo(() => {
    return product.variants?.find((variant) =>
      variant.attributes?.every(
        (attr) => selectedAttributes[attr.name] === attr.value
      )
    )
  }, [product.variants, selectedAttributes])

  const activePrice = selectedVariant?.price ?? product.price
  const activeImage =
    selectedVariant?.metadata?.imageUrl ?? product.images?.[0]?.url ?? mainImage

  const cartItem = {
    id: `${product.id}-${Object.values(selectedAttributes).join("-")}`,
    name: `${product.name} ${Object.entries(selectedAttributes)
      .map(([k, v]) => `(${k}: ${v})`)
      .join(" ")}`,
    image: activeImage,
    price: activePrice,
    slug: product.slug,
    quantity,
  }

  const handleAddToCart = () => {
    addToCart(cartItem)
    toast.success(`${product.name} added to cart`, {
      description: (
        <div className="text-xs text-gray-600">
          Quantity: <strong>{quantity}</strong> — Total:{" "}
          <strong>${(activePrice * quantity).toFixed(2)}</strong>
        </div>
      ),
      action: {
        label: "View cart",
        onClick: () => router.push("/cart"),
      },
    })
  }

  if (loading) return <ProductDetailSkeleton />

  return (
    <main className="container mx-auto flex flex-col gap-6 px-4 py-8 md:px-8 lg:px-16">
      <BreadcrumbBar product={product} />

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <RatingStars rating={0} count={0} size="sm" />
      </div>

      <div className="flex flex-col gap-10">
        <ProductInfoSection
          product={{
            ...product,
            details: product.description ?? "",
            image: product.images?.[0]?.url ?? "",
            category: product.Category?.name ?? "",
          }}
          mainImage={activeImage}
          setMainImage={setMainImage}
          quantity={quantity}
          setQuantity={setQuantity}
          selectedAttributes={selectedAttributes}
          setSelectedAttributes={setSelectedAttributes}
          attributeFields={allAttributeFields}
          handleAddToCart={handleAddToCart}
          selectedVariant={selectedVariant}
        />

        <Separator />
        <ProductDestailsSection
          product={{
            ...product,
            details: product.description ?? "",
            image: product.images?.[0]?.url ?? "",
            category: product.Category?.name ?? "",
          }}
        />
        <Separator />
        <ProductReviewsSection reviews={[]} rating={0} />
      </div>
    </main>
  )
}
