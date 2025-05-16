import {Label} from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {UseFormSetValue, UseFormWatch} from "react-hook-form"
import {ProductFormType} from "@/schemas/product.schema"
import RequiredMark from "@/components/RequiredMark"

interface CategorySelectorProps {
  categories: string[]
  setValue: UseFormSetValue<ProductFormType>
  watch: UseFormWatch<ProductFormType>
}

export default function CategorySelector({
  categories,
  setValue,
  watch,
}: CategorySelectorProps) {
  const selectedCategory = watch("category")

  return (
    <div>
      <h3 className="product-info-card-title">Category</h3>
      <div className="product-info-card">
        <div className="space-y-2">
          <Label className="product-info-card-label">
            Product Category <RequiredMark style="star" />
          </Label>
          <Select
            value={selectedCategory}
            onValueChange={(val) => setValue("category", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
