import {useMemo, useRef, useState, useEffect} from "react"
import {Product} from "@/data/products"
import {LayoutGrid, LampDesk, Building2, Boxes} from "lucide-react"

type Props = {
  selected: string
  onChange: (category: string) => void
  products: Product[]
  compact?: boolean
}

const categoryIcons = {
  All: <LayoutGrid size={22} />,
  Furniture: <Building2 size={22} />,
  Office: <LayoutGrid size={22} />,
  Lighting: <LampDesk size={22} />,
  Storage: <Boxes size={22} />,
}

export default function ShopFilters({
  selected,
  onChange,
  products,
  compact = false,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(true)

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

  const categories = useMemo(() => {
    const grouped: Record<string, {description: string; count: number}> = {}
    products.forEach((p) => {
      if (!grouped[p.category]) {
        grouped[p.category] = {
          description: p.description.slice(0, 40) + "...",
          count: 1,
        }
      } else {
        grouped[p.category].count++
      }
    })

    return [
      {name: "All", description: "All products", count: products.length},
      ...Object.entries(grouped).map(([name, data]) => ({name, ...data})),
    ]
  }, [products])

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
        {categories.map(({name, count}) => {
          const isSelected = selected === name
          const Icon =
            categoryIcons[name as keyof typeof categoryIcons] ||
            categoryIcons.All

          return (
            <button
              key={name}
              onClick={() => onChange(name)}
              aria-pressed={isSelected}
              className={`flex-shrink-0 flex flex-col items-center justify-center transition-all duration-300 ${
                compact ? "w-20 h-24 text-xs" : "w-32 h-32"
              } p-3 rounded-xl border shadow-sm ${
                isSelected
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="mb-2">{Icon}</div>
              <p className="font-semibold">{name}</p>
              <span
                className={`${
                  isSelected ? "text-gray-100" : "text-gray-500"
                }  text-xs`}
              >
                {count} items
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
