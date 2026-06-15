# Design: StockFlow Web — Project Scaffolding

## Technical Approach

Feature-based architecture with strict separation between UI, state, and data layers. React 19 + TypeScript + Vite 6 project using Bun as package manager. Auth state managed by Zustand (persisted to sessionStorage), server data by TanStack Query, API calls via Axios with JWT interceptors. Tailwind CSS v4 for styling with CSS-first configuration. Biome for formatting and linting. Testing integrated into every phase using Vitest + React Testing Library.

## Architecture Decisions

### Decision: Feature-Based Folder Structure

**Choice**: `src/features/{domain}/` with co-located components, hooks, types, and schemas.
**Alternatives considered**: Type-based (`components/`, `hooks/`, `types/`), Domain-driven (`modules/`).
**Rationale**: Feature-based scales better for SPA with clear domain boundaries. Each feature is self-contained, enabling lazy loading and independent development. Matches proposal's `src/features/auth/`, `src/features/products/`, etc.

### Decision: Zustand for Auth, TanStack Query for Server Data

**Choice**: Zustand (persist middleware) for auth/UI state; TanStack Query for all API data.
**Alternatives considered**: React Context for auth, SWR for server data, Redux Toolkit.
**Rationale**: Zustand is lighter than Redux, simpler than Context for persisted state. TanStack Query v5 provides cache, refetching, and optimistic updates out of the box. Clear boundary: client-only state vs server-derived state.

### Decision: Axios Over Fetch

**Choice**: Axios v1.x with typed interceptors.
**Alternatives considered**: Native fetch + custom wrapper.
**Rationale**: Interceptor API simplifies JWT injection and 401 handling. Better TypeScript inference for response types. Auto JSON parsing. Proposal confirms Axios.

### Decision: Tailwind CSS v4 via Vite Plugin

**Choice**: `@tailwindcss/vite` plugin with CSS-first configuration.
**Alternatives considered**: Tailwind v3 with PostCSS, CSS Modules, styled-components.
**Rationale**: v4 eliminates config file, uses CSS `@theme` directive. Faster HMR via Vite plugin. Proposal confirms v4.

### Decision: Biome Over ESLint + Prettier

**Choice**: Biome for formatting + linting.
**Alternatives considered**: ESLint + Prettier, oxlint.
**Rationale**: Single tool, faster than ESLint+Prettier combo. Built-in formatter eliminates Prettier dependency. Proposal confirms Biome.

### Decision: Vitest as Test Runner

**Choice**: Vitest with jsdom environment, React Testing Library for component tests.
**Alternatives considered**: Jest, Cypress/Playwright for E2E.
**Rationale**: Vitest has native Vite integration — no separate transform config needed. Shares the same `vite.config.ts` aliases and plugins. jsdom provides browser APIs for component testing. React Testing Library tests components the way users interact with them. MSW recommended for API mocking in Phase 3+ to avoid brittle mock implementations.

### Decision: Tests Co-Located in `src/__tests__/`

**Choice**: All test files live in `src/__tests__/` mirroring source structure (e.g., `src/__tests__/api.test.ts` tests `src/lib/api.ts`).
**Alternatives considered**: Co-located `*.test.ts` next to source files, `__tests__/` directories inside each feature.
**Rationale**: Keeps source directories clean while maintaining discoverability. Easy to configure Vitest's `include` pattern. Single directory to exclude from build tooling.

## Data Flow

```
Component ──→ useQuery/useMutation ──→ Axios Client ──→ API Server
     │               │                      │
     │          TanStack Cache          JWT Header
     │               │                      │
     └───── Zustand Auth Store ◄──── 401 Interceptor
                    │
              sessionStorage
```

**Auth State Flow**: Zustand store holds `token` + `user`. Axios request interceptor reads token from store. 401 response interceptor clears store and redirects to `/login`. Route guards read store to enforce access.

## Auth Flow Sequence

