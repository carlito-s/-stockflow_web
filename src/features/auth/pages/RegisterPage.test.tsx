import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RegisterPage } from "./RegisterPage"

function renderRegisterPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <QueryClientProvider client={queryClient}>
        <RegisterPage />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe("RegisterPage", () => {
  it("renders register form", () => {
    renderRegisterPage()
    expect(screen.getByText("Crear cuenta")).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument()
  })

  it("shows validation errors for mismatched passwords", async () => {
    renderRegisterPage()
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/^contraseña$/i)
    const confirmInput = screen.getByLabelText(/confirmar contraseña/i)

    fireEvent.input(emailInput, { target: { value: "test@test.com" } })
    fireEvent.input(passwordInput, { target: { value: "12345678" } })
    fireEvent.input(confirmInput, { target: { value: "87654321" } })

    const submitButton = screen.getByRole("button", { name: /crear cuenta/i })
    fireEvent.click(submitButton)

    const error = await screen.findByText(/no coinciden/i)
    expect(error).toBeInTheDocument()
  })
})
