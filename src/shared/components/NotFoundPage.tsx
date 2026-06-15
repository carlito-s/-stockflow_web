import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-lg font-medium text-gray-900">Página no encontrada</p>
      <p className="mt-2 text-sm text-gray-600">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Volver al Dashboard
      </Link>
    </div>
  )
}
