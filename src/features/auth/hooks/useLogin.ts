import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import api from "@/config/api"
import { useAuthStore } from "@/stores/auth.store"
import type { LoginDTO } from "../schemas/auth.schema"
import type { ApiResponse, LoginResponse } from "@/shared/types/api"

export function useLogin() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: (data: LoginDTO) =>
      api.post<ApiResponse<LoginResponse>>("/auth/login", data),
    onSuccess: (response) => {
      const { token, user } = response.data.data
      login(token, user)
      navigate("/dashboard")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Error al iniciar sesión"
      toast.error(message)
    },
  })
}
