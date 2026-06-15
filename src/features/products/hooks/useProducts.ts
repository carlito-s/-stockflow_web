import { useQuery } from "@tanstack/react-query"
import api from "@/config/api"
import type { ApiResponse, Product } from "@/shared/types/api"

interface ProductQueryParams {
  search?: string
  categoryId?: string
}

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ products: Product[] }>>("/products", { params })
      return response.data.data.products
    },
  })
}
