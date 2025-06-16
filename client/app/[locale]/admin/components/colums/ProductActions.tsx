"use client"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {MoreHorizontal} from "lucide-react"
import {dashboardRoutes} from "@/lib/routes"

import {DeleteButton} from "@/components/DeleteButton"
import {toast} from "sonner"
import {beautifySlug} from "@/lib/utils"
import {useDeleteProduct} from "@/hooks/use-products"
import {NProgressLink} from "@/components/NProgressLink"
import {ProductSummaryType} from "@/lib/schema/products.schema"

type Props = {
  product: ProductSummaryType
}

export function ProductActions({product}: Props) {
  const {mutateAsync: deleteProduct} = useDeleteProduct()

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting product...")
    try {
      await deleteProduct(product.id)
      toast.success(
        `Product "${beautifySlug(product.slug)}" deleted successfully`,
        {
          id: toastId,
        }
      )
    } catch (error) {
      toast.error(`Failed to delete "${beautifySlug(product.slug)}"`, {
        id: toastId,
        description: (error as Error).message || "Something went wrong",
      })
    }
  }

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
          <NProgressLink href={dashboardRoutes.product(product.slug)}>
            View Product
          </NProgressLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NProgressLink href={dashboardRoutes.productEdit(product.slug)}>
            Edit Product
          </NProgressLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <DeleteButton
            onDelete={handleDelete}
            variant="ghost"
            confirmText={product.slug}
            message={`Are you sure you want to delete the product "${beautifySlug(
              product.slug
            )}"?\n   type "${product.slug}" to confirm.`}
            className=" border-0 hover:border-0 focus:border-0 ring-0 focus:ring-0 text-red-500 hover:bg-transparent focus:bg-transparent hover:text-red-600 focus:text-red-600 cursor-pointer"
            type="button"
          >
            Delete
          </DeleteButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
