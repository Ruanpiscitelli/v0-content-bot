import type { ReactNode } from "react"

interface StepCardProps {
  number: number
  title: string
  description: string
  icon?: ReactNode
  isActive?: boolean
}

export function StepCard({ number, title, description, icon, isActive = false }: StepCardProps) {
  return (
    <div
      className={`relative p-6 rounded-xl border ${isActive ? "border-primary bg-primary/5" : "border-gray-200 bg-white"} transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full ${isActive ? "bg-primary" : "bg-gray-100"} flex items-center justify-center text-lg font-bold ${isActive ? "text-white" : "text-gray-500"}`}
        >
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            {title}
            {icon && <span className="ml-2 text-primary">{icon}</span>}
          </h3>
          <p className="text-foreground">{description}</p>

          {isActive && (
            <div className="mt-4 flex items-center text-sm text-primary">
              <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
              <span>AI-optimized process</span>
            </div>
          )}
        </div>
      </div>

      {/* AI-powered indicator */}
      <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-purple-500 opacity-30 animate-pulse"></div>
    </div>
  )
}
