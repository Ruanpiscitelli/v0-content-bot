"use client"

import { useState, useEffect, useMemo } from "react"
import { Clock, Zap } from "lucide-react"

interface CountdownProps {
  targetDate?: Date
}

export function OfferCountdown({ targetDate }: CountdownProps) {
  const validTargetDate = useMemo(() => {
    if (targetDate instanceof Date && !isNaN(targetDate.getTime())) {
      return targetDate
    }
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
  }, [validTargetDate])

  return (
    <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-2 border-orange-500/30 rounded-2xl p-4 sm:p-6 md:p-8 mx-auto w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl shadow-2xl">
      <div className="text-center mb-6 md:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            LIMITED TIME OFFER
          </h2>
          <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500" />
        </div>
        
        <div className="mb-4 sm:mb-6">
          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text mb-1 sm:mb-2">
            50% OFF
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 font-medium">
            Annual plans only • No hidden fees • Cancel anytime
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
        <span className="text-base sm:text-lg font-semibold text-white">Offer expires in:</span>
      </div>

      <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item, index) => (
          <div key={item.label} className="flex flex-col items-center relative">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border-2 border-gray-200 p-2.5 sm:p-3 md:p-4 lg:p-6 w-[55px] sm:w-[65px] md:w-[80px] lg:min-w-[100px]">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 text-center tabular-nums">
                {item.value.toString().padStart(2, "0")}
              </div>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-400 mt-1.5 sm:mt-2 md:mt-3 uppercase tracking-wider">
              {item.label}
            </span>
            {index < 3 && (
              <div className="absolute -right-1 sm:-right-1.5 md:-right-2 top-5 sm:top-6 md:top-7 lg:top-8 text-xl sm:text-2xl md:text-3xl font-bold text-orange-500">:</div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-6 md:mt-8">
        <p className="text-base sm:text-lg text-gray-300 font-medium">
          🚀 Start your viral content journey today
        </p>
      </div>
    </div>
  )
}
