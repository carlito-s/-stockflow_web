import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useLogin } from "./useLogin"
import { useAuthStore } from "@/stores/auth.store"

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

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.getState().logout()
  })

  it("calls mutation with correct data", async () => {
    mockPost.mockResolvedValueOnce({
      data: { data: { token: "abc", user: { id: "1", email: "a@b.com", role: "ADMIN" } } },
    })

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    result.current.mutate({ email: "a@b.com", password: "123456" })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockPost).toHaveBeenCalledWith("/auth/login", {
      email: "a@b.com",
      password: "123456",
    })
  })

  it("stores token on success", async () => {
    const user = { id: "1", email: "a@b.com", role: "ADMIN" as const }
    mockPost.mockResolvedValueOnce({
      data: { data: { token: "abc", user } },
    })

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    result.current.mutate({ email: "a@b.com", password: "123456" })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const authState = useAuthStore.getState()
    expect(authState.token).toBe("abc")
    expect(authState.user).toEqual(user)
  })

  it("navigates to /dashboard on success", async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        data: {
          token: "abc",
          user: { id: "1", email: "a@b.com", role: "ADMIN" },
        },
      },
    })

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    result.current.mutate({ email: "a@b.com", password: "123456" })

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/dashboard"))
  })
})
