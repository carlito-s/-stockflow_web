import { useNavigate } from "react-router-dom"
import { Package, ShoppingCart, AlertTriangle } from "lucide-react"
import { useAuthStore } from "@/stores/auth.store"
import { useProducts } from "@/features/products/hooks/useProducts"
import { useOrders } from "@/features/orders/hooks/useOrders"
import { useLowStock } from "@/features/reports/hooks/useLowStock"
import { Card } from "@/shared/components/ui/Card"
import { Button } from "@/shared/components/ui/Button"
import { Skeleton } from "@/shared/components/ui/Skeleton"

export function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === "ADMIN"

  const products = useProducts()
  const lowStock = useLowStock()
  const orders = useOrders({ status: "PENDING" })

  const isLoading = products.isLoading || lowStock.isLoading || orders.isLoading

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">
          {isAdmin ? "Vista general del sistema" : "Tus pedidos pendientes"}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {isAdmin ? "Total productos" : "Mis productos"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.data?.length ?? 0}
                </p>
              </div>
            </div>
          </Card>

          {isAdmin && (
            <Card>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-orange-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock bajo</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lowStock.data?.length ?? 0}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-yellow-100 p-3">
                <ShoppingCart className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pedidos pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.data?.length ?? 0}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="flex gap-4">
        {isAdmin && (
          <Button onClick={() => navigate("/products")}>Crear Producto</Button>
        )}
        <Button onClick={() => navigate("/orders")} variant="secondary">
          Crear Pedido
        </Button>
      </div>
    </div>
  )
}
