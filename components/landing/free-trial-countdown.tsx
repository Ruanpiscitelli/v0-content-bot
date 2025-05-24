"use client"
import { useState, useEffect } from "react"
import { CustomButton } from "../ui/custom-button"
import { motion, AnimatePresence } from "framer-motion"

export function FreeTrialCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          clearInterval(timer)
          return { hours: 0, minutes: 0, seconds: 0 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const digitVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-8 px-4 rounded-xl shadow-lg">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">Oferta por tempo limitado!</h3>
        <p className="mb-6">Aproveite 50% de desconto nos primeiros 3 meses de assinatura Pro</p>

        <div className="flex justify-center gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="bg-white text-primary rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold mb-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={timeLeft.hours}
                  variants={digitVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  {String(timeLeft.hours).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-xs">Horas</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white text-primary rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold mb-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={timeLeft.minutes}
                  variants={digitVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  {String(timeLeft.minutes).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-xs">Minutos</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white text-primary rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold mb-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={timeLeft.seconds}
                  variants={digitVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  {String(timeLeft.seconds).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-xs">Segundos</span>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <CustomButton variant="secondary" size="lg" animationType="shine">
            Aproveitar Oferta
          </CustomButton>
        </motion.div>
      </div>
    </div>
  )
}
