"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface CustomButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "white"
  size?: "sm" | "md" | "lg"
  className?: string
  animationType?: "shine" | "scale" | "none"
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function CustomButton({
  children,
  variant = "primary",
  size = "md",
  className,
  animationType = "none",
  onClick,
  disabled = false,
  type = "button",
}: CustomButtonProps) {
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5",
    white: "bg-white text-primary hover:bg-gray-100",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  }

  const animationClasses = {
    shine: "relative overflow-hidden",
    scale: "transform transition-transform hover:scale-105 active:scale-95",
    none: "",
  }

  const shineEffect = animationType === "shine" && (
    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 hover:opacity-20 transform -translate-x-full hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
  )

  return (
    <button
      type={type}
      className={cn(
        "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        animationClasses[animationType],
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {shineEffect}
    </button>
  )
}
