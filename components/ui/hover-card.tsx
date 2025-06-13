"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface HoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: "lift" | "scale" | "glow" | "none"
  children: React.ReactNode
}

const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(
  ({ className, hoverEffect = "lift", children, ...props }, ref) => {
    const hoverEffects = {
      lift: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
      scale: "hover:scale-105 transition-transform duration-300",
      glow: "hover:shadow-xl hover:shadow-primary/20 transition-shadow duration-300",
      none: ""
    }

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-300",
          hoverEffects[hoverEffect],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

HoverCard.displayName = "HoverCard"

export { HoverCard } 