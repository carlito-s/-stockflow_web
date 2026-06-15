# Tasks: StockFlow Web — Project Scaffolding

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1,800 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | 4 PRs stacked-to-main |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Project scaffold + foundation + test setup | PR 1 | ~300 lines; standalone, no runtime deps, test infra |
| 2 | Infrastructure + tests | PR 2 | ~450 lines; depends on PR 1 for types |
| 3 | Layout + UI components + tests | PR 3 | ~450 lines; depends on PR 2 for auth store |
| 4 | Feature pages + hooks + tests + polish | PR 4 | ~600 lines; depends on PR 3 for layout + UI |

## Phase 1: Project Init + Test Setup

- [x] 1.1 Scaffold Vite + React 19 + TypeScript project: `bun create vite stockflow_web --template react-ts` (~50 lines generated)
- [x] 1.2 Install all runtime dependencies via Bun: `bun add react-router-dom zustand @tanstack/react-query axios react-hook-form @hookform/resolvers zod react-hot-toast lucide-react clsx tailwind-clsx` (~20 lines package.json)
- [x] 1.3 Install test dependencies: `bun add -d vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom` (~10 lines package.json)
- [x] 1.4 Configure Biome: create `biome.json` with formatting + linting rules (~30 lines)
- [x] 1.5 Configure Vite: update `vite.config.ts` with `@tailwindcss/vite` plugin + resolve aliases (~15 lines)
- [x] 1.6 Configure TypeScript: update `tsconfig.json` with strict mode + path aliases (`@/*` → `./src/*`) (~25 lines)
- [x] 1.7 Create `vitest.config.ts` — Vitest config with jsdom environment, path aliases matching tsconfig, setup file reference, `css: true` (~20 lines)
- [x] 1.8 Create `src/test-setup.ts` — import `@testing-library/jest-dom/vitest` for DOM matchers (~3 lines)
- [x] 1.9 Add test scripts to `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"` (~3 lines)
- [x] 1.10 Create `.env.example` with `VITE_API_URL=http://localhost:3000` (~2 lines)
- [x] 1.11 Verify: `bun install` + `bun run build` passes with zero errors
- [x] 1.12 Verify: `bun run test` passes (0 tests, 0 failures)

**Dependencies**: None — first phase.
**Estimated lines**: ~178

## Phase 2: Foundation

- [x] 2.1 Create folder structure: `src/lib/`, `src/stores/`, `src/types/`, `src/components/guards/`, `src/components/layout/`, `src/components/ui/`, `src/features/auth/`, `src/features/products/`, `src/features/orders/`, `src/features/reports/`, `src/features/dashboard/`, `src/__tests__/`
- [x] 2.2 Create `src/types/api.ts` — all API response types matching `doc/API_CONTRACT.md`: `ApiResponse<T>`, `LoginResponse`, `RegisterResponse`, `Product`, `ProductsResponse`, `Order`, `OrdersResponse`, `LowStockResponse` (~80 lines)
- [ ] 2.3 Create `src/lib/constants.ts` — `API_URL` default, `Role` enum (`ADMIN`, `OPERATOR`), `OrderStatus` enum (`PENDING`, `DISPATCHED`, `CANCELLED`) (~15 lines)
- [x] 2.4 Create `src/lib/utils.ts` — `cn()` (clsx wrapper), `formatDate()`, `formatCurrency()` (~30 lines)
- [ ] 2.5 Create `src/__tests__/utils.test.ts` — unit tests for `cn()` (merges classes, handles falsy values), `formatDate()` (valid date, invalid date), `formatCurrency()` (formats numbers) (~40 lines)
- [x] 2.6 Create `src/index.css` — Tailwind v4 `@import "tailwindcss"` + custom theme tokens (~20 lines)
- [ ] 2.7 Create `src/__tests__/App.test.tsx` — smoke test: renders App without crashing (wraps in MemoryRouter + QueryClientProvider) (~20 lines)
- [x] 2.8 Verify: `bun run build` passes; types import without errors
- [ ] 2.9 Verify: `bun run test` passes — utils tests + smoke test green

**Dependencies**: Phase 1.
**Estimated lines**: ~205

## Phase 3: Infrastructure

