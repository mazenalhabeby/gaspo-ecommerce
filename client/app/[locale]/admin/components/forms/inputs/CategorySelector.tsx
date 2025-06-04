import {Label} from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import RequiredMark from "@/components/RequiredMark"
import Link from "next/link"
import {PlusCircleIcon} from "lucide-react"
import {dashboardRoutes} from "@/lib/routes"
import {beautifySlug} from "@/lib/utils"
import Image from "next/image"
import {Control, useController} from "react-hook-form"
import {ProductFormValues} from "@/lib/schema/products.schema"

interface CategorySelectorProps {
  categories: {
    id: string
    slug: string
    imageUrl?: string
  }[]
  control: Control<ProductFormValues>
}

export default function CategorySelector({
  categories,
  control,
}: CategorySelectorProps) {
  const {
    field: {value, onChange},
  } = useController({
    name: "categoryId",
    control,
    defaultValue: "",
  })
  return (
    <div>
      <h3 className="info-card-title">Category</h3>
      <div className="info-card">
        <div className="space-y-2">
          <Label className="info-card-label">
            Product Category <RequiredMark style="star" />
          </Label>
          <Select value={value} onValueChange={onChange}>
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
                    <Image
                      src={cat.imageUrl!}
                      alt={beautifySlug(cat.slug)}
                      width={20}
                      height={20}
                      className=" w-6 h-6"
                    />
                    {beautifySlug(cat.slug)}
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
