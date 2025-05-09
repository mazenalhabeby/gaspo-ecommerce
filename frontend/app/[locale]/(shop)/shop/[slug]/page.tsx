import {products} from "@/data/products"
import ProductDetailClient from "@/components/sections/product/ProductDetailClient"
import {notFound} from "next/navigation"
import {Metadata} from "next"

interface Props {
  params: {slug: string}
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug)
  if (!product) {
    return {
      title: "Product not found | GASPO",
      description: "This product does not exist or is no longer available.",
    }
  }

  return {
    title: `${product.name} | GASPO`,
    description: product.description,
  }
}

export default async function ProductDetailPage({params}: Props) {
  const {slug} = await params
  const product = products.find((product) => product.slug === slug)
  if (!product) return notFound()

  return <ProductDetailClient product={product} />
}