- [ ] 3.1 Create `src/lib/api.ts` — Axios instance with `VITE_API_URL` baseURL, request interceptor (reads token from auth store), response interceptor (401 → clear token + redirect), error normalization function (~70 lines)
- [ ] 3.2 Create `src/__tests__/api.test.ts` — unit tests for API client: request interceptor injects Authorization header, response interceptor clears token on 401, error normalization formats backend errors (~50 lines)
- [ ] 3.3 Create `src/stores/auth.store.ts` — Zustand store with `token`, `user`, `login()`, `logout()`, `isAuthenticated` getter; persist middleware targeting `sessionStorage` (~50 lines)
- [ ] 3.4 Create `src/__tests__/auth.store.test.ts` — unit tests: login sets token + user, logout clears state, persist reads from sessionStorage, isAuthenticated reflects state (~40 lines)
- [ ] 3.5 Create `src/stores/ui.store.ts` — Zustand store with `sidebarOpen`, `toggleSidebar()` (~15 lines)
- [ ] 3.6 Create `src/__tests__/ui.store.test.ts` — unit tests: toggleSidebar flips state (~10 lines)
- [ ] 3.7 Create `src/components/guards/RequireAuth.tsx` — reads `authStore.isAuthenticated`, redirects to `/login` if false, renders `<Outlet />` (~15 lines)
- [ ] 3.8 Create `src/components/guards/RequireRole.tsx` — reads `authStore.user.role`, redirects to `/dashboard` if role mismatch; accepts `roles` prop (~20 lines)
- [ ] 3.9 Create `src/components/guards/GuestOnly.tsx` — redirects to `/dashboard` if authenticated, renders `<Outlet />` if not (~15 lines)
- [ ] 3.10 Create `src/__tests__/guards.test.tsx` — component tests: RequireAuth redirects when unauthenticated, renders Outlet when authenticated; RequireRole redirects on mismatch; GuestOnly redirects when authenticated (~60 lines)
- [ ] 3.11 Create `src/main.tsx` — entry point wrapping `<App />` with `<QueryClientProvider>` and `<Toaster />` (~20 lines)
- [ ] 3.12 Verify: `bun run build` passes; import chain works (api → store → guards)
- [ ] 3.13 Verify: `bun run test` passes — all infrastructure tests green

**Dependencies**: Phase 2 (types, constants).
**Estimated lines**: ~365

## Phase 4: Layout + UI Components

- [ ] 4.1 Create `src/components/ui/Button.tsx` — reusable button with `variant` (`primary`, `secondary`, `ghost`, `danger`) + `size` props, loading state (~35 lines)
- [ ] 4.2 Create `src/__tests__/Button.test.tsx` — component tests: renders with text, applies variant classes, shows loading spinner, fires click handler (~40 lines)
- [ ] 4.3 Create `src/components/ui/Input.tsx` — form input with label, error message display, forwardRef (~25 lines)
- [ ] 4.4 Create `src/__tests__/Input.test.tsx` — component tests: renders label, displays error message, forwards ref, shows required indicator (~35 lines)
- [ ] 4.5 Create `src/components/ui/Card.tsx` — card container with optional title/description (~15 lines)
- [ ] 4.6 Create `src/components/ui/Badge.tsx` — status badge with color variants (`yellow`/`green`/`red`/`orange`) (~20 lines)
- [ ] 4.7 Create `src/__tests__/Badge.test.tsx` — component tests: renders with correct variant color class, shows children text (~25 lines)
- [ ] 4.8 Create `src/components/ui/Skeleton.tsx` — animated loading skeleton, accepts `className` for width/height (~10 lines)
- [ ] 4.9 Create `src/components/ui/EmptyState.tsx` — empty state with icon, title, description (~15 lines)
- [ ] 4.10 Create `src/__tests__/EmptyState.test.tsx` — component tests: renders icon, title, description (~20 lines)
- [ ] 4.11 Create `src/components/layout/Sidebar.tsx` — navigation sidebar with role-based links (ADMIN: Dashboard, Products, Orders, Low Stock; OPERATOR: Dashboard, Products, Orders), active route highlight, collapse on tablet/mobile (~60 lines)
- [ ] 4.12 Create `src/__tests__/Sidebar.test.tsx` — component tests: renders ADMIN links, renders OPERATOR links (mock auth store), highlights active route (~50 lines)
- [ ] 4.13 Create `src/components/layout/Header.tsx` — header showing user email, role badge, logout button (~30 lines)
- [ ] 4.14 Create `src/__tests__/Header.test.tsx` — component tests: displays user email, renders logout button, fires logout on click (~35 lines)
- [ ] 4.15 Create `src/components/layout/AppShell.tsx` — layout wrapper composing Sidebar + Header + `<Outlet />`, responsive grid layout (~30 lines)
- [ ] 4.16 Verify: `bun run build` passes; components render without errors in dev
- [ ] 4.17 Verify: `bun run test` passes — all UI component tests green

