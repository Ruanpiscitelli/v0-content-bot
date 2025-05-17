"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface CountdownProps {
  targetDate?: Date
}

export function OfferCountdown({ targetDate }: CountdownProps) {
  // Use useMemo to create a stable reference to the default date
  const validTargetDate = useMemo(() => {
    if (targetDate instanceof Date && !isNaN(targetDate.getTime())) {
      return targetDate
    }
    // Default to 7 days from now if invalid
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }, [targetDate])

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = validTargetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [validTargetDate]) // Only depend on the stable reference

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h3 className="text-2xl font-bold text-center">Oferta Especial de Lançamento</h3>
      <p className="text-center text-muted-foreground">
        Aproveite 50% de desconto nos planos anuais. Oferta por tempo limitado!
      </p>

      <div className="flex gap-4 mt-4">
        {[
          { label: "Dias", value: timeLeft.days },
          { label: "Horas", value: timeLeft.hours },
          { label: "Minutos", value: timeLeft.minutes },
          { label: "Segundos", value: timeLeft.seconds },
        ].map((item) => (
          <Card key={item.label} className="overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums">{item.value.toString().padStart(2, "0")}</span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
