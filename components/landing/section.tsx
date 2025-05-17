import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  background?: "none" | "white" | "light" | "dark" | "primary" | "ai-light"
}

export function Section({ children, className, id, background = "none" }: SectionProps) {
  // Mapeamento de backgrounds para classes
  const backgroundClasses = {
    none: "",
    white: "bg-white",
    light: "bg-gray-50",
    dark: "bg-gray-900 text-white",
    primary: "bg-primary text-white",
    "ai-light": "bg-ai-light",
  }

  return (
    <section id={id} className={cn("w-full py-8 sm:py-12 md:py-16 lg:py-20", backgroundClasses[background], className)}>
      {children}
    </section>
  )
}
