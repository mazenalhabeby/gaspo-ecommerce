import {ChartColumnStacked} from "lucide-react"
import {IoMdBarcode} from "react-icons/io"

export const NoProductResults = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
      <IoMdBarcode className="text-2xl" />
      <div className=" text-base font-semibold">No products found</div>
      <div className=" text-sm">Add a new product to get started.</div>
    </div>
  )
}

export const NoCategoryResults = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
      <ChartColumnStacked className="w-6 h-6" />
      <div className="text-base font-semibold">No Categories found</div>
      <div className="text-sm">Add a new category to get started.</div>
    </div>
  )
}
