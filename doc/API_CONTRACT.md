# API Contract — StockFlow API

**Base URL**: `http://localhost:3000`
**Content-Type**: `application/json`

---

## 1. Autenticación

### POST /api/auth/register

Registra un nuevo usuario.

**Request Body**:
```json
{
  "email": "string (email válido, 5-100 chars)",
  "password": "string (8-100 chars, al menos 1 mayúscula, 1 minúscula, 1 número)",
  "role": "ADMIN | OPERATOR (opcional, default: OPERATOR)"
}
```

**Response 201**:
```json
{
  "status": "success",
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "role": "ADMIN | OPERATOR",
      "createdAt": "datetime"
    }
  }
}
```

**Errors**:
- `400` — Email ya registrado / validación fallida

---

### POST /api/auth/login

Autentica un usuario y retorna JWT.

**Request Body**:
```json
{
  "email": "string (email válido)",
  "password": "string (mínimo 1 char)"
}
```

**Response 200**:
```json
{
  "status": "success",
  "message": "Inicio de sesión exitoso",
  "data": {
    "token": "string (JWT)",
    "user": {
      "id": "uuid",
      "email": "string",
      "role": "ADMIN | OPERATOR"
    }
  }
}
```

**Errors**:
- `401` — Credenciales inválidas

---

## 2. Productos

> Todas las rutas requieren header `Authorization: Bearer <token>`

### GET /api/products

Lista productos. Accesible para ADMIN y OPERATOR.

**Query Params** (opcionales):
| Param | Tipo | Descripción |
|-------|------|-------------|
| `categoryId` | UUID | Filtrar por categoría |
| `search` | string | Buscar por nombre o SKU |

**Response 200**:
```json
{
  "status": "success",
  "data": {
    "count": "integer",
    "products": [
      {
        "id": "uuid",
        "name": "string",
        "sku": "string",
        "stock": "integer",
        "minStock": "integer",
        "price": "float",
        "categoryId": "uuid",
        "category": {
          "id": "uuid",
          "name": "string"
        },
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
}
```

---

### GET /api/products/:id

Obtiene un producto específico.

**Response 200**:
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "uuid",
      "name": "string",
      "sku": "string",
      "stock": "integer",
      "minStock": "integer",
      "price": "float",
      "categoryId": "uuid",
      "category": {
        "id": "uuid",
        "name": "string"
      },
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

**Errors**:
- `404` — Producto no encontrado

---

### POST /api/products

Crea un nuevo producto. **Solo ADMIN**.

**Request Body**:
```json
{
  "name": "string (2-100 chars)",
  "sku": "string (3-50 chars, ^[A-Z0-9-]+$)",
  "stock": "integer (>= 0)",
  "minStock": "integer (>= 0)",
  "price": "float (> 0)",
  "categoryId": "uuid"
}
```

**Response 201**:
```json
{
  "status": "success",
  "message": "Producto creado exitosamente",
  "data": {
    "product": {
      "id": "uuid",
      "name": "string",
      "sku": "string",
      "stock": "integer",
      "minStock": "integer",
      "price": "float",
      "categoryId": "uuid",
      "category": {
        "id": "uuid",
        "name": "string"
      },
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

**Errors**:
- `400` — Validación fallida
- `409` — SKU duplicado

---

### PUT /api/products/:id

Actualiza un producto. **Solo ADMIN**. Todos los campos opcionales.

**Request Body** (al menos un campo requerido):
```json
{
  "name": "string (2-100 chars)",
  "sku": "string (3-50 chars, ^[A-Z0-9-]+$)",
  "stock": "integer (>= 0)",
  "minStock": "integer (>= 0)",
  "price": "float (> 0)",
  "categoryId": "uuid"
}
```

**Response 200**:
```json
{
  "status": "success",
  "message": "Producto actualizado exitosamente",
  "data": {
    "product": { ... }
  }
}
```

**Errors**:
- `400` — Validación fallida / body vacío
- `404` — Producto no encontrado
- `409` — SKU duplicado

---

### DELETE /api/products/:id

Elimina un producto. **Solo ADMIN**.

**Response 200**:
```json
{
  "status": "success",
  "message": "Producto eliminado exitosamente"
}
```

**Errors**:
- `404` — Producto no encontrado
- `409` — Producto asociado a pedidos (no se puede eliminar)

---

## 3. Pedidos

> Todas las rutas requieren header `Authorization: Bearer <token>`
> Roles permitidos: ADMIN y OPERATOR

### POST /api/orders

Crea un nuevo pedido. El `operatorId` se toma del token JWT.

**Request Body**:
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": "integer (> 0)"
    }
  ]
}
```

**Constraints**:
- Mínimo 1 item
- No se permiten productos duplicados (mismo productId)

