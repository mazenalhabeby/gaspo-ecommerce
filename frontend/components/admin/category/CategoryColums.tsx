/* eslint-disable @next/next/no-img-element */
"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {MoreHorizontal} from "lucide-react"
import Link from "next/link"
import {dashboardRoutes} from "@/lib/routes"
import {CategoriesResponse} from "@/lib/schemas/category.schema"

export const CategoryColumns: ColumnDef<CategoriesResponse>[] = [
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
        <Link
          href={dashboardRoutes.category(category.slug)}
          className="flex items-center gap-3"
        >
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-10 h-10 rounded-md object-cover border"
          />
          <span className="font-medium w-32 md:w-auto truncate">
            {category.name}
          </span>
        </Link>
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
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={dashboardRoutes.category(category.slug)}>
                View Category
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={dashboardRoutes.categoryEdit(category.slug)}>
                Edit Category
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => alert(`Delete: ${category.name}`)}
              className="text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
