import type React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
}

export function Container({ children, className, size = "lg", padding = "md" }: ContainerProps) {
  // Mapeamento de tamanhos para classes max-width
  const sizeClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  }

  // Mapeamento de padding para classes responsivas
  const paddingClasses = {
    none: "px-0",
    sm: "px-3 sm:px-4 md:px-5",
    md: "px-4 sm:px-6 lg:px-8",
    lg: "px-5 sm:px-8 md:px-10 lg:px-12",
    xl: "px-6 sm:px-10 md:px-16 lg:px-20",
  }

  return <div className={cn("mx-auto", sizeClasses[size], paddingClasses[padding], className)}>{children}</div>
}
