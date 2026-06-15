import { describe, it, expect, beforeEach } from "vitest"
import { useAuthStore } from "./auth.store"
import type { User } from "@/shared/types/api"

const mockUser: User = {
  id: "1",
  email: "test@example.com",
  role: "ADMIN",
}

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    sessionStorage.clear()
  })

  it("starts unauthenticated", () => {
    const { token, user, isAuthenticated } = useAuthStore.getState()
    expect(token).toBeNull()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it("login sets token and user", () => {
    useAuthStore.getState().login("test-token", mockUser)
    const { token, user, isAuthenticated } = useAuthStore.getState()
    expect(token).toBe("test-token")
    expect(user).toEqual(mockUser)
    expect(isAuthenticated).toBe(true)
  })

  it("logout clears token and user", () => {
    useAuthStore.getState().login("test-token", mockUser)
    useAuthStore.getState().logout()
    const { token, user, isAuthenticated } = useAuthStore.getState()
    expect(token).toBeNull()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it("isAuthenticated reflects auth state", () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    useAuthStore.getState().login("token", mockUser)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })
})
