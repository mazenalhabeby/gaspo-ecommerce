/* eslint-disable @next/next/no-img-element */
"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Checkbox} from "@/components/ui/checkbox"
import Link from "next/link"
import {dashboardRoutes} from "@/lib/routes"
import {ProductResponse} from "@/lib/schema/products.schema"
import {ProductActions} from "./ProductActions"

export const ProductColumns: ColumnDef<ProductResponse>[] = [
  {
    id: "select",
    header: ({table}) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({row}) => {
      const product = row.original
      return (
        <Link
          href={dashboardRoutes.product(product.slug)}
          className="flex items-center gap-3"
        >
          <img
            src={product.images[0]?.url || "/placeholder.png"}
            alt={product.name}
            className="w-10 h-10 rounded-md object-cover border"
          />
          <span className="font-medium w-32 md:w-auto truncate">
            {product.name}
          </span>
        </Link>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({row}) =>
      `${row.original.currency} ${row.original.price.toFixed(2)}`,
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({row}) => {
      const product = row.original
      return <ProductActions product={product} />
    },
  },
]
