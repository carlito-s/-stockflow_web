# Requerimientos — StockFlow Web

## 1. Visión General

Sistema de gestión de logística y despacho. Frontend web que consume la API REST de StockFlow.

**API Base URL**: `http://localhost:3000/api`

---

## 2. Roles de Usuario

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **ADMIN** | Administrador del sistema | CRUD de productos, gestión total de pedidos, reportes |
| **OPERATOR** | Operador de despacho | Ver productos, crear pedidos, ver/marcar sus propios pedidos |

### Restricciones por rol

| Acción | ADMIN | OPERATOR |
|--------|-------|----------|
| Login | ✅ | ✅ |
| Ver productos | ✅ | ✅ |
| Crear producto | ✅ | ❌ |
| Editar producto | ✅ | ❌ |
| Eliminar producto | ✅ | ❌ |
| Crear pedido | ✅ | ✅ |
| Ver todos los pedidos | ✅ | ❌ (solo los propios) |
| Ver detalle de pedido | ✅ | ✅ (solo los propios) |
| Cambiar estado de pedido | ✅ | ✅ (solo los propios) |
| Ver reportes | ✅ | ❌ |

---

## 3. Pantallas / Módulos

### 3.1 Autenticación

#### Login
- **Ruta**: `/login`
- **Formulario**: email + contraseña
- **Endpoint**: `POST /api/auth/login`
- **Request**: `{ email, password }`
- **Response**: `{ token, user: { id, email, role } }`
- **Comportamiento**:
  - Guardar JWT en localStorage (o cookie httpOnly)
  - Redirigir a `/dashboard` según rol
  - Mostrar error si credenciales inválidas

#### Registro
- **Ruta**: `/register`
- **Formulario**: email + contraseña + confirmar contraseña
- **Endpoint**: `POST /api/auth/register`
- **Request**: `{ email, password, role? }` (role default: OPERATOR)
- **Response**: `{ user: { id, email, role } }`
- **Comportamiento**:
  - Solo accessible para usuarios nuevos
  - Después del registro, redirigir al login
  - Validar que contraseña y confirmación coincidan

### 3.2 Dashboard

- **Ruta**: `/dashboard`
- **Descripción**: Vista resumen según rol
- **Para ADMIN**:
  - Total de productos
  - Productos con stock bajo (preview del reporte)
  - Pedidos pendientes
  - Accesos rápidos a crear producto/pedido
- **Para OPERATOR**:
  - Mis pedidos pendientes
  - Acceso rápido a crear pedido
  - Listado de productos disponibles

### 3.3 Productos

#### Listado de Productos
- **Ruta**: `/products`
- **Endpoint**: `GET /api/products`
- **Query params**: `?categoryId=uuid&search=text`
- **Response**: `{ count, products: [...] }`
- **Funcionalidades**:
  - Tabla con: nombre, SKU, stock actual, stock mínimo, precio, categoría
  - Búsqueda por texto (nombre o SKU)
  - Filtro por categoría
  - Indicador visual de stock bajo (stock <= minStock)
  - Botón "Crear producto" (solo ADMIN)
  - Acciones por fila: editar, eliminar (solo ADMIN)

#### Crear/Editar Producto
- **Ruta**: `/products/new` o `/products/:id/edit`
- **Endpoint POST**: `POST /api/products` (ADMIN)
- **Endpoint PUT**: `PUT /api/products/:id` (ADMIN)
- **Campos del formulario**:
  - Nombre (string, 2-100 chars)
  - SKU (string, 3-50 chars, formato: `^[A-Z0-9-]+$`)
  - Stock (entero, >= 0)
  - Stock mínimo (entero, >= 0)
  - Precio (número positivo)
  - Categoría (select con opciones de `GET /api/categories` o hardcodeadas)
- **Validación**: replicar las reglas Zod del backend
- **Comportamiento**:
  - En modo edición, pre-cargar los datos actuales
  - Confirmación antes de eliminar
  - Toast de éxito/error

### 3.4 Pedidos

