"use client"

import { Header } from "./header"
import { Container } from "./container"
import { Section } from "./section"
import { SectionHeader } from "./section-header"
import { Testimonials } from "./testimonials"
import { PlanComparisonTable } from "./plan-comparison-table"
import { FAQ } from "./faq"
import { Button } from "../ui/button"
import { StatCard } from "./stat-card"
import { OfferCountdown } from "./offer-countdown"
import { ChatDemo } from "./chat-demo"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Sparkles,
  Zap,
  Target,
  BarChart,
  ArrowRight,
  Star,
  Rocket,
  Crown,
  Flame,
} from "lucide-react"
import { GuaranteeSection } from "./guarantee-section"
import { Footer } from "./footer"
import { FeaturesGrid } from "./features-grid"
import { MagicSteps } from "./magic-steps"
import { GoViralCTA } from "./go-viral-cta"
import { PlatformIconsBar } from "./PlatformIconsBar"
import { GlobalCreatorsWelcomeSection } from "./GlobalCreatorsWelcomeSection"

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const explosiveResultsStats = [
    { value: "10x", label: "FASTER", description: "Content creation speed", icon: <Rocket className="w-8 h-8 text-pink-500" /> },
    { value: "5x", label: "ENGAGEMENT", description: "More likes, shares & comments", icon: <Sparkles className="w-8 h-8 text-yellow-500" /> },
    { value: "90%", label: "NO BLOCKS", description: "Say goodbye to creative blocks", icon: <Zap className="w-8 h-8 text-green-500" /> },
    { value: "24/7", label: "VIRAL READY", description: "Always trending content", icon: <Target className="w-8 h-8 text-purple-500" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <Header />

      {/* Hero Section */}
      <Section className="pt-12 sm:pt-16 md:pt-24 pb-8 sm:pb-12 overflow-hidden relative">
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
                  Our advanced AI doesn't just make content viral - it creates viral content that converts viewers into buyers. While others chase likes, you'll be counting profits!
                </p>
              </div>

              <div className="mt-6 space-y-3 text-center lg:text-left">
                <p className="text-xl font-semibold text-cyan-300 animate-pulse">
                  <span role="img" aria-label="lightning bolt" className="mr-2">⚡</span>
                  Generate viral content in under 60 seconds
                  <span role="img" aria-label="lightning bolt" className="ml-2">⚡</span>
                </p>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-yellow-400">
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <span className="text-sm text-gray-200 ml-2">
                    <strong>4.9/5</strong> "This AI tool increased my engagement by 300%..." - Sarah, Content Creator
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start mt-8">
                <Link href="/chat">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center text-lg">
                      <Rocket className="mr-3 w-6 h-6" />
                      START FREE NOW
                      <ArrowRight className="ml-3 w-6 h-6" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
              <div className="relative z-10">
                <ChatDemo />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Platform Icons Bar Section */}
      <PlatformIconsBar />

      {/* Features Grid Section */}
      <FeaturesGrid />

      {/* How the Magic Happens Section */}
      <MagicSteps />

      {/* Explosive Results Section */}
      <Section id="explosive-results" className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-gray-900 via-purple-950 to-black">
        <Container>
          <SectionHeader
            title={
              <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                <span role="img" aria-label="explosion" className="mr-2">💥</span>
                EXPLOSIVE RESULTS
                <span role="img" aria-label="explosion" className="ml-2">💥</span>
              </span>
            }
            subtitle="Real Creators, Real Success Stories"
            description="Join 50,000+ creators who are already crushing it with AI-powered content!"
            titleClassName="text-4xl sm:text-5xl font-black text-white"
            subtitleClassName="text-xl text-yellow-300 font-semibold"
            descriptionClassName="text-lg text-gray-300"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-12">
            {explosiveResultsStats.map((stat) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                description={stat.description}
                icon={stat.icon}
                isAI={false}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Testimonials />
      </div>

      {/* Pricing Section */}
      <Section id="pricing" className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-black via-purple-900 to-black relative overflow-hidden">
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
          
          <div className="my-8 flex justify-center">
            <OfferCountdown targetDate={new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)} />
          </div>

          <PlanComparisonTable />
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section id="faq" className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden">
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
                Have questions? We have <span className="text-cyan-400 font-bold">crystal clear answers</span> 
                to help you start your <span className="text-pink-400 font-bold">viral journey</span>!
              </span>
            }
            titleClassName="text-4xl sm:text-5xl font-black"
            subtitleClassName="text-2xl font-bold"
            descriptionClassName="text-xl"
          />
          <FAQ />
        </Container>
      </Section>

      {/* Our Triple Guarantee Section */}
      <GuaranteeSection />

      {/* Go Viral Now CTA Section */}
      <GoViralCTA />

      {/* Global Creators Welcome Section */}
      <GlobalCreatorsWelcomeSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
