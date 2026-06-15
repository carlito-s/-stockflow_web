import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import api from "@/config/api"
import type { RegisterDTO } from "../schemas/auth.schema"

interface RegisterPayload {
  email: string
  password: string
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterDTO) =>
      api.post("/auth/register", {
        email: data.email,
        password: data.password,
      } satisfies RegisterPayload),
    onSuccess: () => {
      toast.success("Cuenta creada. Ahora puedes iniciar sesión.")
      navigate("/login")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Error al registrar"
      toast.error(message)
    },
  })
}
