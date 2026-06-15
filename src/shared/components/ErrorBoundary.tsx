import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "./ui/Button"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Algo salió mal</h2>
          <p className="mt-2 max-w-md text-sm text-gray-600">
            {this.state.error?.message || "Ocurrió un error inesperado."}
          </p>
          <Button onClick={this.handleRetry} className="mt-6">
            Reintentar
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
