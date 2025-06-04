import {
  CreateProduct,
  deleteManyProducts,
  deleteProduct,
  EditProduct,
  productClient,
} from "@/lib/api/products-api"
import {ProductCreate, ProductResponse} from "@/lib/schema/products.schema"
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query"
import {ZodiosError} from "@zodios/core"

export const useProducts = (): UseQueryResult<
  ProductResponse[],
  ZodiosError
> => {
  return useQuery<ProductResponse[], ZodiosError>({
    queryKey: ["products"],
    queryFn: () => productClient.getProducts(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

export const useProduct = (slug: string) => {
  return useQuery<ProductResponse, ZodiosError>({
    queryKey: ["product", slug],
    queryFn: () => productClient.getProductBySlug({params: {slug}}),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation<ProductCreate, ZodiosError, FormData>({
    mutationFn: CreateProduct,
    onSuccess: () => {
      const keysToInvalidate = [["products"], ["categories"]]
      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({queryKey: key})
      })
    },
  })
}

export const useEditProduct = (slug: string) => {
  const queryClient = useQueryClient()
  return useMutation<ProductResponse, ZodiosError, FormData>({
    mutationFn: (formData) => EditProduct(slug, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["product", slug]})
      queryClient.invalidateQueries({queryKey: ["products"]})
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

export const useProductEditor = (slug: string) => {
  const {data: product, isLoading, isError, error} = useProduct(slug)

  const {mutateAsync: updateProduct, isPending: isUpdating} =
    useEditProduct(slug)
  return {product, isLoading, isError, error, updateProduct, isUpdating}
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["products"]})
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

export const useDeleteManyProducts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteManyProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["products"]})
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

export const useProductsWithDeleteManyProducts = () => {
  const {data: products, isLoading, isError, error} = useProducts()

  const {mutateAsync: deleteMany, isPending: isDeleting} =
    useDeleteManyProducts()

  return {
    products,
    isLoading,
    isError,
    error,
    deleteMany,
    isDeleting,
  }
}
