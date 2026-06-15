import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ErrorBoundary } from "./ErrorBoundary"

function ThrowingComponent() {
  throw new Error("Test error")
  return null
}

function SafeComponent() {
  return <div>All good</div>
}

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>,
    )
    expect(screen.getByText("All good")).toBeInTheDocument()
  })

  it("renders fallback when error occurs", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Algo salió mal")).toBeInTheDocument()
    expect(screen.getByText("Test error")).toBeInTheDocument()

    spy.mockRestore()
  })

  it("retries when button is clicked", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    let shouldThrow = true

    function ConditionalThrower() {
      if (shouldThrow) throw new Error("Test error")
      return <div>Recovered</div>
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalThrower />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Algo salió mal")).toBeInTheDocument()

    shouldThrow = false
    fireEvent.click(screen.getByRole("button", { name: /reintentar/i }))

    rerender(
      <ErrorBoundary>
        <ConditionalThrower />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Recovered")).toBeInTheDocument()
    spy.mockRestore()
  })
})
