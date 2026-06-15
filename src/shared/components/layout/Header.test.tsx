import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { Header } from "./Header"
import { useAuthStore } from "@/stores/auth.store"

describe("Header", () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it("renders user email", () => {
    useAuthStore.getState().login("token", {
      id: "1",
      email: "test@test.com",
      role: "ADMIN",
    })

    render(<Header />)
    expect(screen.getByText("test@test.com")).toBeInTheDocument()
  })

  it("renders role badge", () => {
    useAuthStore.getState().login("token", {
      id: "1",
      email: "test@test.com",
      role: "ADMIN",
    })

    render(<Header />)
    expect(screen.getByText("ADMIN")).toBeInTheDocument()
  })

  it("shows logout button", () => {
    useAuthStore.getState().login("token", {
      id: "1",
      email: "test@test.com",
      role: "ADMIN",
    })

    render(<Header />)
    expect(screen.getByTitle("Logout")).toBeInTheDocument()
  })
})
