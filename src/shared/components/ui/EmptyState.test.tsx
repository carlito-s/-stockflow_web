import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { EmptyState } from "./EmptyState"

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No data" description="Nothing here yet" />)
    expect(screen.getByText("No data")).toBeInTheDocument()
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument()
  })

  it("renders icon when provided", () => {
    render(<EmptyState title="Empty" description="No items" />)
    // The default Package icon should render as an SVG
    const svgs = document.querySelectorAll("svg")
    expect(svgs.length).toBeGreaterThan(0)
  })
})
