import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/stores/auth.store"

interface RequireRoleProps {
  roles: string[]
}

export function RequireRole({ roles }: RequireRoleProps) {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
