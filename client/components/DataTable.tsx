"use client"

import React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type VisibilityState,
  type SortingState,
  type ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  Trash2Icon,
} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {cn} from "@/lib/utils"
import {DeleteButton} from "./DeleteButton"
import {UseMutateAsyncFunction} from "@tanstack/react-query"
import {toast} from "sonner"

interface DataTableProps<TData extends {slug: string}, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount?: number
  pageIndex?: number // zero-based
  pageSize?: number
  onPageChange?: (newPageIndex: number) => void
  onPageSizeChange?: (newPageSize: number) => void
  enableColumnToggle?: boolean
  enableRowSelection?: boolean
  searchableColumns?: (keyof TData)[]
  otherComponents?: React.ReactNode
  noResults?: React.ReactNode
  onDelete?: UseMutateAsyncFunction<unknown, Error, string[], unknown>
  isDisabled?: boolean
}

export function DataTable<TData extends {slug: string}, TValue>({
  columns,
  data,
  pageCount,
  pageIndex = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  enableColumnToggle = true,
  enableRowSelection = true,
  searchableColumns = [],
  otherComponents,
  noResults,
  onDelete,
  isDisabled = false,
}: DataTableProps<TData, TValue>) {
  // internal state for uncontrolled mode:
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })
  const [rowSelection, setRowSelection] = React.useState({})

  // are we in controlled/server mode?
  const isControlled =
    pageCount !== undefined && onPageChange && onPageSizeChange

  // merge internal vs external pagination
  const tablePagination = isControlled ? {pageIndex, pageSize} : pagination
  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.slug,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination: tablePagination,
      rowSelection,
    },
    enableRowSelection,
    manualPagination: !!isControlled,
    pageCount: isControlled ? pageCount : undefined,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: (updater) =>
      setRowSelection((old) =>
        typeof updater === "function" ? updater(old) : updater
      ),

    // pagination callback:
    onPaginationChange: (updater) => {
      if (isControlled) {
        const next =
          typeof updater === "function"
            ? updater({pageIndex, pageSize})
            : updater
        onPageChange(next.pageIndex)
        onPageSizeChange(next.pageSize)
      } else {
        const next =
          typeof updater === "function" ? updater(pagination) : updater
        setPagination(next)
      }
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const handleSearch = (value: string) => {
    if (searchableColumns.length === 0) return
    table.setColumnFilters(
      searchableColumns.map((key) => ({
        id: key as string,
        value,
      }))
    )
  }

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const selectedIds = selectedRows.map((row) => row.original.slug)

  const handleDelete = async () => {
    if (!onDelete) return
    try {
      await onDelete(selectedIds)
      toast.success(`${selectedIds.length} items deleted successfully`)
    } catch (error) {
      toast.error(`Failed to delete items: ${(error as Error).message}`)
    }
  }

  const currentPageIndex = isControlled
    ? pageIndex
    : table.getState().pagination.pageIndex

  const totalPageCount = isControlled ? pageCount! : table.getPageCount()

  return (
    <div className="relative space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder={`Search by ${searchableColumns.join(",")}`}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-xs"
        />
        <div className="flex items-center gap-2">
          {otherComponents}
          {enableColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ColumnsIcon className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((c) => c.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row: Row<TData>) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Page {currentPageIndex + 1} of {totalPageCount}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={currentPageIndex === 0}
          >
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={currentPageIndex === 0}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={currentPageIndex + 1 === totalPageCount}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={currentPageIndex + 1 === totalPageCount}
          >
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Floating bar when items selected */}
      <div
        className={cn(
          "fixed bottom-4 left-1/2 z-50 w-full max-w-max -translate-x-1/2 transform transition-all duration-300",
          selectedRows.length === 0
            ? "opacity-0 pointer-events-none translate-y-10"
            : "opacity-100"
        )}
      >
        <div className="flex items-center justify-center gap-12 rounded-lg border bg-background p-4 shadow-lg">
          <span className="text-sm font-medium">
            {selectedRows.length} selected
          </span>
          <DeleteButton
            variant="destructive"
            disabled={isDisabled}
            onDelete={handleDelete}
          >
            {!isDisabled ? (
              <React.Fragment>
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete Selected
              </React.Fragment>
            ) : (
              "Deleting..."
            )}
          </DeleteButton>
        </div>
      </div>
    </div>
  )
}
