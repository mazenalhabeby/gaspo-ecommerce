"use client"

import {useState} from "react"
import {Star} from "lucide-react"

import {motion, AnimatePresence} from "framer-motion"
import RatingStars from "@/components/RatingStars"
import {ProductDetailType} from "@/lib/schema/products.schema"

type Props = {
  reviews: ProductDetailType["reviews"]
  rating: number
}

export default function ProductReviewsSection({reviews = [], rating}: Props) {
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const reviewCount = reviews?.length

  const filteredReviews =
    filterRating !== null
      ? reviews?.filter((r) => r.rating === filterRating)
      : reviews

  const ratingCounts = [5, 4, 3, 2, 1].map((value) => ({
    value,
    count: reviews?.filter((r) => r.rating === value).length,
  }))

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Summary & Filter */}
        <div className="col-span-1 border rounded-md p-6 bg-white shadow-sm h-min">
          <RatingStars
            rating={rating}
            count={reviewCount}
            variant="summary"
            showText={false}
          />
          <p className="text-sm text-gray-500 mt-2">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </p>

          <div className="space-y-2 mt-4 text-sm text-gray-700">
            {ratingCounts.map((r) => (
              <button
                key={r.value}
                onClick={() =>
                  setFilterRating((prev) => (prev === r.value ? null : r.value))
                }
                className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded-md cursor-pointer ${
                  filterRating === r.value ? "bg-gray-100" : ""
                }`}
              >
                <span className="w-5 font-medium">{r.value}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((r.count ?? 0) / (reviewCount || 1)) * 100 || 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="w-6 text-right">{r.count}</span>
              </button>
            ))}
            {filterRating !== null && (
              <button
                onClick={() => setFilterRating(null)}
                className="text-sm text-blue-600 underline mt-2"
              >
                Show all reviews
              </button>
            )}
          </div>
        </div>

        {/* Animated Review List */}
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {filteredReviews?.map((review, i) => (
              <motion.div
                key={i}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.2, ease: "easeOut"}}
                layout
                className="border rounded-md p-4 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold">{review.userId}</p>
                  <span className="text-xs text-gray-400">Verified</span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className={
                        j < review.rating ? "text-yellow-500" : "text-gray-300"
                      }
                      fill={j < review.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredReviews?.length === 0 && (
            <motion.p
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              className="text-gray-500 text-sm"
            >
              No reviews found.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
