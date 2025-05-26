"use client"

import Link from "next/link"
import {motion} from "framer-motion"
import Image from "next/image"
import {Product} from "@/data/products"
import {Separator} from "../../ui/separator"
import RatingStars from "../../RatingStars"
import FavoriteButton from "../../FavoriteButton"
import {shoppingRoutes} from "@/lib/routes"

type Props = {
  product: Product
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
      <Link
        href={shoppingRoutes.product(product.slug)}
        aria-label={`View ${product.name}`}
        className="block overflow-hidden rounded-t-xl"
      >
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
          loading="lazy"
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
      </Link>

      {/* Product Content */}
      <div className="p-4 flex flex-col justify-between min-h-[230px]">
        <header>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            <Link
              href={shoppingRoutes.product(product.slug)}
              className="hover:underline"
            >
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </header>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>

        <Separator className="my-3" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center space-x-4">
              <Link
                href={shoppingRoutes.product(product.slug)}
                className="bg-primary hover:bg-primary/90 text-white text-sm px-3 py-2 rounded"
              >
                View Product
              </Link>
              <FavoriteButton productId={product.id} product={product} />
            </div>
          </div>
          <RatingStars
            rating={product.rating || 0}
            count={product.reviews?.length}
            size="sm"
          />
        </div>
      </div>
    </motion.article>
  )
}
