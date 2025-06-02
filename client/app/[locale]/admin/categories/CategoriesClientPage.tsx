"use client"

import {useCategoriesWithDeleteManyCategories} from "@/hooks/use-categories"
import {DataTable} from "@/components/DataTable"
import {LinkButton} from "@/components/ui/link-button"
import {NoResultsTable} from "@/components/NoResultsTable"
import {Routes} from "@/lib/routes"
import {ChartColumnStacked, PlusCircleIcon} from "lucide-react"
import {CategoryColumns} from "../components/colums/CategoryColums"
import TablesPageSkeleton from "../components/loading/TablesPageSkeleton"
import {toast} from "sonner"
import {useEffect} from "react"

export function CategoriesClientPage() {
  const {categories, isLoading, error, deleteMany, isDeleting} =
    useCategoriesWithDeleteManyCategories()

  useEffect(() => {
    if (error) {
      toast("Failed to load categories", {
        description: error.message ?? "An unexpected error occurred.",
      })
    }
  }, [error])

  if (isLoading) {
    return <TablesPageSkeleton />
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4">
            <DataTable
              columns={CategoryColumns}
              data={categories ?? []}
              searchableColumns={["slug"]}
              enableRowSelection
              otherComponents={
                <LinkButton
                  href={Routes.dashboard.categoryCreate}
                  icon={<PlusCircleIcon className="h-4 w-4" />}
                  label="Add category"
                  className="ml-2 md:ml-0"
                  variant="default"
                  size="sm"
                />
              }
              noResults={
                <NoResultsTable
                  icon={<ChartColumnStacked />}
                  title="No Categories found"
                  description="Add a new category to get started."
                />
              }
              onDelete={deleteMany}
              isDisabled={isDeleting}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
