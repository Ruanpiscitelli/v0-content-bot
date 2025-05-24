"use client"

import { Header } from "./header"
import { Container } from "./container"
import { Section } from "./section"
import { SectionHeader } from "./section-header"
import { FeatureCard } from "./feature-card"
import { Testimonials } from "./testimonials"
import { PlanComparisonTable } from "./plan-comparison-table"
import { FAQ } from "./faq"
import { CustomButton } from "../ui/custom-button"
import { StepCard } from "./step-card"
import { StatCard } from "./stat-card"
import { OfferCountdown } from "./offer-countdown"
import { ChatDemo } from "./chat-demo"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MessageSquare,
  Calendar,
  Lightbulb,
  TrendingUp,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Clock,
  Sparkles,
  Layers,
  Palette,
  Zap,
  Target,
  BarChart,
  Wand2,
  ArrowRight,
  BrainCircuit,
  Star,
  Rocket,
  Crown,
  Flame,
} from "lucide-react"
import { GuaranteeSection } from "./guarantee-section"

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />

      {/* Hero Section - Redesigned with vibrant gradients */}
      <Section className="pt-12 sm:pt-16 md:pt-24 pb-12 sm:pb-16 md:pb-20 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400 via-blue-500 to-purple-600 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-yellow-400/10 to-transparent rounded-full animate-slow-spin"></div>
        </div>
        
        <Container size="xl" className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-12">
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white rounded-full text-sm sm:text-base font-bold mb-4 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  🚀 AI-Powered Content Revolution
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white">
                  Turn <span className="text-white">10 Seconds</span> Into <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">10K Sales</span>
                  <span className="block mt-2 text-white">With AI-Generated <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Viral Content</span></span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-xl mx-auto lg:mx-0 mt-4 sm:mt-6 font-medium leading-relaxed">
                  Our advanced AI doesn't just make content go viral - it creates viral content that converts viewers into buyers. While others chase likes, you'll be counting profits. 10x faster creation, 100x better ROI!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start mt-8">
                <Link href="/chat">
                  <CustomButton 
                    variant="primary" 
                    size="lg" 
                    animationType="shine"
                    className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20"
                  >
                    <span className="flex items-center text-lg">
                      <Rocket className="mr-3 w-6 h-6" />
                      START FREE NOW
                      <ArrowRight className="ml-3 w-6 h-6" />
                    </span>
                  </CustomButton>
                </Link>
                <Link href="#how-it-works">
                  <CustomButton 
                    variant="outline" 
                    size="lg" 
                    animationType="scale"
                    className="border-4 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 font-bold py-4 px-8 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300"
                  >
                    <span className="flex items-center text-lg">
                      <Wand2 className="mr-3 w-6 h-6" />
                      WATCH MAGIC
                    </span>
                  </CustomButton>
                </Link>
              </div>

              <div className="pt-6 sm:pt-8 text-base sm:text-lg text-yellow-300 flex items-center justify-center lg:justify-start font-semibold">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-yellow-400" />
                <span>⚡ Generate viral content in under 60 seconds ⚡</span>
              </div>

              {/* New testimonial preview */}
              <div className="pt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-white font-bold">4.9/5</span>
                </div>
                <p className="text-gray-200 italic">"This AI tool increased my engagement by 300% in just one week!"</p>
                <p className="text-cyan-400 font-semibold mt-1">- Sarah, Content Creator</p>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
              <div className="relative z-10">
              <ChatDemo />
              </div>
              {/* Glowing effect around demo */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-xl"></div>
            </div>
          </div>

          <div className="mt-16 sm:mt-20 md:mt-28">
            <div className="text-center text-white text-sm sm:text-base uppercase font-bold mb-6 sm:mb-8 tracking-wider">
              🌟 CREATE CONTENT FOR ALL PLATFORMS 🌟
            </div>

            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16">
              {[
                { icon: Instagram, name: "Instagram", color: "from-purple-500 to-pink-500" },
                { icon: Facebook, name: "Facebook", color: "from-blue-500 to-blue-600" },
                { icon: Twitter, name: "Twitter", color: "from-cyan-400 to-blue-500" },
                { icon: Linkedin, name: "LinkedIn", color: "from-blue-600 to-blue-700" },
                { icon: Youtube, name: "YouTube", color: "from-red-500 to-red-600" },
              ].map((platform) => (
                <div key={platform.name} className="flex flex-col items-center group cursor-pointer">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center shadow-2xl transform group-hover:scale-125 transition-all duration-300 group-hover:rotate-12`}>
                    <platform.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
                  <span className="mt-2 sm:mt-3 text-sm sm:text-base text-white font-semibold group-hover:text-yellow-400 transition-colors">{platform.name}</span>
              </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section - Redesigned with vibrant cards */}
      <Section id="features" className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, cyan 1px, transparent 1px), radial-gradient(circle at 80% 50%, magenta 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <Container className="relative z-10">
          <SectionHeader
            title={
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                🚀 SUPERCHARGE YOUR CONTENT GAME 🚀
              </span>
            }
            subtitle={
              <span className="text-yellow-400 font-bold text-2xl">
                AI Features That Actually Work
              </span>
            }
            description={
              <span className="text-gray-200 text-xl leading-relaxed">
                Experience the <span className="text-cyan-400 font-bold">most advanced AI</span> content creation platform. 
                Generate <span className="text-pink-400 font-bold">viral-ready content</span> that your audience will love!
              </span>
            }
            titleClassName="text-4xl sm:text-5xl font-black"
            subtitleClassName="text-2xl font-bold"
            descriptionClassName="text-xl"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
            {[
              {
                icon: <Sparkles className="w-10 h-10 sm:w-12 sm:h-12" />,
                title: "⚡ AI Super Generator",
                description: "Create viral posts, captions, and content optimized for maximum engagement on every platform.",
                gradient: "from-yellow-400 via-orange-500 to-red-500",
                bgGradient: "from-yellow-500/20 to-red-500/20"
              },
              {
                icon: <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12" />,
                title: "🧠 Genius Idea Machine",
                description: "Never experience creative block again! Get unlimited creative concepts and trending ideas instantly.",
                gradient: "from-cyan-400 via-blue-500 to-purple-500",
                bgGradient: "from-cyan-500/20 to-purple-500/20"
              },
              {
                icon: <Calendar className="w-10 h-10 sm:w-12 sm:h-12" />,
                title: "📅 Smart Planning Hub",
                description: "Organize your content calendar like a pro and schedule publications for optimal engagement times.",
                gradient: "from-green-400 via-emerald-500 to-teal-500",
                bgGradient: "from-green-500/20 to-teal-500/20"
              },
              {
                icon: <Palette className="w-10 h-10 sm:w-12 sm:h-12" />,
                title: "🎨 Brand Style Master",
                description: "Adapt tone, style, and personality perfectly to reflect your unique brand voice and aesthetic.",
                gradient: "from-pink-400 via-purple-500 to-indigo-500",
                bgGradient: "from-pink-500/20 to-indigo-500/20"
              },
              {
                icon: <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12" />,
                title: "📈 Trend Radar Pro",
                description: "Discover trending topics and viral opportunities in your niche before your competitors do.",
                gradient: "from-orange-400 via-red-500 to-pink-500",
                bgGradient: "from-orange-500/20 to-pink-500/20"
              },
              {
                icon: <Layers className="w-10 h-10 sm:w-12 sm:h-12" />,
                title: "🔥 Multi-Format Beast",
                description: "Create content for posts, stories, reels, videos, and every format that drives engagement.",
                gradient: "from-purple-400 via-violet-500 to-purple-600",
                bgGradient: "from-purple-500/20 to-violet-500/20"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm border-2 border-white/20 shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 group cursor-pointer overflow-hidden`}
              >
                {/* Glowing border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-300`}></div>
                
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 shadow-xl text-white transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-yellow-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-200 text-base sm:text-lg leading-relaxed group-hover:text-white transition-colors">
                  {feature.description}
                </p>

                {/* Animated sparkles */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* How It Works Section - Redesigned with neon theme */}
      <Section id="how-it-works" className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Neon grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(cyan 1px, transparent 1px),
              linear-gradient(90deg, cyan 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <Container className="relative z-10">
          <SectionHeader
            title={
              <span className="bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                🔥 HOW THE MAGIC HAPPENS 🔥
              </span>
            }
            subtitle={
              <span className="text-pink-400 font-bold text-2xl">
                From Idea to Viral in 3 Steps
              </span>
            }
            description={
              <span className="text-gray-200 text-xl leading-relaxed">
                Watch your content transform from <span className="text-yellow-400 font-bold">basic idea</span> to 
                <span className="text-pink-400 font-bold"> engagement magnet</span> in under a minute!
              </span>
            }
            titleClassName="text-4xl sm:text-5xl font-black"
            subtitleClassName="text-2xl font-bold"
            descriptionClassName="text-xl"
          />

          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                number: 1,
                title: "🎯 Describe Your Vision",
                description: "Type what you need: an Instagram post, a Twitter thread, TikTok script, or ideas for your next viral video.",
                icon: <MessageSquare className="w-8 h-8" />,
                gradient: "from-cyan-400 to-blue-500",
                bgGradient: "from-cyan-500/20 to-blue-500/20"
              },
              {
                number: 2,
                title: "🎨 Customize & Perfect",
                description: "Adjust the tone, style, format, and vibe to perfectly match your brand and audience preferences.",
                icon: <Palette className="w-8 h-8" />,
                gradient: "from-purple-400 to-pink-500",
                bgGradient: "from-purple-500/20 to-pink-500/20"
              },
              {
                number: 3,
                title: "🚀 Launch & Dominate",
                description: "Save, schedule, or publish directly. Watch engagement soar and track performance in real-time.",
                icon: <Zap className="w-8 h-8" />,
                gradient: "from-yellow-400 to-red-500",
                bgGradient: "from-yellow-500/20 to-red-500/20"
              }
            ].map((step, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${step.bgGradient} backdrop-blur-sm border-2 border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300 group cursor-pointer text-center`}
              >
                {/* Step number with glow */}
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 mx-auto shadow-2xl transform group-hover:scale-110 transition-all duration-300 relative`}>
                  <span className="text-3xl font-black text-white">{step.number}</span>
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-full opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`}></div>
                </div>

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 mx-auto shadow-xl text-white transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                  {step.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors">
                  {step.title}
                </h3>

                <p className="text-gray-200 text-lg leading-relaxed group-hover:text-white transition-colors">
                  {step.description}
                </p>

                {/* Animated arrow for flow */}
                {index < 2 && (
                  <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <Link href="/chat">
              <CustomButton 
                variant="primary" 
                size="lg" 
                animationType="shine"
                className="bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 hover:from-green-600 hover:via-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20 text-xl"
              >
                <span className="flex items-center">
                  <Rocket className="mr-3 w-6 h-6" />
                  TRY THE MAGIC NOW
                  <Sparkles className="ml-3 w-6 h-6" />
                </span>
              </CustomButton>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Results Section - Enhanced with vibrant stats */}
      <Section className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Floating particles animation */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <Container className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16">
            <div className="w-full lg:w-1/2">
              <div className="relative group">
                <Image
                  src="/content-creator-ai-assistant.png"
                  alt="Results with Virallyzer"
                  width={800}
                  height={600}
                  className="rounded-3xl max-w-full h-auto transform group-hover:scale-105 transition-all duration-300"
                />
                {/* Glowing frame */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Success badges floating around image */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full font-bold shadow-2xl animate-bounce">
                  +300% Engagement!
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold shadow-2xl animate-bounce delay-500">
                  🔥 Going Viral!
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
                  💥 EXPLOSIVE RESULTS 💥
                </h2>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Real Creators, Real Success Stories
                </h3>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Join <span className="text-cyan-400 font-bold">50,000+ creators</span> who are already 
                  <span className="text-pink-400 font-bold"> crushing it</span> with AI-powered content!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    value: "10x",
                    label: "FASTER",
                    description: "Content creation speed",
                    icon: <Clock className="w-8 h-8" />,
                    gradient: "from-cyan-400 to-blue-500",
                    bgGradient: "from-cyan-500/20 to-blue-500/20"
                  },
                  {
                    value: "5x",
                    label: "ENGAGEMENT",
                    description: "More likes, shares & comments",
                    icon: <Target className="w-8 h-8" />,
                    gradient: "from-green-400 to-emerald-500",
                    bgGradient: "from-green-500/20 to-emerald-500/20"
                  },
                  {
                    value: "90%",
                    label: "NO BLOCKS",
                    description: "Say goodbye to creative blocks",
                    icon: <Lightbulb className="w-8 h-8" />,
                    gradient: "from-yellow-400 to-orange-500",
                    bgGradient: "from-yellow-500/20 to-orange-500/20"
                  },
                  {
                    value: "24/7",
                    label: "VIRAL READY",
                    description: "Always trending content",
                    icon: <BarChart className="w-8 h-8" />,
                    gradient: "from-purple-400 to-pink-500",
                    bgGradient: "from-purple-500/20 to-pink-500/20"
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`relative p-6 rounded-2xl bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm border-2 border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300 group cursor-pointer text-center`}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 mx-auto shadow-xl text-white transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {stat.icon}
                    </div>
                    
                    <div className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </div>
                    
                    <div className="text-white font-bold text-lg mb-1 group-hover:text-yellow-300 transition-colors">
                      {stat.label}
                    </div>
                    
                    <div className="text-gray-300 text-sm group-hover:text-white transition-colors">
                      {stat.description}
                    </div>

                    {/* Animated sparkles */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link href="/chat">
                  <CustomButton 
                    variant="primary" 
                    size="lg" 
                    animationType="shine" 
                    className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20 text-xl"
                  >
                    <span className="flex items-center">
                      <Crown className="mr-3 w-6 h-6" />
                      JOIN THE SUCCESS WAVE
                      <Flame className="ml-3 w-6 h-6" />
                    </span>
                  </CustomButton>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonials - Keep existing but add dark bg */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Testimonials />
      </div>

      {/* Pricing Section - Redesigned with vibrant pricing cards */}
      <Section id="pricing" className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-black via-purple-900 to-black relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Container className="relative z-10">
          <SectionHeader
            title={
              <span className="bg-gradient-to-r from-green-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                💰 CHOOSE YOUR SUCCESS PLAN 💰
              </span>
            }
            subtitle={
              <span className="text-yellow-300 font-bold text-2xl">
                From Beginner to Viral Superstar
              </span>
            }
            description={
              <span className="text-gray-200 text-xl leading-relaxed">
                Start creating <span className="text-yellow-400 font-bold">viral content today</span>. 
                No hidden fees, <span className="text-yellow-400 font-bold">cancel anytime</span>!
              </span>
            }
            titleClassName="text-4xl sm:text-5xl font-black"
            subtitleClassName="text-2xl font-bold"
            descriptionClassName="text-xl"
          />

          <div className="mt-8 sm:mt-12 mb-12 sm:mb-16">
            <OfferCountdown />
          </div>

          <PlanComparisonTable />

        </Container>
      </Section>

      {/* Guarantee Section */}
      <GuaranteeSection />

      {/* FAQ Section - Enhanced with dark theme */}
      <Section id="faq" className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(147, 197, 253, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 197, 253, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <Container className="relative z-10">
          <SectionHeader
            title={
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                ❓ YOUR QUESTIONS ANSWERED ❓
              </span>
            }
            subtitle={
              <span className="text-yellow-400 font-bold text-2xl">
                Everything You Need to Know
              </span>
            }
            description={
              <span className="text-gray-200 text-xl leading-relaxed">
                Got questions? We've got <span className="text-cyan-400 font-bold">crystal clear answers</span> 
                to help you get started on your <span className="text-pink-400 font-bold">viral journey</span>!
              </span>
            }
            titleClassName="text-4xl sm:text-5xl font-black"
            subtitleClassName="text-2xl font-bold"
            descriptionClassName="text-xl"
          />
          <FAQ />
        </Container>
      </Section>

      {/* CTA Section - Super vibrant final call to action */}
      <Section className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 relative overflow-hidden">
        {/* Explosive background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/20 via-transparent to-cyan-400/20"></div>
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <div className="w-2 h-2 bg-white rounded-full opacity-30"></div>
              </div>
            ))}
          </div>
        </div>

        <Container className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="text-6xl sm:text-8xl font-black mb-6 animate-pulse">
                <span className="bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent">
                  🚀 GO VIRAL NOW! 🚀
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
                Ready to <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">DOMINATE</span> 
                Social Media?
            </h2>
            </div>

            <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-8 border-4 border-white/30 mb-8">
              <p className="text-xl sm:text-2xl md:text-3xl mb-6 text-white font-bold leading-relaxed">
                Join <span className="text-yellow-300">50,000+ creators</span> who are already 
                <span className="text-cyan-300"> crushing it</span> with AI-powered content!
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-lg font-bold text-white mb-6">
                <div className="flex items-center bg-green-500/20 px-4 py-2 rounded-full border-2 border-green-400">
                  <span className="text-green-400 mr-2">✓</span> No Credit Card Required
                </div>
                <div className="flex items-center bg-blue-500/20 px-4 py-2 rounded-full border-2 border-blue-400">
                  <span className="text-blue-400 mr-2">✓</span> Start Creating in 60 Seconds
                </div>
                <div className="flex items-center bg-purple-500/20 px-4 py-2 rounded-full border-2 border-purple-400">
                  <span className="text-purple-400 mr-2">✓</span> Cancel Anytime
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Link href="/chat">
                <CustomButton
                  variant="white"
                  size="lg"
                  animationType="shine"
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black font-black py-6 px-12 rounded-xl shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white text-2xl"
                >
                  <span className="flex items-center">
                    <Rocket className="mr-4 w-8 h-8" />
                    START DOMINATING NOW
                    <Crown className="ml-4 w-8 h-8" />
                  </span>
                </CustomButton>
              </Link>
              <Link href="#features">
                <CustomButton
                  variant="outline"
                  size="lg"
                  animationType="scale"
                  className="border-4 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-6 px-12 rounded-xl shadow-2xl transform hover:scale-110 transition-all duration-300 text-xl"
                >
                  <span className="flex items-center">
                    <Sparkles className="mr-3 w-6 h-6" />
                    SEE ALL FEATURES
                  </span>
                </CustomButton>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-white text-lg sm:text-xl font-semibold mb-2">
                ⚡ <span className="text-yellow-300">LIMITED TIME:</span> Join now and get 
                <span className="text-cyan-300"> BONUS features</span> worth $200! ⚡
              </p>
              <p className="text-white/80 text-base">
                🔥 Offer expires in 24 hours - Don't miss out! 🔥
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Multilingual Welcome Section - Enhanced */}
      <Section className="py-8 sm:py-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <Container>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">🌍 GLOBAL CREATORS WELCOME! 🌍</h3>
            <p className="text-white/90">AI-powered content creation for creators worldwide</p>
              </div>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8">
            {[
              { text: "Welcome!", flag: "🇺🇸" },
              { text: "Willkommen!", flag: "🇩🇪" },
              { text: "¡Bienvenido!", flag: "🇪🇸" },
              { text: "Hoş geldin!", flag: "🇹🇷" },
              { text: "Bienvenue!", flag: "🇫🇷" },
              { text: "Bem-vindo!", flag: "🇧🇷" }
            ].map((welcome, index) => (
              <div key={index} className="flex items-center group cursor-pointer">
                <span className="text-2xl mr-2 group-hover:animate-bounce">{welcome.flag}</span>
                <span className="text-white text-lg font-semibold group-hover:text-yellow-300 transition-colors">
                  {welcome.text}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Footer - Enhanced with dark theme and vibrant accents */}
      <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-12 sm:py-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, cyan 1px, transparent 1px), radial-gradient(circle at 75% 75%, magenta 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 mr-3">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  {/* Glowing effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50"></div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                  Virallyzer
                </h1>
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                Your <span className="text-cyan-400 font-bold">AI-powered</span> content creation assistant for 
                <span className="text-pink-400 font-bold"> viral success</span> on all social media platforms.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Instagram, color: "from-purple-500 to-pink-500" },
                  { icon: Facebook, color: "from-blue-500 to-blue-600" },
                  { icon: Twitter, color: "from-cyan-400 to-blue-500" },
                  { icon: Linkedin, color: "from-blue-600 to-blue-700" },
                ].map((social, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      <social.icon className="w-5 h-5 text-white" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-4 text-white">Product</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <a href="#features" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-4 text-white">Support</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-4 text-white">Company</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-300 text-xs sm:text-sm">
            <p>&copy; {new Date().getFullYear()} Virallyzer. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}