```
1. User ──→ LoginForm ──→ zodSchema.parse()
2. LoginForm ──→ useLogin() ──→ POST /api/auth/login
3. API ──→ { token, user } ──→ useLogin()
4. useLogin() ──→ authStore.login(token, user)
5. authStore ──→ sessionStorage.setItem()
6. useLogin() ──→ navigate("/dashboard")
7. Router ──→ RequireAuth ──→ authStore.isAuthenticated
8. RequireAuth ──→ <Outlet /> (renders child route)
9. API Request ──→ Axios Interceptor ──→ Authorization: Bearer <token>
10. API 401 ──→ Interceptor ──→ authStore.logout() ──→ navigate("/login")
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `vite.config.ts` | Create | Vite + React + Tailwind v4 plugin |
| `tsconfig.json` | Create | TypeScript strict config |
| `biome.json` | Create | Linting + formatting config |
| `vitest.config.ts` | Create | Vitest config with jsdom, aliases, setup file |
| `.env.example` | Create | VITE_API_URL reference |
| `src/test-setup.ts` | Create | Jest-DOM matchers for Vitest |
| `src/main.tsx` | Create | Entry point, providers (QueryClient, Toaster) |
| `src/App.tsx` | Create | Router tree with routes + guards |
| `src/index.css` | Create | Tailwind v4 import + theme tokens |
| `src/lib/api.ts` | Create | Axios instance, interceptors, error normalization |
| `src/lib/constants.ts` | Create | API URLs, role/status enums |
| `src/lib/utils.ts` | Create | formatDate, formatCurrency, cn() |
| `src/types/api.ts` | Create | All API response types (LoginResponse, etc.) |
| `src/stores/auth.store.ts` | Create | Zustand auth store with persist |
| `src/stores/ui.store.ts` | Create | Zustand UI store (sidebar, loading) |
| `src/components/guards/RequireAuth.tsx` | Create | Auth guard (redirect to /login) |
| `src/components/guards/RequireRole.tsx` | Create | Role guard (redirect to /dashboard) |
| `src/components/guards/GuestOnly.tsx` | Create | Guest guard (redirect to /dashboard) |
| `src/components/layout/AppShell.tsx` | Create | Layout wrapper (Sidebar + Header + Outlet) |
| `src/components/layout/Sidebar.tsx` | Create | Navigation sidebar with role-based links |
| `src/components/layout/Header.tsx` | Create | Header with user info + logout |
| `src/components/ui/Button.tsx` | Create | Reusable button component |
| `src/components/ui/Input.tsx` | Create | Form input with label + error |
| `src/components/ui/Card.tsx` | Create | Card container |
| `src/components/ui/Badge.tsx` | Create | Status badge |
| `src/components/ui/Skeleton.tsx` | Create | Loading skeleton |
| `src/components/ui/EmptyState.tsx` | Create | Empty state placeholder |
| `src/components/ErrorBoundary.tsx` | Create | Error boundary with fallback UI |
| `src/components/NotFoundPage.tsx` | Create | 404 page for unmatched routes |
| `src/features/auth/pages/LoginPage.tsx` | Create | Login form page |
| `src/features/auth/pages/RegisterPage.tsx` | Create | Register form page |
| `src/features/auth/schemas/auth.schema.ts` | Create | Zod schemas (login, register) |
| `src/features/auth/hooks/useLogin.ts` | Create | Login mutation hook |
| `src/features/auth/hooks/useRegister.ts` | Create | Register mutation hook |
| `src/features/dashboard/pages/DashboardPage.tsx` | Create | Role-aware dashboard |
| `src/features/products/pages/ProductListPage.tsx` | Create | Product list with search/filter |
| `src/features/products/hooks/useProducts.ts` | Create | Products query hook |
| `src/features/orders/pages/OrderListPage.tsx` | Create | Order list with status filter |
| `src/features/orders/pages/OrderDetailPage.tsx` | Create | Order detail view |
| `src/features/orders/hooks/useOrders.ts` | Create | Orders query hook |
| `src/features/orders/hooks/useOrderDetail.ts` | Create | Order detail query hook |
| `src/features/reports/pages/LowStockPage.tsx` | Create | Admin low-stock report |
| `src/features/reports/hooks/useLowStock.ts` | Create | Low-stock query hook |
| `src/__tests__/utils.test.ts` | Create | Unit tests for cn, formatDate, formatCurrency |
| `src/__tests__/App.test.tsx` | Create | Smoke test for App component |
| `src/__tests__/api.test.ts` | Create | Unit tests for API client interceptors |
| `src/__tests__/auth.store.test.ts` | Create | Unit tests for auth Zustand store |
| `src/__tests__/ui.store.test.ts` | Create | Unit tests for UI Zustand store |
| `src/__tests__/guards.test.tsx` | Create | Component tests for route guards |
| `src/__tests__/Button.test.tsx` | Create | Component tests for Button |
| `src/__tests__/Input.test.tsx` | Create | Component tests for Input |
| `src/__tests__/Badge.test.tsx` | Create | Component tests for Badge |
| `src/__tests__/EmptyState.test.tsx` | Create | Component tests for EmptyState |
| `src/__tests__/Sidebar.test.tsx` | Create | Component tests for Sidebar |
| `src/__tests__/Header.test.tsx` | Create | Component tests for Header |
| `src/__tests__/auth.schema.test.ts` | Create | Schema validation tests |
| `src/__tests__/useLogin.test.ts` | Create | Hook tests for useLogin |
| `src/__tests__/useRegister.test.ts` | Create | Hook tests for useRegister |
| `src/__tests__/LoginPage.test.tsx` | Create | Component tests for LoginPage |
| `src/__tests__/RegisterPage.test.tsx` | Create | Component tests for RegisterPage |
| `src/__tests__/useProducts.test.ts` | Create | Hook tests for useProducts |
| `src/__tests__/useOrders.test.ts` | Create | Hook tests for useOrders |
| `src/__tests__/useLowStock.test.ts` | Create | Hook tests for useLowStock |
| `src/__tests__/DashboardPage.test.tsx` | Create | Component tests for DashboardPage |
| `src/__tests__/ProductListPage.test.tsx` | Create | Component tests for ProductListPage |
| `src/__tests__/OrderListPage.test.tsx` | Create | Component tests for OrderListPage |
| `src/__tests__/App.integration.test.tsx` | Create | Integration test for full auth flow |
| `src/__tests__/ErrorBoundary.test.tsx` | Create | Component tests for ErrorBoundary |
| `src/__tests__/NotFoundPage.test.tsx` | Create | Component tests for NotFoundPage |

## Interfaces / Contracts

```typescript
// src/types/api.ts
interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}

