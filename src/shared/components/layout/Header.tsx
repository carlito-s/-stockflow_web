import { LogOut, Menu } from "lucide-react"
import { useAuthStore } from "@/stores/auth.store"
import { useUiStore } from "@/stores/ui.store"
import { Badge } from "@/shared/components/ui/Badge"

export function Header() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  const roleBadgeVariant = user?.role === "ADMIN" ? "orange" : "green"

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">StockFlow</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <Badge variant={roleBadgeVariant}>{user?.role}</Badge>
        </div>
        <button
          onClick={logout}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
