import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { App } from "./App"
import { useAuthStore } from "@/stores/auth.store"

describe("App", () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it("renders without crashing", () => {
    render(<App />)
    // Unauthenticated user hitting "/" lands on NotFoundPage (404)
    expect(screen.getByText("404")).toBeInTheDocument()
  })
})
