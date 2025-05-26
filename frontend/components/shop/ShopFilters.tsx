"use client"

import {useRef, useState, useEffect} from "react"
import {LayoutGrid} from "lucide-react"
import {useCategories} from "@/hooks/categories/useCategories"
import Image from "next/image"

type Props = {
  selected: string
  onChange: (category: string) => void
  productCountByCategory: Record<string, number>
  compact?: boolean
}

const defaultIcon = <LayoutGrid size={22} />

export default function ShopFilters({
  selected,
  onChange,
  productCountByCategory,
  compact = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(true)

  const {data: categories = [], isLoading} = useCategories()

  const updateFade = () => {
    const el = scrollRef.current
    if (!el) return
    setShowLeftFade(el.scrollLeft > 0)
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateFade()
    el.addEventListener("scroll", updateFade)
    return () => el.removeEventListener("scroll", updateFade)
  }, [])

  return (
    <div className="relative w-full flex items-center justify-center">
      {showLeftFade && (
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      )}
      {showRightFade && (
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth px-1 transition-all"
      >
        <button
          onClick={() => onChange("All")}
          aria-pressed={selected === "All"}
          className={`flex-shrink-0 flex flex-col items-center justify-center transition-all duration-300 ${
            compact ? "w-20 h-24 text-xs" : "w-32 h-32"
          } p-3 rounded-xl border shadow-sm ${
            selected === "All"
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-800 hover:bg-gray-50"
          }`}
        >
          <div className="mb-2">{defaultIcon}</div>
          <p className="font-semibold">All</p>
          <span
            className={`text-xs ${
              selected === "All" ? "text-gray-100" : "text-gray-500"
            }`}
          >
            {Object.values(productCountByCategory).reduce((a, b) => a + b, 0)}{" "}
            items
          </span>
        </button>

        {/* Dynamic categories */}
        {!isLoading &&
          categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              aria-pressed={selected === cat.id}
              className={`flex-shrink-0 flex flex-col items-center justify-center transition-all duration-300 ${
                compact ? "w-20 h-24 text-xs" : "w-32 h-32"
              } p-3 rounded-xl border shadow-sm ${
                selected === cat.id
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="mb-2">
                <Image
                  src={cat.imageUrl || ""}
                  alt={cat.name}
                  width={100}
                  height={100}
                  className="w-10 h-10 object-cover rounded-full"
                />
              </div>
              <p className="font-semibold">{cat.name}</p>
              <span
                className={`${
                  selected === cat.id ? "text-gray-100" : "text-gray-500"
                } text-xs`}
              >
                {productCountByCategory[cat.id] || 0} items
              </span>
            </button>
          ))}
      </div>
    </div>
  )
}
