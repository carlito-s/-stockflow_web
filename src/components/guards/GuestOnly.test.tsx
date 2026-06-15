import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { GuestOnly } from "./GuestOnly"
import { useAuthStore } from "@/stores/auth.store"

function TestApp() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<div>Login</div>} />
      </Route>
      <Route path="/dashboard" element={<div>Dashboard</div>} />
    </Routes>
  )
}

describe("GuestOnly", () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it("redirects to /dashboard when authenticated", () => {
    useAuthStore.getState().login("token", {
      id: "1",
      email: "test@test.com",
      role: "ADMIN",
    })

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <TestApp />
      </MemoryRouter>,
    )
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })

  it("renders Outlet when not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <TestApp />
      </MemoryRouter>,
    )
    expect(screen.getByText("Login")).toBeInTheDocument()
  })
})
