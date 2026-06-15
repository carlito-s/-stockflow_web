import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const mockUseProducts = vi.fn()

vi.mock("@/features/products/hooks/useProducts", () => ({
  useProducts: (...args: any[]) => mockUseProducts(...args),
}))

import { ProductListPage } from "./ProductListPage"
import { useAuthStore } from "@/stores/auth.store"

const PRODUCTS_MOCK = [
  {
    id: "1",
    name: "Test Product",
    sku: "TP001",
    stock: 10,
    minStock: 5,
    price: 29.99,
    categoryId: "1",
    category: { id: "1", name: "Electronics" },
    createdAt: "",
    updatedAt: "",
  },
]

function renderProductList() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ProductListPage />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe("ProductListPage", () => {
  it("renders product table headers", () => {
    mockUseProducts.mockReturnValue({ data: PRODUCTS_MOCK, isLoading: false })
    renderProductList()
    expect(screen.getByText("Nombre")).toBeInTheDocument()
    expect(screen.getByText("SKU")).toBeInTheDocument()
    expect(screen.getByText("Stock")).toBeInTheDocument()
  })

  it("shows empty state when no products", () => {
    mockUseProducts.mockReturnValue({ data: [], isLoading: false })
    renderProductList()
    expect(screen.getByText("No hay productos")).toBeInTheDocument()
  })
})
