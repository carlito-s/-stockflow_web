import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { App } from "./App"
import { useAuthStore } from "@/stores/auth.store"

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

describe("App", () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    )
    // Unauthenticated user hitting "/" → redirected to /login
    expect(screen.getByText("Inicia sesión en tu cuenta")).toBeInTheDocument()
  })
})
