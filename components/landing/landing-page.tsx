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
} from "lucide-react"

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section - Updated for AI Content Creation */}
      <Section className="pt-12 sm:pt-16 md:pt-24 pb-12 sm:pb-16 md:pb-20 overflow-hidden" background="ai-light">
        <Container size="xl">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-12">
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium mb-2 cartoon-border">
                <span className="flex items-center">
                  <BrainCircuit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  AI-Powered Content Creation
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Create <span className="text-primary">Engaging Content</span> with AI in Seconds
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 mt-3 sm:mt-4">
                  Virallyzer uses advanced AI to generate high-converting content for all your social media channels,
                  saving you time and boosting engagement.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link href="/chat">
                  <CustomButton variant="primary" size="lg" animationType="shine">
                    <span className="flex items-center">
                      Try Free <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                  </CustomButton>
                </Link>
                <Link href="#how-it-works">
                  <CustomButton variant="outline" size="lg" animationType="scale">
                    <span className="flex items-center">
                      See How It Works <Wand2 className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                  </CustomButton>
                </Link>
              </div>

              <div className="pt-3 sm:pt-4 text-xs sm:text-sm text-gray-500 flex items-center justify-center lg:justify-start">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>Generate content in less than 60 seconds</span>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <ChatDemo />
            </div>
          </div>

          <div className="mt-12 sm:mt-16 md:mt-24">
            <div className="text-center text-gray-500 text-xs sm:text-sm uppercase font-medium mb-4 sm:mb-6">
              Create content for all platforms
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
              <div className="flex flex-col items-center">
                <Instagram className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                <span className="mt-1 sm:mt-2 text-xs sm:text-sm">Instagram</span>
              </div>
              <div className="flex flex-col items-center">
                <Facebook className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                <span className="mt-1 sm:mt-2 text-xs sm:text-sm">Facebook</span>
              </div>
              <div className="flex flex-col items-center">
                <Twitter className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                <span className="mt-1 sm:mt-2 text-xs sm:text-sm">Twitter</span>
              </div>
              <div className="flex flex-col items-center">
                <Linkedin className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                <span className="mt-1 sm:mt-2 text-xs sm:text-sm">LinkedIn</span>
              </div>
              <div className="flex flex-col items-center">
                <Youtube className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                <span className="mt-1 sm:mt-2 text-xs sm:text-sm">YouTube</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section id="features" className="py-12 sm:py-16 md:py-24" background="light">
        <Container>
          <SectionHeader
            title="Create content that engages your audience"
            subtitle="Powerful features for content creators"
            description="Virallyzer combines advanced artificial intelligence with proven marketing strategies to generate content that truly connects with your audience."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
              title="AI Content Generation"
              description="Create posts, captions, and texts optimized for each platform with a single prompt."
            />

            <FeatureCard
              icon={<Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
              title="Creative Ideas"
              description="Never run out of ideas. Generate creative concepts for your next content in seconds."
            />

            <FeatureCard
              icon={<Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
              title="Content Planning"
              description="Organize your content calendar and schedule publications in advance."
            />

            <FeatureCard
              icon={<Palette className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
              title="Style Customization"
              description="Adapt the tone, style, and personality of the content to reflect your brand."
            />

            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
              title="Trend Analysis"
              description="Discover trending topics and relevant trends for your niche."
            />

            <FeatureCard
              icon={<Layers className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />}
              title="Multiple Formats"
              description="Create content for posts, stories, reels, videos, and much more."
            />
          </div>
        </Container>
      </Section>

      {/* How It Works Section */}
      <Section id="how-it-works" className="py-12 sm:py-16 md:py-24" background="white">
        <Container>
          <SectionHeader
            title="How it works"
            subtitle="Simple and efficient"
            description="In just three steps, transform your ideas into publication-ready content."
          />

          <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <StepCard
              number={1}
              title="Describe your idea"
              description="Type what you need: an Instagram post, a Twitter thread, or ideas for your next video."
              icon={<MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />}
            />

            <StepCard
              number={2}
              title="Customize the content"
              description="Adjust the tone, style, and format to perfectly fit your brand and audience."
              icon={<Palette className="w-5 h-5 sm:w-6 sm:h-6" />}
            />

            <StepCard
              number={3}
              title="Publish and track"
              description="Save, schedule, or publish directly. Track performance and optimize your next content."
              icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6" />}
            />
          </div>

          <div className="mt-10 sm:mt-16 text-center">
            <Link href="/chat">
              <CustomButton variant="primary" size="lg" animationType="shine">
                Try Now
              </CustomButton>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Results Section */}
      <Section className="py-12 sm:py-16 md:py-24" background="light">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <Image
                  src="/content-creator-ai-assistant.png"
                  alt="Results with Virallyzer"
                  width={800}
                  height={600}
                  className="rounded-lg cartoon-border max-w-full h-auto"
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Real results for content creators</h2>
                <p className="text-base sm:text-lg text-gray-600 mt-3 sm:mt-4">
                  Our users are transforming their content production and achieving impressive results.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <StatCard
                  value="10x"
                  label="Faster"
                  description="Drastically reduce creation time"
                  icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                />

                <StatCard
                  value="3x"
                  label="More engagement"
                  description="Content optimized for your audience"
                  icon={<Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                />

                <StatCard
                  value="80%"
                  label="Less creative block"
                  description="Never run out of ideas to create"
                  icon={<Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                />

                <StatCard
                  value="5x"
                  label="More consistency"
                  description="Maintain a constant content calendar"
                  icon={<BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                />
              </div>

              <div>
                <Link href="/chat">
                  <CustomButton variant="primary" size="lg" animationType="shine" className="mt-4 sm:mt-6">
                    Start Creating Now
                  </CustomButton>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing Section */}
      <Section id="pricing" className="py-12 sm:py-16 md:py-24" background="white">
        <Container>
          <SectionHeader
            title="Plans for all creators"
            subtitle="Simple and transparent pricing"
            description="Choose the ideal plan for your content creation needs."
          />

          <div className="mt-6 sm:mt-8 mb-8 sm:mb-12">
            <OfferCountdown />
          </div>

          <PlanComparisonTable />

          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-gray-600 mb-4 sm:mb-6">Questions about which plan to choose? Contact us.</p>
            <Link href="/chat">
              <CustomButton variant="outline" size="lg" animationType="scale">
                Contact Us
              </CustomButton>
            </Link>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <Section className="py-12 sm:py-16 md:py-24" background="primary">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
              Ready to revolutionize your content creation?
            </h2>

            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90">
              Join thousands of creators who are saving time and creating better content with Virallyzer.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/chat">
                <CustomButton
                  variant="white"
                  size="lg"
                  animationType="shine"
                  className="text-primary hover:text-primary-dark cartoon-button"
                >
                  Start Free
                </CustomButton>
              </Link>
              <Link href="#features">
                <CustomButton
                  variant="outline"
                  size="lg"
                  animationType="scale"
                  className="text-white border-white hover:bg-white/10 cartoon-button"
                >
                  See Features
                </CustomButton>
              </Link>
            </div>

            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-white/80">
              No credit card required. Start with the free plan today.
            </p>
          </div>
        </Container>
      </Section>

      {/* Multilingual Welcome Section */}
      <Section className="py-6 sm:py-8" background="white">
        <Container>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-8">
            <div className="flex items-center">
              <span className="text-primary text-sm sm:text-base font-medium">Welcome!</span>
              <div className="ml-1 sm:ml-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-primary/30">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-4 sm:h-4"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-primary text-sm sm:text-base font-medium">Willkommen!</span>
              <div className="ml-1 sm:ml-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-primary/30">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-4 sm:h-4"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-primary text-sm sm:text-base font-medium">¡Bienvenido!</span>
              <div className="ml-1 sm:ml-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-primary/30">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-4 sm:h-4"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-primary text-sm sm:text-base font-medium">Hoş geldin!</span>
              <div className="ml-1 sm:ml-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-primary/30">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-4 sm:h-4"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-primary text-sm sm:text-base font-medium">Bienvenue!</span>
              <div className="ml-1 sm:ml-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-primary/30">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-4 sm:h-4"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-2">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path
                      d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5Z"
                      fill="white"
                      stroke="black"
                      strokeWidth="2"
                    />
                    <path
                      d="M15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15Z"
                      fill="black"
                    />
                    <path
                      d="M29 15C29 16.6569 27.6569 18 26 18C24.3431 18 23 16.6569 23 15C23 13.3431 24.3431 12 26 12C27.6569 12 29 13.3431 29 15Z"
                      fill="black"
                    />
                    <path
                      d="M13 22C13 22 15 25 20 25C25 25 27 22 27 22"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">Virallyzer</h1>
              </div>
              <p className="text-xs sm:text-sm text-gray-400">
                Your AI-powered content creation assistant for all social media platforms.
              </p>
              <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-4">Product</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-4">Support</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-4">Company</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>&copy; {new Date().getFullYear()} Virallyzer. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}
