import type React from "react"
interface StatCardProps {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  isAI?: boolean
}

export function StatCard({ value, label, description, icon, isAI = false }: StatCardProps) {
  return (
    <div
      className={`text-center p-6 rounded-lg ${isAI ? "bg-gradient-to-br from-white to-primary/10 border border-primary/20" : "bg-white border border-gray-200"}`}
    >
      {icon && <div className="flex justify-center mb-3">{icon}</div>}
      <div className={`text-3xl font-bold ${isAI ? "text-primary" : "text-blue-600"}`}>{value}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
      {description && <div className="mt-2 text-xs text-gray-500">{description}</div>}
      {isAI && (
        <div className="mt-3 text-xs text-primary/70 flex items-center justify-center">
          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mr-1.5 animate-pulse"></span>
          AI-verified metric
        </div>
      )}
    </div>
  )
}
