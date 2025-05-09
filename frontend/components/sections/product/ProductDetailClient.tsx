"use client"

import {useState} from "react"
import {useCartStore} from "@/store/cartStore"
import {Product} from "@/data/products"
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

export default function ProductDetailClient({product}: {product: Product}) {
  const [mainImage, setMainImage] = useState(product.image)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "")
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [quantity, setQuantity] = useState(1)

  const loading = useDelayedLoading(3000)

  const router = useRouter()

  const addToCart = useCartStore((s) => s.addToCart)

  const cartItem = {
    id: `${product.id}-${selectedColor}-${selectedSize}`,
    name: `${product.name} (${selectedColor}, ${selectedSize})`,
    image: product.image,
    price: product.price,
    slug: product.slug,
    quantity,
  }

  const handleAddToCart = () => {
    addToCart(cartItem)
    toast.success(`${product.name} added to cart`, {
      description: (
        <div className="text-xs text-gray-600">
          Quantity: <strong>{quantity}</strong> — Total:{" "}
          <strong>${(product.price * quantity).toFixed(2)}</strong>
        </div>
      ),

      action: {
        label: "View cart",
        onClick: () => router.push("/cart"),
      },
    })
  }

  if (loading) {
    return <ProductDetailSkeleton />
  }

  return (
    <main className="container mx-auto flex flex-col gap-6 px-4 py-8 md:px-8 lg:px-16">
      <BreadcrumbBar product={product} />
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <RatingStars
          rating={product.rating || 0}
          count={product.reviews?.length}
          size="sm"
        />
      </div>
      <div className="flex flex-col gap-10">
        <ProductInfoSection
          product={product}
          mainImage={mainImage}
          setMainImage={setMainImage}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          quantity={quantity}
          setQuantity={setQuantity}
          handleAddToCart={handleAddToCart}
        />
        <Separator />
        <ProductDestailsSection product={product} />
        <Separator />
        <ProductReviewsSection
          reviews={product.reviews}
          rating={product.rating as number}
        />
      </div>
    </main>
  )
}
