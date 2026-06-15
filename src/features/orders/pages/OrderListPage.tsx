import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { useOrders } from "../hooks/useOrders"
import { Badge } from "@/shared/components/ui/Badge"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { EmptyState } from "@/shared/components/ui/EmptyState"
import { cn } from "@/shared/lib/cn"
import type { Order } from "@/shared/types/api"

const STATUS_TABS = [
  { label: "Todos", value: undefined },
  { label: "Pendientes", value: "PENDING" },
  { label: "Despachados", value: "DISPATCHED" },
  { label: "Cancelados", value: "CANCELLED" },
] as const

const STATUS_BADGE: Record<string, { variant: "yellow" | "green" | "red" | "orange"; label: string }> = {
  PENDING: { variant: "yellow", label: "Pendiente" },
  DISPATCHED: { variant: "green", label: "Despachado" },
  CANCELLED: { variant: "red", label: "Cancelado" },
}

export function OrderListPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<string | undefined>(undefined)
  const { data: orders, isLoading } = useOrders(status ? { status } : undefined)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>

      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setStatus(tab.value)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              status === tab.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : !orders?.length ? (
        <EmptyState
          title="No hay pedidos"
          description="No se encontraron pedidos con los filtros seleccionados."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Operador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Items
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order: Order) => {
                const badge = STATUS_BADGE[order.status]
                return (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-500">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {order.operator?.email ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant={badge?.variant ?? "yellow"}>
                        {badge?.label ?? order.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {order.items?.length ?? 0}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
