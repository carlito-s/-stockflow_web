import { useQuery } from "@tanstack/react-query"
import api from "@/config/api"
import type { ApiResponse, Product } from "@/shared/types/api"

export function useLowStock() {
  return useQuery({
    queryKey: ["reports", "low-stock"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ products: Product[] }>>("/reports/low-stock")
      return response.data.data.products
    },
  })
}
