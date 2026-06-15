import axios from "axios"
import type { AxiosError } from "axios"
import { useAuthStore } from "@/stores/auth.store"

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor: attach token from auth store
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle 401 by clearing auth and redirecting
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api