**Dependencies**: Phase 3 (auth store for Sidebar/Header).
**Estimated lines**: ~465

## Phase 5: Auth Features

- [ ] 5.1 Create `src/features/auth/schemas/auth.schema.ts` — Zod schemas for login (`email` + `password`) and register (`email` + `password` + `confirmPassword` with refinement) (~30 lines)
- [ ] 5.2 Create `src/__tests__/auth.schema.test.ts` — schema tests: valid login parses, invalid email rejects, missing password rejects, register passwords must match, short password rejects (~40 lines)
- [ ] 5.3 Create `src/features/auth/hooks/useLogin.ts` — TanStack `useMutation` calling `POST /api/auth/login`, stores token via `authStore.login()`, navigates to `/dashboard` on success (~25 lines)
- [ ] 5.4 Create `src/__tests__/useLogin.test.ts` — hook tests with mocked API: success stores token + navigates, error sets error state, loading state transitions (~45 lines)
- [ ] 5.5 Create `src/features/auth/hooks/useRegister.ts` — TanStack `useMutation` calling `POST /api/auth/register`, navigates to `/login` on success (~20 lines)
- [ ] 5.6 Create `src/__tests__/useRegister.test.ts` — hook tests with mocked API: success navigates to login, error sets error state (~35 lines)
- [ ] 5.7 Create `src/features/auth/pages/LoginPage.tsx` — login form using React Hook Form + Zod resolver, error display, loading state, GuestOnly guard wrapper (~50 lines)
- [ ] 5.8 Create `src/__tests__/LoginPage.test.tsx` — component tests: renders form fields, validates on submit, displays API errors, shows loading during mutation (~55 lines)
- [ ] 5.9 Create `src/features/auth/pages/RegisterPage.tsx` — register form with confirm password, validation errors, loading state, GuestOnly guard wrapper (~50 lines)
- [ ] 5.10 Create `src/__tests__/RegisterPage.test.tsx` — component tests: renders form fields, validates password match, displays validation errors, shows loading (~55 lines)
- [ ] 5.11 Verify: `bun run build` passes; `/login` and `/register` render with forms
- [ ] 5.12 Verify: `bun run test` passes — all auth tests green

**Dependencies**: Phase 4 (Button, Input, Card, GuestOnly guard).
**Estimated lines**: ~445

## Phase 6: Router + Data Hooks + Feature Pages

