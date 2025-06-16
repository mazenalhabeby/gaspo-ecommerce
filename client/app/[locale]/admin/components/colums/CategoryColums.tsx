"use client"
import {ColumnDef} from "@tanstack/react-table"
import {Checkbox} from "@/components/ui/checkbox"

import {dashboardRoutes} from "@/lib/routes"
import {CategoriesResponseType} from "@/lib/schema/categories.schema"
import Image from "next/image"
import {CategoryActions} from "./CategoryActions"
import {beautifySlug} from "@/lib/utils"
import {NProgressLink} from "@/components/NProgressLink"

export const CategoryColumns: ColumnDef<CategoriesResponseType>[] = [
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
    header: "Category Name",
    cell: ({row}) => {
      const category = row.original

      return (
        <NProgressLink
          href={dashboardRoutes.category(category.slug)}
          className="flex items-center gap-3"
        >
          <Image
            src={category.imageUrl as string}
            width={40}
            height={40}
            alt={category.slug}
            className="w-10 h-10 rounded-md object-cover border"
          />
          <span className="font-medium w-32 md:w-auto truncate">
            {beautifySlug(category.slug)}
          </span>
        </NProgressLink>
      )
    },
  },
  {
    accessorKey: "productsCount",
    header: "Products",
    cell: ({row}) => row.original._count?.products || 0,
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({row}) => {
      const category = row.original
      return <CategoryActions category={category} />
    },
  },
]
