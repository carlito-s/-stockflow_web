# StockFlow Web

Frontend SPA para el sistema de gestión de logística y despacho StockFlow. Consume la API REST de `stockflow_api`.

## Stack

- **Framework**: React 19 + TypeScript + Vite 6
- **Routing**: React Router v7 (SPA mode)
- **State**: Zustand (auth/UI) + TanStack Query (server data)
- **HTTP**: Axios con interceptores JWT
- **Forms**: React Hook Form + Zod
- **Estilos**: Tailwind CSS v4 (CSS-first)
- **Linting**: Biome (reemplaza ESLint + Prettier)
- **Tests**: Vitest + React Testing Library
- **Package manager**: Bun

## Inicio

```bash
bun install
bun run dev
```

El dev server arranca en `http://localhost:5173`. La API debe correr en `http://localhost:3000`.

## Comandos

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Dev server con hot-reload |
| `bun run build` | Build de producción |
| `bun run test` | Ejecutar tests |
| `bun run test:watch` | Tests en watch mode |
| `bun run lint` | Lint con Biome |
| `bun run format` | Formatear código con Biome |

## Arquitectura

Feature-based architecture. Cada dominio (`auth`, `products`, `orders`, `reports`, `dashboard`) es autocontenido con sus propios componentes, hooks, schemas y tipos.

```
src/
├── app/                  # Entry point, router, providers
├── features/             # Domain features (cada uno autocontenido)
│   ├── auth/             # Login, register, schemas Zod, hooks useLogin/useRegister
│   ├── products/         # Lista de productos, hook useProducts
│   ├── orders/           # Lista y detalle de pedidos, hooks useOrders/useOrderDetail
│   ├── reports/          # Reporte de stock bajo, hook useLowStock
│   └── dashboard/        # Dashboard con métricas por rol
├── shared/
│   ├── components/
│   │   ├── ui/           # Button, Input, Card, Badge, Skeleton, EmptyState
│   │   └── layout/       # Sidebar, Header, AppShell
│   ├── hooks/
│   ├── lib/              # cn() (clsx + tailwind-merge), utils
│   └── types/            # Tipos de la API (User, Product, Order, etc.)
├── stores/               # Zustand stores (auth con sessionStorage, ui)
├── config/               # Cliente Axios con interceptores JWT
├── components/guards/    # RequireAuth, RequireRole, GuestOnly
└── index.css             # Tailwind v4 con theme tokens custom
```

## Roles

- **ADMIN**: CRUD de productos, gestión total de pedidos, reportes de stock bajo
- **OPERATOR**: Ver productos, crear pedidos, gestionar sus propios pedidos

## Configuración

Copiar `.env.example` a `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Testing

Tests co-localizados con el código que testean (convención moderna Vitest). Ejecutar `bun run test` para ver todos los tests o `bun run test:watch` para desarrollo.
