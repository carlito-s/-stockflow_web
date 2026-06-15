import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useProducts } from "./useProducts"

vi.mock("@/config/api", () => ({
  default: {
    get: vi.fn(),
  }
}))

import api from "@/config/api"
const mockGet = vi.mocked(api.get)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe("useProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns loading state initially", () => {
    mockGet.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(true)
  })

  it("returns data on success", async () => {
    const products = [{ id: "1", name: "Test", sku: "T001", stock: 10, minStock: 5, price: 100, categoryId: "1", category: { id: "1", name: "Cat" }, createdAt: "", updatedAt: "" }]
    mockGet.mockResolvedValueOnce({ data: { data: { products, total: 1 } } })

    const { result } = renderHook(() => useProducts(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(products)
  })
})
