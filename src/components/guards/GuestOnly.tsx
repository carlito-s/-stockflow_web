import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/stores/auth.store"

export function GuestOnly() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
