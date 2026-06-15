export interface ApiResponse<T> {
  status: "success" | "error"
  message?: string
  data: T
}

export interface User {
  id: string
  email: string
  role: "ADMIN" | "OPERATOR"
}

export interface Product {
  id: string
  name: string
  sku: string
  stock: number
  minStock: number
  price: number
  categoryId: string
  category: Category
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
}

export interface Order {
  id: string
  operatorId: string
  status: "PENDING" | "DISPATCHED" | "CANCELLED"
  createdAt: string
  updatedAt: string
  operator: User
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  priceAtOrder: number
  product: { id: string; name: string; sku: string }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  role?: "ADMIN" | "OPERATOR"
}