#### Listado de Pedidos
- **Ruta**: `/orders`
- **Endpoint**: `GET /api/orders`
- **Query params**: `?status=PENDING|DISPATCHED|CANCELLED`
- **Response**: `{ count, orders: [...] }`
- **Funcionalidades**:
  - Para ADMIN: todos los pedidos del sistema
  - Para OPERATOR: solo sus pedidos
  - Filtro por estado (tabs o dropdown)
  - Columnas: ID (abreviado), operador, fecha, estado, total items
  - Badge de estado con colores:
    - `PENDING` → amarillo
    - `DISPATCHED` → verde
    - `CANCELLED` → rojo
  - Click en fila → detalle del pedido

#### Crear Pedido
- **Ruta**: `/orders/new`
- **Endpoint**: `POST /api/orders`
- **Request**: `{ items: [{ productId, quantity }] }`
- **Funcionalidades**:
  - Selector de productos (con búsqueda)
  - Agregar múltiples productos al pedido
  - Cantidad por producto (entero positivo)
  - No permitir productos duplicados
  - Validar que quantity > 0
  - Mostrar resumen antes de confirmar
  - Éxito: redirigir al detalle del pedido creado

#### Detalle de Pedido
- **Ruta**: `/orders/:id`
- **Endpoint**: `GET /api/orders/:id`
- **Response**: `{ order: { id, operatorId, status, createdAt, items: [...] } }`
- **Funcionalidades**:
  - Info del pedido: ID, operador, fecha, estado
  - Tabla de items: producto, cantidad, precio al momento de la orden
  - Botones de acción según estado:
    - Si `PENDING` → "Despachar" y "Cancelar"
    - Si `DISPATCHED` o `CANCELLED` → sin acciones
  - Endpoint para cambiar estado: `PATCH /api/orders/:id/status`
  - Request: `{ status: "DISPATCHED" | "CANCELLED" }`

### 3.5 Reportes

#### Reporte de Stock Bajo
- **Ruta**: `/reports/low-stock`
- **Endpoint**: `GET /api/reports/low-stock`
- **Acceso**: solo ADMIN
- **Response**: lista de productos donde `stock <= minStock`
- **Funcionalidades**:
  - Tabla con: nombre, SKU, stock actual, stock mínimo, diferencia
  - Indicador visual de severidad (rojo si stock = 0, naranja si <= minStock)
  - Botón para ir al producto y actualizar stock

---

## 4. Requisitos Transversales

### 4.1 Autenticación
- JWT almacenado en localStorage
- Interceptor HTTP que agregue `Authorization: Bearer <token>` a cada request
- Redirigir a `/login` si el token expira (401)
- Logout: limpiar token y redirigir a login

### 4.2 Layout
- Sidebar o navbar con navegación según rol
- Header con info del usuario logueado + botón logout
- Responsive (al menos desktop y tablet)

### 4.3 Manejo de Errores
- Toast notifications para éxito/error en operaciones
- Página de error 404
- Loading states en listados y formularios
- Empty states cuando no hay datos

### 4.4 Formularios
- Validación client-side antes de enviar
- Mostrar errores de validación del backend (field-by-field)
- Deshabilitar botón submit durante carga
- No permitir doble submit

---

## 5. No-Incluido (Out of Scope)

- Gestión de usuarios (crear/editar/eliminar usuarios)
- Dashboard con gráficos y estadísticas avanzadas
- Exportación de reportes a PDF/Excel
- Notificaciones push
- Modo offline
- Autenticación con OAuth/SSO

---

## 6. Datos de Entidad (Referencia)

### User
```
id: UUID
email: string (unique)
password: string (hashed)
role: "ADMIN" | "OPERATOR"
createdAt: DateTime
updatedAt: DateTime
```

### Category
```
id: UUID
name: string (unique)
createdAt: DateTime
```

### Product
```
id: UUID
name: string
sku: string (unique, formato: ^[A-Z0-9-]+$)
stock: integer (>= 0)
minStock: integer (>= 0)
price: float (> 0)
categoryId: UUID (FK → Category)
createdAt: DateTime
updatedAt: DateTime
```

### Order
```
id: UUID
operatorId: UUID (FK → User)
status: "PENDING" | "DISPATCHED" | "CANCELLED"
createdAt: DateTime
updatedAt: DateTime
```

### OrderItem
```
id: UUID
orderId: UUID (FK → Order)
productId: UUID (FK → Product)
quantity: integer (> 0)
priceAtOrder: float
```
