# Exploration: StockFlow Web Frontend — Technical Approach

## Current State

The `stockflow_web` project is brand new — empty directory with only `openspec/`, `.atl/`, `.git/`, and `doc/`. No source code, no dependencies, no configuration.

The backend (`stockflow_api`) is a fully implemented Express REST API with:
- JWT auth with roles (`ADMIN`, `OPERATOR`)
- Product CRUD, Order management, Reports
- Zod validation, Prisma ORM, SQLite
- Layered architecture (Routes → Controllers → Services → Prisma)
- Standard response format: `{ status: "success"|"fail"|"error", data?: {...}, message?: string }`

## Affected Areas

- `D:\DEV\VSCode\WebProjects\stockflow_web\` — entire project (greenfield)
- Backend API contract at `stockflow_api/docs/API_REFERENCE.md` — 15 endpoints to integrate with

---

## Decision 1: Routing — react-router-dom v7

| Approach | Pros | Cons | Complexity |
|----------|------|------|------------|
| **React Router v7 (library mode)** | Official React team router, SPA mode with `ssr: false`, route loaders for data prefetching, built-in redirect helpers, middleware-like auth guards, file-based routing optional | Steeper learning curve than v6, SPA mode has loader limitations (only root route loader works) | Medium |
| **React Router v6** | Stable, well-documented, simpler API | No official SPA mode, no built-in loaders, fewer features | Low |
| **TanStack Router** | Type-safe routes, file-based routing, excellent DX, built-in search params validation | Newer, smaller ecosystem, heavier | High |
| **Wouter** | Minimal (~1.5KB), simple API | No loaders, no guards, limited ecosystem | Low |

### Recommendation: **React Router v7 (library mode, SPA)**

Use `react-router` v7 in library mode with `ssr: false`. This gives us:
- `<Routes>` + `<Route>` with nested layout routes
- `loader` on root route for initial auth check
- `redirect()` for unauthenticated users
- `Navigate` component for role-based redirects
- Clean integration with Vite

**Auth guard pattern:**
```tsx
// Protected route wrapper
function RequireAuth({ children, allowedRoles }: Props) {
  const { user, token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}
```

**Risk**: v7 SPA mode loader limitation — only root route can use `loader`. Workaround: use Zustand for data fetching in child routes, or use TanStack Query for server state. Not a blocker.

---

## Decision 2: State Management — Zustand

| Approach | Pros | Cons | Complexity |
|----------|------|------|------------|
| **Zustand** | Minimal boilerplate, `persist` middleware for localStorage, no providers needed, excellent TypeScript support, tiny bundle (~1KB), works outside React | No devtools by default (needs middleware), community smaller than Redux | Low |
| **React Context + useReducer** | Zero dependencies, built-in | Re-renders entire tree on state change, no persistence, boilerplate for complex state, no middleware | Low |
| **Jotai** | Atomic state, granular re-renders, good for forms | Mental model shift, less suited for auth/UI state, smaller ecosystem | Medium |
| **Redux Toolkit** | Devtools, middleware ecosystem, battle-tested | Heavy for this scope, verbose, overkill for auth + UI state | High |

### Recommendation: **Zustand**

Split into two focused stores:

1. **`useAuthStore`** — JWT token, user data, login/logout actions, `persist` middleware to `sessionStorage`
2. **`useUIStore`** — sidebar state, theme, toast queue, loading overlays

**Why Zustand wins here:**
- Auth state is read everywhere (route guards, nav, API calls) — Zustand's selector pattern avoids unnecessary re-renders
- `persist` middleware handles token persistence without manual `localStorage` calls
- No `<Provider>` wrapper — simpler app bootstrap
- Token + user data persist across page refreshes via `sessionStorage` (not `localStorage` for security)

**Risk**: Token exposure in `sessionStorage` — acceptable for this SPA scope. XSS risk is standard for any SPA; mitigated by `httpOnly` cookies if the backend supports it later.

---

## Decision 3: HTTP Client — Axios

| Approach | Pros | Cons | Complexity |
|----------|------|------|------------|
| **Axios** | Interceptors for auth headers, automatic JSON parsing, request/response transforms, error handling with typed responses, retry logic built-in | Larger bundle (~13KB), API is Promise-based (not Fetch API) | Low |
| **Native fetch + wrapper** | Zero dependencies, standard API | No interceptors (must manually add headers), verbose error handling, no automatic JSON parsing, no request cancellation built-in | Medium |
| **ky** | Modern, small, interceptors, retry | Smaller ecosystem, less mature | Low |

### Recommendation: **Axios**

Create a typed API client with:
- Base URL from env: `VITE_API_URL=http://localhost:3000/api`
- Request interceptor: inject `Authorization: Bearer <token>` from Zustand store
- Response interceptor: handle 401 → redirect to login, handle 403 → show toast
- Typed responses matching backend contract (`{ status, data, message }`)

```typescript
// src/lib/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
```

**Risk**: Low. Axios is the industry standard for React SPAs. The interceptor pattern is battle-tested.

---

## Decision 4: Styling — Tailwind CSS v4

| Approach | Pros | Cons | Complexity |
|----------|------|------|------------|
| **Tailwind CSS v4** | Zero-config with Vite plugin, no `tailwind.config.js` needed, CSS-first config via `@theme`, utility-first, small production CSS, dark mode built-in | Utility classes can clutter JSX, learning curve for CSS fundamentals, verbose class strings | Low |
| **CSS Modules** | Scoped by default, no runtime, standard CSS | No utility classes, verbose for layouts, manual responsive breakpoints, no design system | Low |
| **styled-components** | Dynamic styles, CSS-in-JS, no class conflicts | Runtime overhead, larger bundle, harder to debug, SSR complexity | Medium |
| **shadcn/ui + Tailwind** | Pre-built components, consistent design, accessible | Opinionated, may not match project design, adds component library dependency | Medium |

### Recommendation: **Tailwind CSS v4**

With `@tailwindcss/vite` plugin — zero config:
```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ plugins: [tailwindcss()] });
```

```css
/* src/index.css */
@import "tailwindcss";
```

**Why Tailwind v4 wins:**
- Vite plugin eliminates PostCSS config
- No `tailwind.config.js` — theme customization via `@theme` in CSS
- Utility-first matches rapid prototyping for dashboard UIs
- Responsive design (`sm:`, `md:`, `lg:`) for desktop + tablet requirement
- Dark mode via `dark:` variant if needed later
- Pair with `clsx` + `tailwind-merge` for conditional classes

**Risk**: Tailwind v4 is stable but newer. If compatibility issues arise, fall back to v3 PostCSS setup. Low risk since the API is mostly the same.

---

## Decision 5: Forms — React Hook Form + Zod

| Approach | Pros | Cons | Complexity |
|----------|------|------|------------|
| **React Hook Form + Zod** | Minimal re-renders (uncontrolled), Zod schema reuse with backend validators, `@hookform/resolvers` for Zod integration, built-in error handling, excellent TS support | Slightly verbose setup, learning curve for `register`/`watch`/`control` patterns | Medium |
| **Native forms + Zod** | No dependencies, standard React | Manual state management, verbose validation wiring, more re-renders | Low |
| **Formik + Yup** | Mature, good DX | Heavier, re-renders on every keystroke, Yup is less typed than Zod | Medium |
| **Conform** | Progressive enhancement, server actions ready | Newer, smaller ecosystem, overkill for SPA | High |

### Recommendation: **React Hook Form + Zod**

Reuse Zod schemas from the backend where possible (shared types):
```typescript
// src/features/auth/schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

```tsx
// Login form
const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
```

**Why RHF + Zod wins:**
- Zod is already in the backend — shared validation logic
- Uncontrolled inputs = fewer re-renders (important for forms with many fields like order creation)
- `formState.errors` maps cleanly to backend error responses
- `useFieldArray` for dynamic order items (add/remove products)

**Risk**: Low. RHF is the most popular React form library. Zod integration is official via `@hookform/resolvers`.

---

## Decision 6: Project Structure — Feature-Based

| Approach | Pros | Cons | Complexity |
|----------|------|------|------------|
| **Feature-based** (recommended) | Colocated concerns, easy to delete/extract features, clear ownership, scales well | Initial setup requires discipline, cross-feature imports need care | Medium |
| **Layer-based** (components/, services/, types/) | Simple to understand, familiar pattern | Features scattered across folders, hard to refactor, imports become tangled | Low |
| **Domain-driven** | Matches business domains, good for large teams | Overkill for this project scope, too much abstraction | High |

### Recommended Folder Structure

```
stockflow_web/
├── public/
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Router + layout
│   ├── index.css                   # Tailwind imports
│   │
│   ├── lib/                        # Shared utilities
│   │   ├── api.ts                  # Axios instance + interceptors
│   │   ├── constants.ts            # API URLs, roles, statuses
│   │   └── utils.ts                # formatDate, formatCurrency, etc.
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── auth.store.ts           # Token + user + login/logout
│   │   └── ui.store.ts             # Sidebar, toasts, loading
│   │
│   ├── components/                 # Shared UI components
│   │   ├── ui/                     # Atoms: Button, Input, Modal, etc.
│   │   ├── layout/                 # AppShell, Sidebar, Header
│   │   └── guards/                 # RequireAuth, RequireRole
│   │
│   └── features/                   # Feature modules
│       ├── auth/
│       │   ├── pages/
│       │   │   ├── LoginPage.tsx
│       │   │   └── RegisterPage.tsx
│       │   ├── schemas.ts
│       │   └── api.ts              # Auth-specific API calls
│       │
│       ├── products/
│       │   ├── pages/
│       │   │   ├── ProductListPage.tsx
│       │   │   ├── ProductFormPage.tsx
│       │   │   └── ProductDetailPage.tsx
│       │   ├── components/
│       │   │   ├── ProductTable.tsx
│       │   │   └── ProductForm.tsx
│       │   ├── hooks/
│       │   │   └── useProducts.ts
│       │   ├── schemas.ts
│       │   └── api.ts
│       │
│       ├── orders/
│       │   ├── pages/
│       │   │   ├── OrderListPage.tsx
│       │   │   ├── OrderFormPage.tsx
│       │   │   └── OrderDetailPage.tsx
│       │   ├── components/
│       │   │   ├── OrderTable.tsx
│       │   │   ├── OrderForm.tsx
│       │   │   └── OrderStatusBadge.tsx
│       │   ├── hooks/
│       │   │   └── useOrders.ts
│       │   ├── schemas.ts
│       │   └── api.ts
│       │
│       ├── reports/
│       │   ├── pages/
│       │   │   └── LowStockPage.tsx
│       │   ├── components/
│       │   │   └── LowStockTable.tsx
│       │   └── api.ts
│       │
│       └── dashboard/
│           ├── pages/
│           │   └── DashboardPage.tsx
│           └── components/
│               ├── StatsCards.tsx
│               └── RecentOrders.tsx
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── bun.lock
```

**Why feature-based wins:**
- Each feature is self-contained: pages, components, hooks, API, schemas
- Easy to add/remove features without touching unrelated code
- `features/auth/api.ts` vs `lib/api.ts` — feature-specific calls colocated with usage
- Hooks like `useProducts` encapsulate data fetching + caching logic
- Scales naturally as new features are added

---

## Decision 7: Auth Flow

### JWT Storage Strategy

| Strategy | Security | Persistence | Complexity |
|----------|----------|-------------|------------|
| **`sessionStorage` via Zustand persist** | Better than localStorage (clears on tab close) | Survives refresh, not cross-tab | Low |
| `localStorage` via Zustand persist | XSS vulnerable, persists forever | Survives everything | Low |
| `httpOnly` cookie | Best (not accessible via JS) | Depends on backend support | High |
| In-memory only (no persistence) | Most secure | Loses state on refresh | Low |

### Recommendation: **`sessionStorage` via Zustand `persist`**

```typescript
// auth.store.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (credentials) => {
        const { data } = await authApi.login(credentials);
        set({ token: data.token, user: data.user });
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'stockflow-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
```

### Token Refresh

The backend doesn't implement refresh tokens (JWT only). Strategy:
1. On 401 response, interceptor clears store and redirects to `/login`
2. No silent refresh — user re-authenticates
3. Future enhancement: add refresh token endpoint to backend

### Route Guards

Three guard levels:
1. **`RequireAuth`** — must be logged in (redirects to `/login`)
2. **`RequireRole`** — must have specific role (redirects to `/unauthorized`)
3. **`GuestOnly`** — must NOT be logged in (redirects to `/dashboard`)

```tsx
// src/components/guards/RequireAuth.tsx
export function RequireAuth({ children, roles }: { children: React.ReactNode; roles?: Role[] }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

// src/components/guards/GuestOnly.tsx
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
```

### Route Configuration

```tsx
// src/App.tsx
<BrowserRouter>
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
    <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />

    {/* Protected routes */}
    <Route element={<RequireAuth><AppShell /></RequireAuth>}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/new" element={<RequireRole roles={['ADMIN']}><ProductFormPage /></RequireRole>} />
      <Route path="/products/:id/edit" element={<RequireRole roles={['ADMIN']}><ProductFormPage /></RequireRole>} />
      <Route path="/orders" element={<OrderListPage />} />
      <Route path="/orders/new" element={<OrderFormPage />} />
      <Route path="/orders/:id" element={<OrderDetailPage />} />
      <Route path="/reports/low-stock" element={<RequireRole roles={['ADMIN']}><LowStockPage /></RequireRole>} />
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
</BrowserRouter>
```

**Risk**: Medium — `sessionStorage` is cleared on tab close, which may surprise users. Acceptable for this use case (internal inventory tool).

---

## Decision 8: Additional Libraries

| Library | Purpose | Why |
|---------|---------|-----|
| **@tanstack/react-query** | Server state caching, refetching, optimistic updates | Avoids manual loading/error states for every API call. Pairs with Zustand (Zustand for client state, Query for server state) |
| **react-hot-toast** | Toast notifications | Lightweight, good defaults, responsive |
| **clsx + tailwind-merge** | Conditional class names | Clean up ternary expressions in JSX |
| **date-fns** | Date formatting | Tree-shakeable, better than moment.js |
| **lucide-react** | Icons | Consistent icon set, tree-shakeable |

**TanStack Query is the key addition** — it handles:
- Loading/error/success states automatically
- Background refetching for real-time data (product stock, order status)
- Cache invalidation after mutations (create/edit/delete)
- Deduplication of simultaneous requests

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Tailwind v4 compatibility issues | Low | Medium | Fall back to Tailwind v3 with PostCSS |
| React Router v7 SPA loader limitations | Medium | Low | Use TanStack Query for child route data |
| Token security (sessionStorage) | Low | Medium | Acceptable for internal tool; upgrade to httpOnly cookies later |
| Zustand persist + sessionStorage data loss on tab close | Medium | Low | Expected behavior; inform users |
| No refresh token — forced re-login on expiry | Medium | Low | Backend scope; add refresh endpoint later |
| Bundle size (Axios + RHF + TanStack Query) | Low | Low | Total ~40KB gzipped; acceptable for dashboard |

---

## Summary of Recommendations

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Routing | React Router v7 (SPA mode) | Official, supports guards, loaders |
| State | Zustand (auth + UI stores) | Minimal, persist middleware, no providers |
| HTTP | Axios with interceptors | Auth injection, error handling, typed |
| Styling | Tailwind CSS v4 + `@tailwindcss/vite` | Zero config, utility-first, responsive |
| Forms | React Hook Form + Zod | Minimal re-renders, shared validation |
| Structure | Feature-based (`features/auth/`, `features/products/`, etc.) | Scalable, colocated concerns |
| Auth | `sessionStorage` + route guards + Zustand persist | Secure enough, survives refresh |
| Server State | TanStack Query | Caching, refetching, mutation invalidation |
| Toasts | react-hot-toast | Lightweight, good defaults |
| Icons | lucide-react | Consistent, tree-shakeable |

---

## Ready for Proposal

Yes. All 7 decision points have clear recommendations with supporting rationale. The orchestrator should proceed to `sdd-propose` with these choices. Key items for the proposal:
1. Scaffold with `bun create vite stockflow_web --template react-ts`
2. Install: `react-router`, `zustand`, `axios`, `@tanstack/react-query`, `tailwindcss`, `@tailwindcss/vite`, `react-hook-form`, `@hookform/resolvers`, `zod`, `react-hot-toast`, `clsx`, `tailwind-merge`, `lucide-react`, `date-fns`
3. Build incrementally: Auth → Layout → Dashboard → Products → Orders → Reports
