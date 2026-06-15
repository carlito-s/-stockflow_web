import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useOrders } from "./useOrders"

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

describe("useOrders", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns loading state initially", () => {
    mockGet.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(true)
  })

  it("filters by status", async () => {
    const orders = [{ id: "1", status: "PENDING", items: [], operator: { id: "1", email: "a@b.com", role: "ADMIN" }, createdAt: "", updatedAt: "" }]
    mockGet.mockResolvedValueOnce({ data: { data: { orders, total: 1 } } })

    const { result } = renderHook(() => useOrders({ status: "PENDING" }), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGet).toHaveBeenCalledWith("/orders", { params: { status: "PENDING" } })
    expect(result.current.data).toEqual(orders)
  })
})
