import type { LucideIcon } from "lucide-react"
import { Package } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
}

export function EmptyState({ icon: Icon = Package, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>
    </div>
  )
}
