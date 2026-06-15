import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { useAuthStore } from "@/stores/auth.store"

describe("Sidebar", () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it("renders all nav links for ADMIN role", () => {
    useAuthStore.getState().login("token", {
      id: "1",
      email: "admin@test.com",
      role: "ADMIN",
    })

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Products").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Orders").length).toBeGreaterThan(0)
    expect(screen.getByText("Low Stock")).toBeInTheDocument()
  })

  it("renders only allowed links for OPERATOR role", () => {
    useAuthStore.getState().login("token", {
      id: "2",
      email: "operator@test.com",
      role: "OPERATOR",
    })

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Products").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Orders").length).toBeGreaterThan(0)
    expect(screen.queryByText("Low Stock")).not.toBeInTheDocument()
  })

  it("highlights active route", () => {
    useAuthStore.getState().login("token", {
      id: "1",
      email: "admin@test.com",
      role: "ADMIN",
    })

    render(
      <MemoryRouter initialEntries={["/products"]}>
        <Sidebar />
      </MemoryRouter>,
    )

    const productsLinks = screen.getAllByText("Products")
    const activeLink = productsLinks.find(
      (el) => el.closest("a")?.className.includes("bg-blue-50"),
    )
    expect(activeLink).toBeDefined()
  })
})
