"use client"

import { motion, type MotionProps } from "framer-motion"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimatedElementProps extends MotionProps {
  children: ReactNode
  className?: string
  animationType?: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale" | "none"
  delay?: number
  duration?: number
  triggerOnce?: boolean
  threshold?: number
}

export function AnimatedElement({
  children,
  className,
  animationType = "fadeIn",
  delay = 0,
  duration = 0.5,
  triggerOnce = true,
  threshold = 0.1,
  ...props
}: AnimatedElementProps) {
  // Define animation variants
  const getVariants = () => {
    switch (animationType) {
      case "fadeIn":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
      case "slideUp":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }
      case "slideDown":
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 },
        }
      case "slideLeft":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
        }
      case "slideRight":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        }
      case "none":
      default:
        return {
          hidden: {},
          visible: {},
        }
    }
  }

  const transition = {
    duration,
    delay,
    ease: "easeOut",
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: triggerOnce, amount: threshold }}
      variants={getVariants()}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  )
}
