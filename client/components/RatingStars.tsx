"use client"

import {cn} from "@/lib/utils"
import {Star} from "lucide-react"

type RatingStarsProps = {
  rating: number
  count?: number
  showText?: boolean
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "summary"
}

export default function RatingStars({
  rating,
  count,
  showText = true,
  className,
  size = "md",
  variant = "default",
}: RatingStarsProps) {
  const rounded = Math.round(rating)
  const textSize =
    size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"

  const starSize = size === "sm" ? 14 : size === "lg" ? 22 : 18

  if (variant === "summary") {
    return (
      <div className={cn("flex flex-col", className)}>
        <div className="text-4xl font-bold">{rating.toFixed(1)}</div>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={starSize}
              className={i < rounded ? "text-yellow-500" : "text-gray-300"}
              fill={i < rounded ? "currentColor" : "none"}
            />
          ))}
          {showText && count !== undefined && (
            <span className="text-sm text-gray-600 ml-2">({count})</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={starSize}
          className={i < rounded ? "text-yellow-500" : "text-gray-300"}
          fill={i < rounded ? "currentColor" : "none"}
        />
      ))}
      {showText && (
        <span className={cn("ml-2 text-gray-500", textSize)}>
          {rating.toFixed(1)} {count !== undefined && `(${count})`}
        </span>
      )}
    </div>
  )
}
