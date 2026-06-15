import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { OrderListPage } from "./OrderListPage"

vi.mock("@/features/orders/hooks/useOrders", () => ({
  useOrders: () => ({
    data: [
      {
        id: "order-12345678-abcdefgh",
        operatorId: "1",
        status: "PENDING",
        createdAt: "2026-01-15T10:30:00Z",
        updatedAt: "2026-01-15T10:30:00Z",
        operator: { id: "1", email: "operator@test.com", role: "OPERATOR" },
        items: [{ id: "i1", productId: "p1", quantity: 3, priceAtOrder: 10, product: { id: "p1", name: "Widget", sku: "W001" } }],
      },
    ],
    isLoading: false,
  }),
}))

function renderOrderList() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <OrderListPage />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe("OrderListPage", () => {
  it("renders order table headers", () => {
    renderOrderList()
    expect(screen.getByText("ID")).toBeInTheDocument()
    expect(screen.getByText("Operador")).toBeInTheDocument()
    expect(screen.getByText("Fecha")).toBeInTheDocument()
    expect(screen.getByText("Estado")).toBeInTheDocument()
  })

  it("shows status filter tabs", () => {
    renderOrderList()
    expect(screen.getByText("Todos")).toBeInTheDocument()
    expect(screen.getByText("Pendientes")).toBeInTheDocument()
    expect(screen.getByText("Despachados")).toBeInTheDocument()
    expect(screen.getByText("Cancelados")).toBeInTheDocument()
  })
})
