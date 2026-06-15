import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { createRef } from "react"
import { Input } from "./Input"

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })

  it("displays error message when error prop provided", () => {
    render(<Input label="Email" error="Required field" />)
    expect(screen.getByText("Required field")).toBeInTheDocument()
  })

  it("forwards ref correctly", () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input label="Email" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("associates label with input via htmlFor", () => {
    render(<Input label="Email" />)
    const input = screen.getByLabelText("Email")
    expect(input.id).toBe("email")
  })
})
