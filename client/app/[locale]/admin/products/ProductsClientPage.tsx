"use client"
import {DataTable} from "@/components/DataTable"
import {LinkButton} from "@/components/ui/link-button"
import {NoResultsTable} from "@/components/NoResultsTable"
import {Routes} from "@/lib/routes"
import {PlusCircleIcon} from "lucide-react"
import React from "react"
import {IoMdBarcode} from "react-icons/io"
import {ProductColumns} from "../components/colums/ProductColums"

export default function ProductsClientPage() {
  return (
    <React.Fragment>
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4">
              <DataTable
                columns={ProductColumns}
                data={[]}
                searchableColumns={["slug"]}
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
              />
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}
