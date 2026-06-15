import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Badge } from "./Badge"

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge variant="green">Active</Badge>)
    expect(screen.getByText("Active")).toBeInTheDocument()
  })

  it("applies yellow variant classes", () => {
    render(<Badge variant="yellow">Pending</Badge>)
    expect(screen.getByText("Pending").className).toContain("bg-yellow-100")
  })

  it("applies green variant classes", () => {
    render(<Badge variant="green">Status</Badge>)
    expect(screen.getByText("Status").className).toContain("bg-green-100")
  })

  it("applies red variant classes", () => {
    render(<Badge variant="red">Error</Badge>)
    expect(screen.getByText("Error").className).toContain("bg-red-100")
  })
})
