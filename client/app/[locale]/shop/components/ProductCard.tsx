"use client"

import {motion} from "framer-motion"
import Image from "next/image"
import {shoppingRoutes} from "@/lib/routes"
import {ProductSummaryType} from "@/lib/schema/products.schema"
import {Separator} from "@/components/ui/separator"
import FavoriteButton from "@/components/FavoriteButton"
import {NProgressLink} from "@/components/NProgressLink"

type Props = {
  product: ProductSummaryType
}

export default function ProductCard({product}: Props) {
  return (
    <motion.article
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.4, ease: "easeOut"}}
      viewport={{once: true, amount: 0.2}}
      className="group border rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow drop-shadow-xl"
    >
      {/* Product Image */}
      <NProgressLink
        href={shoppingRoutes.product(product.slug)}
        aria-label={`View ${product.name}`}
        className="block overflow-hidden rounded-t-xl"
      >
        <Image
          src={product.images?.[0]?.url ?? ""}
          alt={product.name}
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
          loading="lazy"
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
      </NProgressLink>

      {/* Product Content */}
      <div className="p-4 flex flex-col justify-between min-h-[230px]">
        <header>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            <NProgressLink
              href={shoppingRoutes.product(product.slug)}
              className="hover:underline"
            >
              {product.name}
            </NProgressLink>
          </h3>
        </header>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>

        <Separator className="my-3" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-gray-900">
              {product.variants && product.variants.length > 0
                ? product.variants[1].price.toFixed(2)
                : product.price.toFixed(2)}
            </span>
            <div className="flex items-center space-x-4">
              <NProgressLink
                href={shoppingRoutes.product(product.slug)}
                className="bg-primary hover:bg-primary/90 text-white text-sm px-3 py-2 rounded"
              >
                View Product
              </NProgressLink>
              <FavoriteButton productId={product.id} product={product} />
            </div>
          </div>
          {/* <RatingStars
            rating={
              product.reviews && product.reviews.length > 0
                ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                  product.reviews.length
                : 0
            }
            count={product.reviews?.length}
            size="sm"
          /> */}
        </div>
      </div>
    </motion.article>
  )
}
