import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useRegister } from "./useRegister"

const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock("@/config/api", () => ({
  default: {
    post: vi.fn(),
  }
}))

import api from "@/config/api"
const mockPost = vi.mocked(api.post)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  )
}

describe("useRegister", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("calls mutation with correct data", async () => {
    mockPost.mockResolvedValueOnce({ data: { message: "ok" } })

    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() })

    result.current.mutate({
      email: "new@user.com",
      password: "12345678",
      confirmPassword: "12345678",
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockPost).toHaveBeenCalledWith("/auth/register", {
      email: "new@user.com",
      password: "12345678",
    })
  })

  it("navigates to /login on success", async () => {
    mockPost.mockResolvedValueOnce({ data: { message: "ok" } })

    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() })

    result.current.mutate({
      email: "new@user.com",
      password: "12345678",
      confirmPassword: "12345678",
    })

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"))
  })
})
