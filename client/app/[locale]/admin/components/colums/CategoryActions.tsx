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
import {useDeleteCategory} from "@/hooks/use-categories"
import {CategoriesResponseType} from "@/lib/schema/categories.schema"
import {DeleteButton} from "@/components/DeleteButton"
import {toast} from "sonner"
import {beautifySlug} from "@/lib/utils"
import {NProgressLink} from "@/components/NProgressLink"

type Props = {
  category: CategoriesResponseType
}

export function CategoryActions({category}: Props) {
  const {mutateAsync: deleteCategory} = useDeleteCategory()

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting category...")
    try {
      await deleteCategory(category.id)
      toast.success(
        `Category "${beautifySlug(category.slug)}" deleted successfully`,
        {
          id: toastId,
        }
      )
    } catch (error) {
      toast.error(`Failed to delete "${beautifySlug(category.slug)}"`, {
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
          <NProgressLink href={dashboardRoutes.category(category.slug)}>
            View Category
          </NProgressLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NProgressLink href={dashboardRoutes.categoryEdit(category.slug)}>
            Edit Category
          </NProgressLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
          <DeleteButton
            onDelete={handleDelete}
            variant="ghost"
            confirmText={category.slug}
            message={`Are you sure you want to delete the category "${beautifySlug(
              category.slug
            )}"?\n   type "${category.slug}" to confirm.`}
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
