import { describe, it, expect } from "vitest"
import { loginSchema, registerSchema } from "./auth.schema"

describe("loginSchema", () => {
  it("passes with valid email and password", () => {
    const result = loginSchema.safeParse({ email: "test@test.com", password: "123456" })
    expect(result.success).toBe(true)
  })

  it("fails with invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "123456" })
    expect(result.success).toBe(false)
  })

  it("fails with empty password", () => {
    const result = loginSchema.safeParse({ email: "test@test.com", password: "" })
    expect(result.success).toBe(false)
  })
})

describe("registerSchema", () => {
  it("passes with matching passwords", () => {
    const result = registerSchema.safeParse({
      email: "test@test.com",
      password: "12345678",
      confirmPassword: "12345678",
    })
    expect(result.success).toBe(true)
  })

  it("fails with non-matching passwords", () => {
    const result = registerSchema.safeParse({
      email: "test@test.com",
      password: "12345678",
      confirmPassword: "87654321",
    })
    expect(result.success).toBe(false)
  })

  it("fails with short password", () => {
    const result = registerSchema.safeParse({
      email: "test@test.com",
      password: "123",
      confirmPassword: "123",
    })
    expect(result.success).toBe(false)
  })
})
