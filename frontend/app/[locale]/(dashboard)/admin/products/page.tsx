"use client"
import {DataTable} from "@/components/admin/data-table"
import React from "react"
import {ProductColumns} from "@/components/admin/product/ProductColums"
import Link from "next/link"
import {PlusCircleIcon} from "lucide-react"
import {dashboardRoutes} from "@/lib/routes"
import {NoProductResults} from "@/components/not-found/NoResults"
import {useProducts} from "@/hooks/products/useCreateProduct"
import TablesPageSkeleton from "@/components/loading/TablesPageSkeleton"

const AddProductButton = () => {
  return (
    <Link
      href={dashboardRoutes.productCreate}
      className="w-max bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 flex flex-row py-2 md:py-1 px-3 rounded-md gap-2 items-center justify-center text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ml-2 md:ml-0"
    >
      <PlusCircleIcon className="h-4 w-4" />
      <span className="hidden md:inline-block">Add product</span>
    </Link>
  )
}

export default function Page() {
  const {data: rawProducts, isLoading} = useProducts()

  const products =
    rawProducts?.map((product) => ({
      ...product,
      imageUrl:
        product.images?.find((img) => img.position === 0)?.url ??
        product.images?.[0]?.url ?? // fallback if no position
        "", // default if no images
    })) ?? []

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
                data={products}
                searchableColumns={["name"]}
                enableRowSelection
                otherComponents={<AddProductButton />}
                noResults={<NoProductResults />}
              />
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}
