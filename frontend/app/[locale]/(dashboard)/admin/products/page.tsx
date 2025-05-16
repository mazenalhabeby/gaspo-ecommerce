import {DataTable} from "@/components/admin/data-table"
import React from "react"
import {dummyProducts} from "@/data/dummyProductData"
import {ProductColumns} from "@/components/admin/product/ProductColums"
import Link from "next/link"
import {PlusCircleIcon} from "lucide-react"
import {IoMdBarcode} from "react-icons/io"

const AddProductButton = () => {
  return (
    <Link
      href={"/admin/products/create"}
      className="w-max bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 flex flex-row py-2 md:py-1 px-3 rounded-md gap-2 items-center justify-center text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ml-2 md:ml-0"
    >
      <PlusCircleIcon className="h-4 w-4" />
      <span className="hidden md:inline-block">Add product</span>
    </Link>
  )
}

const NoResults = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
      <IoMdBarcode className="text-2xl" />
      <div className=" text-base font-semibold">No products found</div>
      <div className=" text-sm">Add a new product to get started.</div>
    </div>
  )
}

export default function Page() {
  return (
    <React.Fragment>
      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4">
              <DataTable
                columns={ProductColumns}
                data={dummyProducts}
                searchableColumns={["name"]}
                enableRowSelection
                otherComponents={<AddProductButton />}
                noResults={<NoResults />}
              />
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}
