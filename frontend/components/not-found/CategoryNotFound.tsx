import {dashboardRoutes} from "@/lib/routes"
import {ChartColumnStacked} from "lucide-react"
import Link from "next/link"

const CategoryNotFound = ({slug}: {slug: string}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
      <ChartColumnStacked className="w-6 h-6" />
      <div className="text-base font-semibold">
        Category not found for slug: &quot;
        {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        &quot;
      </div>
      <Link href={dashboardRoutes.categories} className="text-sm text-primary">
        Back to Categories
      </Link>
    </div>
  )
}

export default CategoryNotFound
