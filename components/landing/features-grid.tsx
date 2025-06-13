"use client"

import { Container } from "./container"
import { Section } from "./section"
import { Sparkles, Lightbulb, Calendar, Palette, TrendingUp, Layers } from "lucide-react"
import { motion } from "framer-motion"

export function FeaturesGrid() {
  const features = [
    {
      icon: Sparkles,
      title: "⚡ AI Super Generator",
      description: "Create viral posts, captions, and content optimized for maximum engagement on every platform.",
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-500/20 to-red-600/20"
    },
    {
      icon: Lightbulb,
      title: "🧠 Genius Idea Machine",
      description: "Never experience creative block again! Get unlimited creative concepts and trending ideas instantly.",
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-500/20 to-purple-600/20"
    },
    {
      icon: Calendar,
      title: "📅 Smart Planning Hub",
      description: "Organize your content calendar like a pro and schedule publications for optimal engagement times.",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-500/20 to-emerald-600/20"
    },
    {
      icon: Palette,
      title: "🎨 Brand Style Master",
      description: "Adapt tone, style, and personality perfectly to reflect your unique brand voice and aesthetic.",
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/20 to-pink-600/20"
    },
    {
      icon: TrendingUp,
      title: "📈 Trend Radar Pro",
      description: "Discover trending topics and viral opportunities in your niche before your competitors do.",
      gradient: "from-red-500 to-orange-600",
      bgGradient: "from-red-500/20 to-orange-600/20"
    },
    {
      icon: Layers,
      title: "🔥 Multi-Format Beast",
      description: "Create content for posts, stories, reels, videos, and every format that drives engagement.",
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-500/20 to-purple-600/20"
    }
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  }

  return (
    <Section className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      <Container className="relative z-10">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            🚀 SUPERCHARGE YOUR CONTENT GAME 🚀
          </h2>
          <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Experience the <span className="text-cyan-400 font-bold">most advanced AI</span> for content creation. 
            Generate <span className="text-pink-400 font-bold">viral-ready content</span> that your audience will love!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`relative p-6 md:p-8 rounded-2xl border border-white/10 bg-gradient-to-br ${feature.bgGradient} backdrop-blur-lg shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group`}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
            >
              {/* Gradient border effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}></div>
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
              
              {/* Sparkle effect */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
} 