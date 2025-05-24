"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HoverCardProps {
  children: ReactNode
  className?: string
  hoverEffect?: "lift" | "glow" | "border" | "scale" | "none"
}

export function HoverCard({ children, className, hoverEffect = "lift" }: HoverCardProps) {
  const getHoverStyles = () => {
    switch (hoverEffect) {
      case "lift":
        return {
          whileHover: { y: -5, transition: { duration: 0.2 } },
          whileTap: { y: 0 },
        }
      case "glow":
        return {
          whileHover: { boxShadow: "0 0 15px rgba(0, 175, 240, 0.5)", transition: { duration: 0.2 } },
        }
      case "border":
        return {
          whileHover: { boxShadow: "0 0 0 2px rgba(0, 175, 240, 0.5)", transition: { duration: 0.2 } },
        }
      case "scale":
        return {
          whileHover: { scale: 1.03, transition: { duration: 0.2 } },
          whileTap: { scale: 0.98 },
        }
      case "none":
      default:
        return {}
    }
  }

  return (
    <motion.div className={cn("transition-all duration-200", className)} {...getHoverStyles()}>
      {children}
    </motion.div>
  )
}
