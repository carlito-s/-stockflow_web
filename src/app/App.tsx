import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { RequireAuth } from "@/components/guards/RequireAuth"
import { RequireRole } from "@/components/guards/RequireRole"
import { GuestOnly } from "@/components/guards/GuestOnly"
import { AppShell } from "@/shared/components/layout/AppShell"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage"
import { ProductListPage } from "@/features/products/pages/ProductListPage"
import { OrderListPage } from "@/features/orders/pages/OrderListPage"
import { OrderDetailPage } from "@/features/orders/pages/OrderDetailPage"
import { LowStockPage } from "@/features/reports/pages/LowStockPage"
import { NotFoundPage } from "@/shared/components/NotFoundPage"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<GuestOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route element={<RequireRole roles={["ADMIN"]} />}>
              <Route path="/reports/low-stock" element={<LowStockPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
