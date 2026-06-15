import { useParams, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import toast from "react-hot-toast"
import api from "@/config/api"
import { useOrderDetail } from "../hooks/useOrderDetail"
import { Badge } from "@/shared/components/ui/Badge"
import { Button } from "@/shared/components/ui/Button"
import { Card } from "@/shared/components/ui/Card"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { EmptyState } from "@/shared/components/ui/EmptyState"
import type { OrderItem } from "@/shared/types/api"

const STATUS_BADGE: Record<string, { variant: "yellow" | "green" | "red" | "orange"; label: string }> = {
  PENDING: { variant: "yellow", label: "Pendiente" },
  DISPATCHED: { variant: "green", label: "Despachado" },
  CANCELLED: { variant: "red", label: "Cancelado" },
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: order, isLoading, error } = useOrderDetail(id ?? "")

  const statusMutation = useMutation({
    mutationFn: (newStatus: string) =>
      api.patch(`/orders/${id}/status`, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success("Estado actualizado")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Error al actualizar estado")
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <EmptyState
        title="Pedido no encontrado"
        description="El pedido que buscas no existe o fue eliminado."
      />
    )
  }

  const badge = STATUS_BADGE[order.status]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-gray-600">
            {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
          </p>
        </div>
        <Badge variant={badge?.variant ?? "yellow"}>{badge?.label ?? order.status}</Badge>
      </div>

      <Card title="Detalles">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-600">Operador</dt>
            <dd className="text-sm font-medium text-gray-900">
              {order.operator?.email ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Estado</dt>
            <dd className="text-sm font-medium text-gray-900">
              {badge?.label ?? order.status}
            </dd>
          </div>
        </dl>
      </Card>

      <Card title="Items">
        {!order.items?.length ? (
          <p className="text-sm text-gray-500">Este pedido no tiene items.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    Producto
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    SKU
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    Cantidad
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    Precio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item: OrderItem) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {item.product?.name ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {item.product?.sku ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      ${item.priceAtOrder.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {order.status === "PENDING" && (
        <div className="flex gap-4">
          <Button
            onClick={() => statusMutation.mutate("DISPATCHED")}
            isLoading={statusMutation.isPending}
          >
            Despachar
          </Button>
          <Button
            variant="danger"
            onClick={() => statusMutation.mutate("CANCELLED")}
            isLoading={statusMutation.isPending}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  )
}
