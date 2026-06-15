import { NavLink } from "react-router-dom"
import { LayoutDashboard, Package, ShoppingCart, AlertTriangle, X } from "lucide-react"
import { cn } from "@/shared/lib/cn"
import { useAuthStore } from "@/stores/auth.store"
import { useUiStore } from "@/stores/ui.store"

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles: ("ADMIN" | "OPERATOR")[]
}

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "OPERATOR"] },
  { to: "/products", label: "Products", icon: Package, roles: ["ADMIN", "OPERATOR"] },
  { to: "/orders", label: "Orders", icon: ShoppingCart, roles: ["ADMIN", "OPERATOR"] },
  { to: "/low-stock", label: "Low Stock", icon: AlertTriangle, roles: ["ADMIN"] },
]

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const closeSidebar = useUiStore((s) => s.closeSidebar)

  const filteredItems = navItems.filter((item) => user?.role && item.roles.includes(user.role))

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-200",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <span className="text-xl font-bold text-blue-600">StockFlow</span>
          <button onClick={closeSidebar} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {filteredItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50",
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
