import { useQuery } from "@tanstack/react-query"
import api from "@/config/api"
import type { ApiResponse, Order } from "@/shared/types/api"

interface OrderQueryParams {
  status?: string
}

export function useOrders(params?: OrderQueryParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ orders: Order[] }>>("/orders", { params })
      return response.data.data.orders
    },
  })
}
