import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { RequireAuth } from "./RequireAuth"
import { useAuthStore } from "@/stores/auth.store"

function TestApp() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Route>
      <Route path="/login" element={<div>Login</div>} />
    </Routes>
  )
}

describe("RequireAuth", () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it("redirects to /login when not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <TestApp />
      </MemoryRouter>,
    )
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("renders Outlet when authenticated", () => {
    useAuthStore.getState().login("token", {
      id: "1",
      email: "test@test.com",
      role: "ADMIN",
    })

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <TestApp />
      </MemoryRouter>,
    )
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })
})
