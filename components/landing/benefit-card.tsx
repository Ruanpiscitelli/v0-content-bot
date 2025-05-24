"use client"
import type { ReactNode } from "react"
import { HoverCard } from "../ui/hover-card"

interface BenefitCardProps {
  icon: ReactNode
  title: string
  description: string
  aiPowered?: boolean
}

export function BenefitCard({ icon, title, description, aiPowered = false }: BenefitCardProps) {
  return (
    <HoverCard hoverEffect="lift" className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <div
        className={`mb-4 ${aiPowered ? "text-primary" : "text-primary"} w-12 h-12 flex items-center justify-center rounded-full ${
          aiPowered ? "bg-primary/10 ring-2 ring-primary/20" : "bg-primary/10"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-secondary">
        {title}
        {aiPowered && (
          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">AI-Powered</span>
        )}
      </h3>
      <p className="text-accent">{description}</p>
      {aiPowered && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-primary/70">
          Trained on millions of high-converting content examples
        </div>
      )}
    </HoverCard>
  )
}
