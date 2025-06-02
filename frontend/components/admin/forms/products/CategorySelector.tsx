import {Label} from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {UseFormSetValue, UseFormWatch} from "react-hook-form"
import {ProductResponse} from "@/lib/schemas/product.schema"
import RequiredMark from "@/components/RequiredMark"
import Link from "next/link"
import {PlusCircleIcon} from "lucide-react"
import {dashboardRoutes} from "@/lib/routes"

interface CategorySelectorProps {
  categories: {
    id: string
    name: string
  }[]
  setValue: UseFormSetValue<ProductResponse>
  watch: UseFormWatch<ProductResponse>
}

export default function CategorySelector({
  categories,
  setValue,
  watch,
}: CategorySelectorProps) {
  return (
    <div>
      <h3 className="product-info-card-title">Category</h3>
      <div className="product-info-card">
        <div className="space-y-2">
          <Label className="product-info-card-label">
            Product Category <RequiredMark style="star" />
          </Label>
          <Select
            value={watch("categoryId") ?? undefined}
            onValueChange={(val) => setValue("categoryId", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No categories found.
                </div>
              ) : (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))
              )}
              <Link
                href={dashboardRoutes.categoryCreate}
                className="flex flex-row items-center justify-start gap-2 w-full text-primary text-sm hover:bg-gray-100 p-2"
              >
                <PlusCircleIcon className="h-4 w-4" />
                <span>Create new category</span>
              </Link>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