interface LoginResponse {
  token: string;
  user: { id: string; email: string; role: "ADMIN" | "OPERATOR" };
}

interface Product {
  id: string; name: string; sku: string; stock: number;
  minStock: number; price: number; categoryId: string;
  category: { id: string; name: string };
  createdAt: string; updatedAt: string;
}

interface Order {
  id: string; operatorId: string; status: "PENDING" | "DISPATCHED" | "CANCELLED";
  createdAt: string; updatedAt: string;
  operator: { id: string; email: string; role: string };
  items: Array<{ id: string; productId: string; quantity: number; priceAtOrder: number; product: { name: string; sku: string } }>;
}
```

## Testing Strategy

### Test Infrastructure

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Test runner | Vitest | Native Vite integration, shares config with build |
| Environment | jsdom | Browser APIs without real browser |
| Component testing | React Testing Library | Tests user-visible behavior, not implementation |
| DOM assertions | @testing-library/jest-dom | `toBeInTheDocument()`, `toHaveClass()`, etc. |
| User events | @testing-library/user-event | Realistic click/type/keyboard simulation |
| API mocking | MSW (Phase 3+) | Intercepts at network level, no source coupling |

### Test Categories by Phase

| Phase | Test Type | What | Approach |
|-------|-----------|------|----------|
| Phase 1 | Config | Vitest setup, test scripts | `vitest.config.ts`, `test-setup.ts` |
| Phase 2 | Unit | `cn()`, `formatDate()`, `formatCurrency()` | Direct import + assertion |
| Phase 2 | Smoke | App renders without crash | Wrap in MemoryRouter + QueryClientProvider |
| Phase 3 | Unit | API interceptors, Zustand stores | Mock Axios, mock sessionStorage |
| Phase 3 | Component | Route guards | Render with mock auth store, assert redirect |
| Phase 4 | Component | Button, Input, Badge, EmptyState | Render + assert DOM + fire events |
| Phase 4 | Component | Sidebar, Header | Mock auth store, assert role-based rendering |
| Phase 5 | Schema | Zod login/register schemas | Parse valid/invalid inputs, assert errors |
| Phase 5 | Hook | useLogin, useRegister | `renderHook` + mocked API responses |
| Phase 5 | Component | LoginPage, RegisterPage | Render form, submit, assert error/loading |
| Phase 6 | Hook | useProducts, useOrders, useLowStock | `renderHook` + mocked API responses |
| Phase 6 | Component | ProductListPage, OrderListPage, DashboardPage | Render with mocked hooks |
| Phase 6 | Integration | Full auth flow (login → dashboard → logout) | Compose real components + mocked API |
| Phase 7 | Component | ErrorBoundary, NotFoundPage | Throw errors / render 404 |
| Phase 7 | Final | `bun run test` green | All 88 tasks pass |

### Testing Patterns

```typescript
// Component test pattern
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

it("handles click", async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Click</Button>)
  await userEvent.click(screen.getByRole("button", { name: "Click" }))
  expect(onClick).toHaveBeenCalled()
})

// Hook test pattern
import { renderHook, waitFor } from "@testing-library/react"
import { useProducts } from "./useProducts"

it("fetches products", async () => {
  // Mock API response
  const { result } = renderHook(() => useProducts({ search: "" }))
  expect(result.current.isLoading).toBe(true)
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data).toHaveLength(3)
})

// Schema test pattern
import { loginSchema } from "./auth.schema"

it("rejects invalid email", () => {
  const result = loginSchema.safeParse({ email: "bad", password: "123456" })
  expect(result.success).toBe(false)
})
```

### Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    css: true,
  },
})
```

```typescript
// src/test-setup.ts
import "@testing-library/jest-dom/vitest"
```

### package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Migration / Rollout

No migration required. Greenfield project — no existing data or code to migrate.

## Open Questions

- [ ] Should we add `react-hot-toast` for notifications or use a lighter alternative?
- [ ] Is `sessionStorage` sufficient for token persistence, or should we consider `localStorage` with shorter expiry?
- [ ] Should the API client include retry logic for network errors (not just 401)?
