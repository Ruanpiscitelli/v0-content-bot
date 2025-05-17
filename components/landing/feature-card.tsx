import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
  aiHighlight?: boolean
}

export function FeatureCard({ icon, title, description, className = "", aiHighlight = false }: FeatureCardProps) {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
        aiHighlight ? "border-primary/30 bg-gradient-to-br from-white to-primary/5" : ""
      } ${className}`}
    >
      <div className={`mb-4 ${aiHighlight ? "text-primary" : ""}`}>{icon}</div>
      <h3 className="font-bold text-lg mb-2 text-secondary">{title}</h3>
      <p className="text-accent text-sm">{description}</p>
      {aiHighlight && (
        <div className="mt-4 text-xs font-medium text-primary/80 flex items-center">
          <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
          AI-powered feature
        </div>
      )}
    </div>
  )
}