- [ ] 6.1 Create `src/features/products/hooks/useProducts.ts` — TanStack `useQuery` for `GET /api/products` with `search` and `categoryId` params (~20 lines)
- [ ] 6.2 Create `src/__tests__/useProducts.test.ts` — hook tests with mocked API: loading state, success returns data, error state, search param filtering (~40 lines)
- [ ] 6.3 Create `src/features/orders/hooks/useOrders.ts` — TanStack `useQuery` for `GET /api/orders` with `status` param (~15 lines)
- [ ] 6.4 Create `src/__tests__/useOrders.test.ts` — hook tests with mocked API: loading state, success, status filter param (~30 lines)
- [ ] 6.5 Create `src/features/orders/hooks/useOrderDetail.ts` — TanStack `useQuery` for `GET /api/orders/:id` (~15 lines)
- [ ] 6.6 Create `src/features/reports/hooks/useLowStock.ts` — TanStack `useQuery` for `GET /api/reports/low-stock` (~10 lines)
- [ ] 6.7 Create `src/__tests__/useLowStock.test.ts` — hook tests with mocked API: loading, success, error (~25 lines)
- [ ] 6.8 Create `src/features/dashboard/pages/DashboardPage.tsx` — role-aware cards (ADMIN: total products, low-stock count, pending orders + quick actions; OPERATOR: own pending orders + quick action), skeleton loading per card (~70 lines)
- [ ] 6.9 Create `src/__tests__/DashboardPage.test.tsx` — component tests: renders ADMIN cards, renders OPERATOR cards, shows skeleton during loading (~45 lines)
- [ ] 6.10 Create `src/features/products/pages/ProductListPage.tsx` — table with search input (debounced), category filter dropdown, stock severity indicators, loading skeleton, empty state (~80 lines)
- [ ] 6.11 Create `src/__tests__/ProductListPage.test.tsx` — component tests: renders product table, shows empty state, displays search input, shows loading skeleton (~50 lines)
- [ ] 6.12 Create `src/features/orders/pages/OrderListPage.tsx` — table with status filter tabs, status badges (yellow/green/red), loading skeleton, empty state (~60 lines)
- [ ] 6.13 Create `src/__tests__/OrderListPage.test.tsx` — component tests: renders order table, shows status tabs, displays badges, empty state (~45 lines)
- [ ] 6.14 Create `src/features/orders/pages/OrderDetailPage.tsx` — order metadata + items table, 404 state, loading skeleton (~50 lines)
- [ ] 6.15 Create `src/features/reports/pages/LowStockPage.tsx` — admin-only low-stock table, severity indicators (red critical / orange warning), product link, empty state, RequireRole guard (~50 lines)
- [ ] 6.16 Create `src/App.tsx` — full route tree: `/login` (GuestOnly), `/register` (GuestOnly), protected routes nested under AppShell with RequireAuth: `/dashboard`, `/products`, `/orders`, `/orders/:id`, `/reports/low-stock` (RequireRole ADMIN) (~45 lines)
- [ ] 6.17 Create `src/__tests__/App.integration.test.tsx` — integration test: full auth flow (login → dashboard → logout), route guards block unauthorized access, role-based navigation (~70 lines)
- [ ] 6.18 Verify: `bun run build` passes; all routes render, auth flow works end-to-end
- [ ] 6.19 Verify: `bun run test` passes — all hook, page, and integration tests green

**Dependencies**: Phase 5 (auth hooks + pages), Phase 4 (layout + UI components).
**Estimated lines**: ~695

## Phase 7: Polish

- [ ] 7.1 Add error boundaries: create `src/components/ErrorBoundary.tsx` and wrap router in `src/main.tsx` (~25 lines)
- [ ] 7.2 Create `src/__tests__/ErrorBoundary.test.tsx` — component tests: catches thrown errors, renders fallback UI, recovers on retry (~30 lines)
- [ ] 7.3 Add 404 page: create `src/components/NotFoundPage.tsx` for unmatched routes (~15 lines)
- [ ] 7.4 Create `src/__tests__/NotFoundPage.test.tsx` — component tests: renders 404 message, has link back to dashboard (~15 lines)
- [ ] 7.5 Final verification: `bun run test` — all tests pass
- [ ] 7.6 Verify: `bun run build` + `bun run dev` — all pages render, login/logout flow works, role guards redirect correctly, API interceptors fire

**Dependencies**: Phase 6.
**Estimated lines**: ~120

## Summary

| Phase | Tasks | Estimated Lines | Focus |
|-------|-------|----------------|-------|
| Phase 1 | 12 | ~178 | Project init + test setup |
| Phase 2 | 9 | ~205 | Foundation (types, utils, Tailwind) + utils/smoke tests |
| Phase 3 | 13 | ~365 | Infrastructure (API, stores, guards) + unit/component tests |
| Phase 4 | 17 | ~465 | Layout + UI components + component tests |
| Phase 5 | 12 | ~445 | Auth features + schema/hook/component tests |
| Phase 6 | 19 | ~695 | Router + data hooks + pages + hook/component/integration tests |
| Phase 7 | 6 | ~120 | Polish + error boundary/404 tests + final verification |
| **Total** | **88** | **~2,473** | |
