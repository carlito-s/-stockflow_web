import { useLowStock } from "../hooks/useLowStock"
import { Skeleton } from "@/shared/components/ui/Skeleton"
import { EmptyState } from "@/shared/components/ui/EmptyState"
import type { Product } from "@/shared/types/api"

function StockSeverity({ product }: { product: Product }) {
  const diff = product.stock - product.minStock

  if (product.stock === 0) {
    return <span className="text-sm font-medium text-red-600">{product.stock}</span>
  }
  if (product.stock <= product.minStock) {
    return <span className="text-sm font-medium text-orange-600">{product.stock}</span>
  }
  return <span className="text-sm text-gray-900">{product.stock}</span>
}

export function LowStockPage() {
  const { data: products, isLoading } = useLowStock()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Stock Bajo</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : !products?.length ? (
        <EmptyState
          title="Todo en orden"
          description="No hay productos con stock por debajo del mínimo."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stock Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stock Mín.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Diferencia
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product: Product) => {
                const diff = product.stock - product.minStock
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StockSeverity product={product} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.minStock}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-red-600 font-medium">
                      {diff}
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
