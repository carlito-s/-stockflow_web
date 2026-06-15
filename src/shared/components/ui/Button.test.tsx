import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./Button"

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
  })

  it("applies primary variant classes", () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByRole("button", { name: "Primary" })
    expect(button.className).toContain("bg-blue-600")
  })

  it("applies danger variant classes", () => {
    render(<Button variant="danger">Danger</Button>)
    const button = screen.getByRole("button", { name: "Danger" })
    expect(button.className).toContain("bg-red-600")
  })

  it("shows loading spinner when isLoading", () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByRole("button", { name: "Loading" }).querySelector("svg")).toBeInTheDocument()
  })

  it("disables button when isLoading", () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByRole("button", { name: "Loading" })).toBeDisabled()
  })

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole("button", { name: "Click" }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
