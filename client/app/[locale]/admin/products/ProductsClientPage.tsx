"use client"
import {DataTable} from "@/components/DataTable"
import {LinkButton} from "@/components/ui/link-button"
import {NoResultsTable} from "@/components/NoResultsTable"
import {Routes} from "@/lib/routes"
import {PlusCircleIcon} from "lucide-react"
import React, {useEffect} from "react"
import {IoMdBarcode} from "react-icons/io"
import {ProductColumns} from "../components/colums/ProductColums"
import {useProductsWithDeleteManyProducts} from "@/hooks/use-products"
import TablesPageSkeleton from "../components/loading/TablesPageSkeleton"
import {toast} from "sonner"

export default function ProductsClientPage() {
  const {products, isLoading, error, deleteMany, isDeleting} =
    useProductsWithDeleteManyProducts()

  useEffect(() => {
    if (error) {
      toast("Failed to load products", {
        description: error.message ?? "An unexpected error occurred.",
      })
    }
  }, [error])

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
                columns={ProductColumns}
                data={products ?? []}
                searchableColumns={["name"]}
                enableRowSelection
                otherComponents={
                  <LinkButton
                    href={Routes.dashboard.productCreate}
                    icon={<PlusCircleIcon className="h-4 w-4" />}
                    label="Add product"
                    className="ml-2 md:ml-0"
                    variant="default"
                    size="sm"
                  />
                }
                noResults={
                  <NoResultsTable
                    icon={<IoMdBarcode />}
                    title="No Products found"
                    description="Add a new product to get started."
                  />
                }
                onDelete={deleteMany}
                isDisabled={isDeleting}
              />
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}
