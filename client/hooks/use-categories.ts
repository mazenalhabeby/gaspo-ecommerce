import {
  categoryClient,
  CreateCategory,
  deleteCategory,
  deleteManyCategories,
  EditCategory,
} from "@/lib/api/categories-api"
import {
  CategoriesResponseType,
  CategoryResponseType,
} from "@/lib/schema/categories.schema"
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query"
import {ZodiosError} from "@zodios/core"

export const useCategories = (): UseQueryResult<
  CategoriesResponseType[],
  ZodiosError
> => {
  return useQuery<CategoriesResponseType[], ZodiosError>({
    queryKey: ["categories"],
    queryFn: () => categoryClient.getCategories(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

export const useCategory = (
  slug: string
): UseQueryResult<CategoryResponseType, ZodiosError> => {
  return useQuery<CategoryResponseType, ZodiosError>({
    queryKey: ["categories", slug],
    queryFn: () => categoryClient.getCategoryBySlug({params: {slug}}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation<CategoryResponseType, ZodiosError, FormData>({
    mutationFn: CreateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

export const useEditCategory = (slug: string) => {
  const queryClient = useQueryClient()

  return useMutation<CategoryResponseType, ZodiosError, FormData>({
    mutationFn: (formData) => EditCategory(slug, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

export const useCategoryEditor = (slug: string) => {
  const queryClient = useQueryClient()

  const {data, isLoading, isError, error} = useCategory(slug)

  const {mutateAsync: updateCategory, isPending: isUpdating} = useMutation<
    CategoryResponseType,
    ZodiosError,
    FormData
  >({
    mutationFn: (formData) => EditCategory(slug, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })

  return {
    category: data,
    isLoading,
    isError,
    error,
    updateCategory,
    isUpdating,
  }
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

export const useDeleteManyCategories = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteManyCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

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
