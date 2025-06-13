"use client"

import { Container } from "./container"
import { Section } from "./section"
import { MessageSquare, Palette, Rocket, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import Link from "next/link"

export function MagicSteps() {
  const steps = [
    {
      number: "1",
      icon: MessageSquare,
      title: "💬 Describe Your Vision",
      description: "Type what you need: an Instagram post, a Twitter thread, TikTok script, or ideas for your next viral video.",
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-500/20 to-blue-600/20"
    },
    {
      number: "2", 
      icon: Palette,
      title: "🎨 Customize & Perfect",
      description: "Adjust the tone, style, format, and vibe to perfectly match your brand and audience preferences.",
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/20 to-pink-600/20"
    },
    {
      number: "3",
      icon: Rocket,
      title: "🚀 Launch & Dominate",
      description: "Save, schedule, or publish directly. Watch engagement soar and track performance in real-time.",
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-500/20 to-red-600/20"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <Section className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
      
      <Container className="relative z-10">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full border border-pink-400/30 mb-6">
            <span className="text-pink-400 font-bold text-sm uppercase tracking-wider">FROM IDEA TO VIRAL IN 3 STEPS</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">🪄 HOW THE MAGIC HAPPENS 🔥</span>
          </h2>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Watch your content transform from <span className="text-yellow-400 font-bold">basic idea</span> to{" "}
            <span className="text-pink-400 font-bold">engagement magnet</span> in under a minute!
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative group"
              variants={stepVariants}
            >
              {/* Connection arrow (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
              )}
              
              <div className={`relative p-8 rounded-3xl border border-white/10 bg-gradient-to-br ${step.bgGradient} backdrop-blur-lg shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 h-full`}>
                {/* Gradient border effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}></div>
                
                <div className="relative z-10 text-center">
                  {/* Step number */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.gradient} mb-6 shadow-lg transform group-hover:scale-110 transition-all duration-300 text-white font-black text-2xl`}>
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-6">
                    <step.icon className="w-12 h-12 text-cyan-300 mx-auto group-hover:text-cyan-200 transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-300 text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* CTA Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link href="/chat">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-white/20 text-lg"
            >
              <span className="flex items-center">
                ✨ TRY THE MAGIC NOW ✨
              </span>
            </Button>
          </Link>
        </motion.div>
      </Container>
    </Section>
  )
} 