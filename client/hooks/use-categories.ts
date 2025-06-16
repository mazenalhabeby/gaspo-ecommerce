import {
  categoryClient,
  CreateCategory,
  deleteCategory,
  deleteManyCategories,
  EditCategory,
} from "@/lib/api/categories-api"
import {
  CategoriesResponse,
  CategoryResponseType,
  CategoryResponseWithProductsType,
} from "@/lib/schema/categories.schema"
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query"
import {ZodiosError} from "@zodios/core"

/**
 * Custom React hook to fetch and cache the list of categories using React Query.
 *
 * @returns {UseQueryResult<CategoriesResponse[], ZodiosError>}
 *   The result object from React Query containing the categories data, loading and error states.
 *
 * @remarks
 * - Caches the categories data for 5 minutes (`staleTime`).
 * - Disables refetching on window focus.
 * - Retries the query once on failure.
 *
 * @example
 * const { data, isLoading, error } = useCategories();
 */
export const useCategories = (): UseQueryResult<
  CategoriesResponse[],
  ZodiosError
> => {
  return useQuery<CategoriesResponse[], ZodiosError>({
    queryKey: ["categories"],
    queryFn: () => categoryClient.getCategories(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

/**
 * Custom React hook to fetch a category by its slug using React Query.
 *
 * @param slug - The unique identifier (slug) of the category to fetch.
 * @returns The result of the query, including the category data, loading, and error states.
 *
 * @example
 * const { data, isLoading, error } = useCategory('electronics');
 */
export const useCategory = (
  slug: string
): UseQueryResult<CategoryResponseWithProductsType, ZodiosError> => {
  return useQuery<CategoryResponseWithProductsType, ZodiosError>({
    queryKey: ["categories", slug],
    queryFn: () => categoryClient.getCategoryBySlug({params: {slug}}),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

/**
 * Custom React hook to create a new category using a mutation.
 *
 * Utilizes React Query's `useMutation` to handle the creation of a category via the `CreateCategory` function.
 * On successful creation, it invalidates the "categories" query to ensure the category list is refreshed.
 *
 * @returns {UseMutationResult<CategoryResponse, ZodiosError, FormData>} The mutation object for creating a category.
 *
 * @example
 * const createCategory = useCreateCategory();
 * createCategory.mutate(formData);
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation<CategoryResponseType, ZodiosError, FormData>({
    mutationFn: CreateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

/**
 * Custom hook to handle editing a category by its slug.
 *
 * This hook returns a mutation object that can be used to submit updated category data.
 * On successful mutation, it invalidates the "categories" query to ensure fresh data is fetched.
 *
 * @param slug - The unique identifier (slug) of the category to edit.
 * @returns A mutation object from `useMutation` for editing the category.
 *
 * @example
 * const editCategory = useEditCategory('electronics');
 * editCategory.mutate(formData);
 */
export const useEditCategory = (slug: string) => {
  const queryClient = useQueryClient()

  return useMutation<CategoryResponseType, ZodiosError, FormData>({
    mutationFn: (formData) => EditCategory(slug, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

/**
 * Custom hook for managing the editing state of a category by its slug.
 *
 * @param slug - The unique identifier (slug) of the category to edit.
 * @returns An object containing:
 * - `category`: The fetched category data.
 * - `isLoading`: Whether the category data is currently loading.
 * - `isError`: Whether there was an error fetching the category data.
 * - `error`: The error object, if any occurred during fetching.
 * - `updateCategory`: Async function to update the category.
 * - `isUpdating`: Whether the category update is currently in progress.
 */
export const useCategoryEditor = (slug: string) => {
  const {data, isLoading, isError, error} = useCategory(slug)

  const {mutateAsync: updateCategory, isPending: isUpdating} =
    useEditCategory(slug)

  return {
    category: data,
    isLoading,
    isError,
    error,
    updateCategory,
    isUpdating,
  }
}

/**
 * Custom React hook to handle the deletion of a category using React Query's `useMutation`.
 *
 * This hook provides a mutation function that deletes a category and automatically
 * invalidates the "categories" query on success to ensure the UI stays in sync with the server state.
 *
 * @returns {UseMutationResult} The mutation object returned by `useMutation`, which includes methods and state for the mutation.
 *
 * @example
 * const deleteCategoryMutation = useDeleteCategory();
 * deleteCategoryMutation.mutate(categoryId);
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

/**
 * Custom hook to handle the deletion of multiple categories.
 *
 * This hook uses React Query's `useMutation` to perform the `deleteManyCategories` mutation.
 * Upon successful deletion, it invalidates the "categories" query to ensure the category list is refreshed.
 *
 * @returns {UseMutationResult} The mutation object returned by `useMutation`, which can be used to trigger the deletion and track its status.
 *
 * @example
 * const deleteMany = useDeleteManyCategories();
 * deleteMany.mutate(categoryIds);
 */
export const useDeleteManyCategories = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteManyCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

/**
 * Custom hook that provides category data along with a mutation for deleting multiple categories.
 *
 * @returns An object containing:
 * - `categories`: The list of categories fetched from the backend.
 * - `isLoading`: Boolean indicating if the categories are currently being loaded.
 * - `isError`: Boolean indicating if there was an error fetching the categories.
 * - `error`: The error object if an error occurred during fetching.
 * - `deleteMany`: Async mutation function to delete multiple categories.
 * - `isDeleting`: Boolean indicating if the delete operation is in progress.
 *
 * @example
 * const {
 *   categories,
 *   isLoading,
 *   isError,
 *   error,
 *   deleteMany,
 *   isDeleting,
 * } = useCategoriesWithDeleteManyCategories();
 */
export const useCategoriesWithDeleteManyCategories = () => {
  const {data: categories, isLoading, isError, error} = useCategories()

  const {mutateAsync: deleteMany, isPending: isDeleting} =
    useDeleteManyCategories()

  return {
    categories,
    isLoading,
    isError,
    error,
    deleteMany,
    isDeleting,
  }
}
