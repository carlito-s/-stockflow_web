import { useQuery } from "@tanstack/react-query"
import api from "@/config/api"
import type { ApiResponse, Order } from "@/shared/types/api"

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ order: Order }>>(`/orders/${id}`)
      return response.data.data.order
    },
    enabled: !!id,
  })
}
