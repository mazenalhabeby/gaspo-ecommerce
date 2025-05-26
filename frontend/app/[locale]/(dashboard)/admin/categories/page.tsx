"use client"
import {CategoryColumns} from "@/components/admin/category/CategoryColums"
import {DataTable} from "@/components/admin/data-table"
import {NoCategoryResults} from "@/components/not-found/NoResults"
import TablesPageSkeleton from "@/components/loading/TablesPageSkeleton"
import {useCategories} from "@/hooks/categories/useCategories"
import {dashboardRoutes} from "@/lib/routes"
import {PlusCircleIcon} from "lucide-react"
import Link from "next/link"
import React from "react"

const AddCategoryButton = () => {
  return (
    <Link
      href={dashboardRoutes.categoryCreate}
      className="w-max bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 flex flex-row py-2 md:py-1 px-3 rounded-md gap-2 items-center justify-center text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ml-2 md:ml-0"
    >
      <PlusCircleIcon className="h-4 w-4" />
      <span className="hidden md:inline-block">Add category</span>
    </Link>
  )
}

export default function Page() {
  const {data: categories, isLoading} = useCategories()

  if (isLoading) {
    return <TablesPageSkeleton />
  }

  return (
    <React.Fragment>
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4">
              <DataTable
                columns={CategoryColumns}
                data={categories ?? []}
                searchableColumns={["name"]}
                enableRowSelection
                otherComponents={<AddCategoryButton />}
                noResults={<NoCategoryResults />}
              />
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}
