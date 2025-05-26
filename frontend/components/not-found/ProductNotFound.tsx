import {dashboardRoutes} from "@/lib/routes"
import Link from "next/link"
import {IoMdBarcode} from "react-icons/io"

const ProductNotFound = ({slug}: {slug: string}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
      <IoMdBarcode className="w-6 h-6" />
      <div className="text-base font-semibold">
        Product not found for slug: &quot;
        {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        &quot;
      </div>
      <Link href={dashboardRoutes.products} className="text-sm text-primary">
        Back to Products
      </Link>
    </div>
  )
}

export default ProductNotFound
