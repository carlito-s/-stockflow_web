import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { LoginPage } from "./LoginPage"

function renderLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe("LoginPage", () => {
  it("renders login form", () => {
    renderLoginPage()
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it("shows validation errors for empty fields", async () => {
    renderLoginPage()
    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i })
    submitButton.click()

    const errors = await screen.findAllByText(/requerido|inválido/i)
    expect(errors.length).toBeGreaterThan(0)
  })
})
