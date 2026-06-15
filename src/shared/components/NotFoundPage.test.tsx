import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { NotFoundPage } from "./NotFoundPage"

describe("NotFoundPage", () => {
  it("renders 404 message", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )
    expect(screen.getByText("404")).toBeInTheDocument()
    expect(screen.getByText("Página no encontrada")).toBeInTheDocument()
  })

  it("has link to /dashboard", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )
    const link = screen.getByRole("link", { name: /volver al dashboard/i })
    expect(link).toHaveAttribute("href", "/dashboard")
  })
})
