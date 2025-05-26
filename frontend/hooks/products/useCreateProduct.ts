import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import type {ZodiosError} from "@zodios/core"
import {
  ProductListResponse,
  ProductResponse,
  ProductWithCategory,
} from "@/lib/schemas/product.schema"
import {uploadProduct} from "@/lib/api/upload"
import {productClient} from "@/lib/api/products-api"

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation<ProductResponse, ZodiosError, FormData>({
    mutationFn: uploadProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["products"]})
      queryClient.invalidateQueries({queryKey: ["categories"]})
    },
  })
}

export const useProducts = () => {
  return useQuery<ProductListResponse>({
    queryKey: ["products"],
    queryFn: () => productClient.getProducts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export const useProduct = (slug: string) => {
  return useQuery<ProductWithCategory, ZodiosError>({
    queryKey: ["product", slug],
    queryFn: () => productClient.getProduct({params: {slug}}),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  })
}
