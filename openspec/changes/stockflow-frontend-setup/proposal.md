# Proposal: StockFlow Web — Project Scaffolding

## Intent

Initialize the entire frontend infrastructure for StockFlow Web — a greenfield React SPA consuming an existing Express REST API. The backend is complete with JWT auth, product CRUD, order management, and reports. This change establishes the project skeleton, tooling, auth flow, routing, layout, and API integration layer so all subsequent feature work lands on solid foundations.

## Scope

### In Scope
- Vite + React 19 + TypeScript project init (`bun create vite`)
- All confirmed dependencies installed via Bun
- Biome config (formatting + linting)
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Feature-based folder structure (`src/features/`, `src/lib/`, `src/stores/`, `src/components/`)
- Axios client with JWT interceptor (request injection + 401 handling)
- Zustand auth store (token + user, persisted to `sessionStorage`)
- Zustand UI store (sidebar state, loading overlays)
- React Router v7 with route guards (`RequireAuth`, `RequireRole`, `GuestOnly`)
- Layout components: AppShell, Sidebar, Header
- TanStack Query provider setup
- Shared TypeScript types matching `doc/API_CONTRACT.md`
- TanStack Query hooks for all API endpoints (auth, products, orders, reports)
- Zod schemas for login, register, product form, order form
- Placeholder pages: Login, Register, Dashboard, ProductList, OrderList, OrderDetail, LowStock
- `react-hot-toast` Toaster provider
- `lucide-react` icon integration
- Environment config (`VITE_API_URL`)

### Out of Scope
- Full form implementations (create/edit products, order creation flow)
- Dashboard charts or advanced statistics
- Test setup (Vitest, testing-library, Cypress)
- Deployment config (Docker, CI/CD, Netlify)
- User management (admin panel for user CRUD)
- Offline mode, PWA, or service workers
- i18n / localization

## Capabilities

### New Capabilities
- `auth`: JWT authentication flow — login, register, token persistence, route guards, role-based access
- `api-client`: Axios instance with interceptors, typed response wrappers, error normalization
- `layout`: App shell with sidebar navigation, header with user info, responsive shell
- `products-read`: Product list with search, category filter, low-stock indicator (read-only views)
- `orders-read`: Order list with status filter, order detail view (read-only views)
- `dashboard`: Role-aware dashboard with summary cards
- `reports-low-stock`: Admin-only low-stock report view

### Modified Capabilities
None — this is the initial scaffolding. No existing specs to modify.

## Approach

Incremental build order, each step producing a working layer:

1. **Scaffold** — `bun create vite`, install deps, configure Biome + Tailwind v4
2. **Foundation** — Types, API client, env config, Zustand stores
3. **Auth** — Login/Register pages, auth store, route guards, Toaster
4. **Layout** — AppShell, Sidebar, Header, responsive behavior
5. **Routing** — Full route tree with nested layouts and guards
6. **Server State** — TanStack Query hooks for all endpoints
7. **Placeholder Pages** — Dashboard, Products, Orders, Reports (wireframe quality)
8. **Polish** — Loading states, empty states, error boundaries, 404 page

Each step is independently verifiable (`bun run build` passes, `bun run dev` shows working screens).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/api.ts` | New | Axios instance with JWT interceptors |
| `src/lib/constants.ts` | New | API URLs, role enums, status enums |
| `src/lib/utils.ts` | New | formatDate, formatCurrency, cn() helper |
| `src/stores/auth.store.ts` | New | Zustand store — token, user, login/logout, persist |
| `src/stores/ui.store.ts` | New | Zustand store — sidebar state, loading |
| `src/components/guards/` | New | RequireAuth, RequireRole, GuestOnly |
| `src/components/layout/` | New | AppShell, Sidebar, Header |
| `src/components/ui/` | New | Button, Input, Card, Badge, Skeleton, EmptyState |
| `src/features/auth/` | New | Login/Register pages, schemas, API calls |
| `src/features/products/` | New | ProductList page, hooks, types |
| `src/features/orders/` | New | OrderList, OrderDetail pages, hooks, types |
| `src/features/reports/` | New | LowStock page |
| `src/features/dashboard/` | New | DashboardPage with role-aware cards |
| `src/App.tsx` | New | Router tree with all routes + guards |
| `src/main.tsx` | New | Entry point, providers |
| `src/index.css` | New | Tailwind v4 import + theme |
| `vite.config.ts` | New | Vite + Tailwind plugin |
| `biome.json` | New | Linting + formatting config |
| `tsconfig.json` | New | TypeScript strict config |
| `.env.example` | New | VITE_API_URL reference |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tailwind v4 API changes or plugin bugs | Low | Fall back to Tailwind v3 + PostCSS config |
| React Router v7 SPA loader limitations | Medium | Use TanStack Query for child route data fetching |
| `sessionStorage` cleared on tab close | Medium | Expected behavior for internal tool; document it |
| No refresh token — forced re-login on 401 | Medium | Backend scope; interceptor handles gracefully with redirect |
| Bundle size from multiple deps (~40KB gzipped) | Low | All libs are tree-shakeable; acceptable for dashboard |

## Rollback Plan

1. `git log --oneline` to find the commit before scaffolding
2. `git revert <commit-hash>` — reverts all scaffolding changes
3. No database migrations involved (backend unchanged)
4. No data to lose — this is greenfield initialization
5. Alternative: delete the branch and recreate from `main`

## Dependencies

- Backend API running at `http://localhost:3000` (already implemented)
- Bun package manager (confirmed available)
- Node.js 18+ (Vite 6 requirement)

## Success Criteria

- [ ] `bun install` completes without errors
- [ ] `bun run dev` starts Vite dev server
- [ ] `bun run build` produces production build
- [ ] Login page renders at `/login` with form
- [ ] Register page renders at `/register` with form
- [ ] Dashboard renders at `/dashboard` (behind auth guard)
- [ ] Sidebar shows role-appropriate navigation links
- [ ] 401 from API redirects to `/login`
- [ ] JWT token persists across page refresh (sessionStorage)
- [ ] All placeholder pages render without errors
- [ ] Biome formats/lints all source files cleanly
- [ ] TypeScript compiles with zero errors
