import ShopFilters from "@/components/shop/ShopFilters"
import {Separator} from "@/components/ui/separator"
import {Product} from "@/data/products"

interface CategoryFiltersSectionProps {
  category: string
  setCategory: (category: string) => void
  allProducts: Product[]
  isStickySmall: boolean
}

const CategoryFiltersSection = ({
  category,
  setCategory,
  allProducts,
  isStickySmall,
}: CategoryFiltersSectionProps) => {
  return (
    <section
      aria-labelledby="category-heading"
      className="mb-10 z-30 bg-white/60 py-4 transition-transform duration-300 ease-in-out will-change-transform h-auto backdrop-blur-2xl "
    >
      <div className="max-w-7xl mx-auto flex items-center gap-4 mb-4 px-1">
        <Separator className="flex-1" />
        <h2 id="category-heading" className="text-lg font-semibold capitalize">
          Categories
        </h2>
        <Separator className="flex-1" />
      </div>

      <ShopFilters
        selected={category}
        onChange={setCategory}
        products={allProducts}
        compact={isStickySmall}
      />
    </section>
  )
}

export default CategoryFiltersSection