**Response 201**:
```json
{
  "status": "success",
  "message": "Pedido creado exitosamente. Stock actualizado.",
  "data": {
    "order": {
      "id": "uuid",
      "operatorId": "uuid",
      "status": "PENDING",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "operator": {
        "id": "uuid",
        "email": "string",
        "role": "string"
      },
      "items": [
        {
          "id": "uuid",
          "productId": "uuid",
          "quantity": "integer",
          "priceAtOrder": "float",
          "product": {
            "id": "uuid",
            "name": "string",
            "sku": "string"
          }
        }
      ]
    }
  }
}
```

**Errors**:
- `400` — Validación fallida
- `409` — Stock insuficiente para algún producto

---

### GET /api/orders

Lista pedidos.

- **ADMIN**: ve todos los pedidos del sistema
- **OPERATOR**: ve solo sus propios pedidos

**Query Params** (opcionales):
| Param | Tipo | Descripción |
|-------|------|-------------|
| `status` | `PENDING \| DISPATCHED \| CANCELLED` | Filtrar por estado |

**Response 200**:
```json
{
  "status": "success",
  "data": {
    "count": "integer",
    "orders": [
      {
        "id": "uuid",
        "operatorId": "uuid",
        "status": "PENDING | DISPATCHED | CANCELLED",
        "createdAt": "datetime",
        "updatedAt": "datetime",
        "operator": {
          "id": "uuid",
          "email": "string",
          "role": "string"
        },
        "items": [
          {
            "id": "uuid",
            "productId": "uuid",
            "quantity": "integer",
            "priceAtOrder": "float",
            "product": {
              "name": "string",
              "sku": "string"
            }
          }
        ]
      }
    ]
  }
}
```

---

### GET /api/orders/:id

Obtiene detalle de un pedido.

- **ADMIN**: puede ver cualquier pedido
- **OPERATOR**: solo puede ver sus propios pedidos

**Response 200**:
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "uuid",
      "operatorId": "uuid",
      "status": "PENDING | DISPATCHED | CANCELLED",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "operator": {
        "id": "uuid",
        "email": "string",
        "role": "string"
      },
      "items": [
        {
          "id": "uuid",
          "productId": "uuid",
          "quantity": "integer",
          "priceAtOrder": "float",
          "product": {
            "id": "uuid",
            "name": "string",
            "sku": "string",
            "price": "float"
          }
        }
      ]
    }
  }
}
```

**Errors**:
- `404` — Pedido no encontrado
- `403` — OPERATOR intentando ver pedido de otro

---

### PATCH /api/orders/:id/status

Actualiza el estado de un pedido.

**Request Body**:
```json
{
  "status": "DISPATCHED | CANCELLED"
}
```

**Comportamiento**:
- Si `DISPATCHED`: marca como despachado
- Si `CANCELLED`: cancela y reintegra el stock

**Response 200**:
```json
{
  "status": "success",
  "message": "Pedido despachado exitosamente. | Pedido cancelado. Stock reintegrado.",
  "data": {
    "order": {
      "id": "uuid",
      "operatorId": "uuid",
      "status": "DISPATCHED | CANCELLED",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

**Errors**:
- `400` — Status inválido
- `404` — Pedido no encontrado
- `409` — Pedido ya despachado o cancelado (no se puede cambiar)

---

## 4. Reportes

> Todas las rutas requieren header `Authorization: Bearer <token>`
> Solo ADMIN

### GET /api/reports/low-stock

Lista productos con stock menor o igual al mínimo.

**Response 200**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "sku": "string",
      "stock": "integer",
      "minStock": "integer",
      "price": "float",
      "category": {
        "id": "uuid",
        "name": "string"
      }
    }
  ]
}
```

---

## 5. Respuestas de Error (Genéricas)

Todas las respuestas de error siguen este formato:

```json
{
  "status": "error",
  "message": "string descriptivo del error"
}
```

Para errores de validación de Zod:

```json
{
  "status": "error",
  "message": "Error de validación",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

---

## 6. Headers Requeridos

| Header | Requerido | Descripción |
|--------|-----------|-------------|
| `Content-Type` | Sí | `application/json` |
| `Authorization` | En rutas protegidas | `Bearer <jwt_token>` |

---

## 7. Códigos de Estado HTTP

| Código | Uso |
|--------|-----|
| `200` | Éxito (GET, PUT, PATCH, DELETE) |
| `201` | Recurso creado (POST) |
| `400` | Validación fallida |
| `401` | No autenticado / token inválido |
| `403` | Sin permisos para la acción |
| `404` | Recurso no encontrado |
| `409` | Conflicto (duplicado, estado inválido) |
| `500` | Error interno del servidor |
