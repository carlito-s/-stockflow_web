import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DashboardPage } from "./DashboardPage"
import { useAuthStore } from "@/stores/auth.store"

vi.mock("@/features/products/hooks/useProducts", () => ({
  useProducts: () => ({ data: [], isLoading: false }),
}))

vi.mock("@/features/orders/hooks/useOrders", () => ({
  useOrders: () => ({ data: [], isLoading: false }),
}))

vi.mock("@/features/reports/hooks/useLowStock", () => ({
  useLowStock: () => ({ data: [], isLoading: false }),
}))

import { vi } from "vitest"

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe("DashboardPage", () => {
  it("renders dashboard heading", () => {
    useAuthStore.getState().login("token", { id: "1", email: "a@b.com", role: "ADMIN" })
    renderDashboard()
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })
})
