"use client"

import { HardHat, Wrench, Lightbulb, Construction } from 'lucide-react'
import { motion } from 'framer-motion'

const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: [0, 10, -10, 0],
    transition: { duration: 0.3 },
  },
  initial: {
    y: 0,
  },
  animate: {
    y: ["-5px", "5px"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
}

export function ComingSoonPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 text-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-tr from-purple-400/10 to-pink-500/10 rounded-full blur-3xl opacity-50"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-gradient-to-br from-gray-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl shadow-cyan-500/20 max-w-lg w-full border border-cyan-400/30"
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-pink-500/20 opacity-50 blur-xl rounded-2xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-around items-center mb-8">
            {[
              { Icon: HardHat, color: "from-cyan-400 to-blue-500" },
              { Icon: Wrench, color: "from-purple-400 to-pink-500" },
              { Icon: Lightbulb, color: "from-yellow-400 to-orange-500" },
              { Icon: Construction, color: "from-green-400 to-emerald-500" }
            ].map(({ Icon, color }, index) => (
              <motion.div
                key={index}
                variants={iconVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className={`p-2 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 border border-white/20`}
              >
                <Icon className={`h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br ${color} bg-clip-text text-transparent`} />
              </motion.div>
            ))}
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            We&apos;re working on it!
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-300 mb-8 sm:text-lg">
            New exciting features are coming soon. Stay tuned!
          </motion.p>
          
          {/* Optional glow effect on the card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-lg pointer-events-none"
          />
        </div>
      </motion.div>
    </div>
  )
} 