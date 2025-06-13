"use client"

import { Container } from "./container"
import { Section } from "./section"
import { Rocket, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import Link from "next/link"

export function GoViralCTA() {
  return (
    <Section className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      {/* Rocket icons floating */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Rocket className="absolute top-20 left-10 w-8 h-8 text-yellow-300/30 animate-float" />
        <Rocket className="absolute top-40 right-20 w-6 h-6 text-white/20 animate-float delay-1000" />
        <Rocket className="absolute bottom-32 left-1/4 w-10 h-10 text-orange-300/30 animate-float delay-2000" />
        <Sparkles className="absolute top-32 right-1/3 w-6 h-6 text-pink-300/40 animate-pulse" />
        <Sparkles className="absolute bottom-20 right-10 w-8 h-8 text-cyan-300/40 animate-pulse delay-1500" />
      </div>
      
      <Container className="relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Main heading */}
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-white drop-shadow-2xl">
              🚀 GO VIRAL NOW! 🚀
            </span>
          </motion.h2>
          
          {/* Subheading */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">DOMINATE</span> Social Media?
            </h3>
          </motion.div>
          
          {/* Social proof box */}
          <motion.div 
            className="inline-block bg-gradient-to-r from-purple-800/50 to-pink-800/50 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <p className="text-lg sm:text-xl text-white font-bold mb-4">
              Join <span className="text-yellow-300">50,000+</span> creators who are already{" "}
              <span className="text-cyan-300">crushing it</span> with AI-powered content!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/90">
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                ✅ No Credit Card Required
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                ⚡ Start Creating in 60 Seconds
              </div>
              <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                🚫 Cancel Anytime
              </div>
            </div>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link href="/chat">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black py-6 px-10 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/30 text-xl"
              >
                <span className="flex items-center">
                  🚀 START DOMINATING NOW 👑
                </span>
              </Button>
            </Link>
            
            <Link href="#features">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-6 px-8 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 bg-transparent text-lg"
              >
                <span className="flex items-center">
                  ✨ SEE ALL FEATURES
                </span>
              </Button>
            </Link>
          </motion.div>
          
          {/* Limited time offer */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <div className="inline-block bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/50 rounded-full px-6 py-3 mb-4">
              <p className="text-yellow-300 font-bold text-lg">
                ⚡ LIMITED TIME: Join now and get <span className="text-white">BONUS</span> features worth $200! ⚡
              </p>
            </div>
            <p className="text-white/80 text-sm">
              🔥 Offer expires in 24 hours - Don't miss out! 🔥
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  )
} 