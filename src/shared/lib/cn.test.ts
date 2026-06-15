import { describe, it, expect } from "vitest"
import { cn } from "./cn"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra")
  })

  it("handles undefined and null", () => {
    expect(cn("base", undefined, null)).toBe("base")
  })

  it("merges tailwind conflicts", () => {
    expect(cn("px-2 py-1", "py-2")).toBe("px-2 py-2")
  })
})
