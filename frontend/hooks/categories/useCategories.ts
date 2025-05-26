import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query"
import {categoryClient} from "@/lib/api/categories-api"
import {ZodiosError} from "@zodios/core"
import {uploadCategory, uploadEditCategory} from "@/lib/api/upload"
import {
  CategoriesResponse,
  CategoryResponse,
} from "@/lib/schemas/category.schema"

export const useCategories = (): UseQueryResult<
  CategoriesResponse[],
  ZodiosError
> => {
  return useQuery<
    CategoriesResponse[],
    ZodiosError,
    CategoriesResponse[],
    ["categories"]
  >({
    queryKey: ["categories"],
    queryFn: () => categoryClient.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

export const useCategory = (slug: string) => {
  return useQuery<CategoryResponse, ZodiosError>({
    queryKey: ["categories", slug],
    queryFn: () => categoryClient.getCategoryBySlug({params: {slug}}),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation<CategoryResponse, ZodiosError, FormData>({
    mutationFn: uploadCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

export const useEditCategory = (slug: string) => {
  const queryClient = useQueryClient()

  return useMutation<CategoryResponse, ZodiosError, FormData>({
    mutationFn: (formData) => uploadEditCategory(slug, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}
