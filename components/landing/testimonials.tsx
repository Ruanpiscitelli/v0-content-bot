"use client"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Sparkles, Star, Crown, Flame } from "lucide-react"

interface TestimonialProps {
  quote: string
  author: string
  role: string
  avatar: string
  verified?: boolean
  aiAssisted?: boolean
  className?: string
  metrics?: {
    engagement?: string
    growth?: string
    time?: string
  }
}

function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  verified = false,
  aiAssisted = false,
  metrics,
  className,
}: TestimonialProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-4 border-gray-800 shadow-2xl transform hover:scale-105 transition-all duration-300",
        aiAssisted 
          ? "bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" 
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-black",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            {aiAssisted && (
              <div className="ml-auto flex items-center text-sm font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-500 px-3 py-1 rounded-full shadow-lg">
                <Sparkles className="h-4 w-4 mr-1" />
                AI-Assisted
              </div>
            )}
          </div>
          <div className="relative">
            <p className="text-white text-lg mb-4 italic font-medium leading-relaxed">"{quote}"</p>
          </div>

          {metrics && (
            <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
              {metrics.engagement && (
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-3 rounded-xl text-center border-2 border-green-400 shadow-lg">
                  <div className="font-black text-xl text-white">{metrics.engagement}</div>
                  <div className="text-green-200 font-semibold">Engagement</div>
                </div>
              )}
              {metrics.growth && (
                <div className="bg-gradient-to-br from-orange-600 to-red-700 p-3 rounded-xl text-center border-2 border-orange-400 shadow-lg">
                  <div className="font-black text-xl text-white">{metrics.growth}</div>
                  <div className="text-orange-200 font-semibold">Growth</div>
                </div>
              )}
              {metrics.time && (
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-3 rounded-xl text-center border-2 border-blue-400 shadow-lg">
                  <div className="font-black text-xl text-white">{metrics.time}</div>
                  <div className="text-blue-200 font-semibold">Time Saved</div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={avatar || "/placeholder.svg"}
                alt={author}
                width={70}
                height={70}
                className="rounded-full border-4 border-gradient-to-r from-cyan-400 to-purple-500 shadow-xl"
              />
              {verified && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-1 border-2 border-white shadow-lg">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-black text-xl text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text mb-1">
                {author}
              </p>
              <p className="text-base text-gray-300 font-semibold">{role}</p>
            </div>
            {verified && (
              <div className="flex items-center text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-full font-bold shadow-lg border-2 border-green-400">
                <Crown className="w-4 h-4 mr-1" />
                Verified
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Virallyzer changed everything! My followers noticed the difference. My income increased 52% in the first month!",
      author: "Gisela_vip",
      role: "Content Creator, 2 years",
      avatar: "/woman-profile.png",
      verified: true,
      aiAssisted: true,
      metrics: {
        engagement: "+78%",
        growth: "+52%",
        time: "5h/week",
      },
    },
    {
      quote: "I never imagined this would work so well! Virallyzer understands exactly what my followers want to read.",
      author: "@marianaof",
      role: "Creator, 3 months",
      avatar: "/placeholder.svg?key=testimonial-2",
      verified: true,
      metrics: {
        engagement: "+45%",
        time: "4h/week",
      },
    },
    {
      quote:
        "My insecurity about my content is gone! Now I enhance my work and make a difference. Thank you, Virallyzer!",
      author: "@julianamel",
      role: "Creator, 6 months",
      avatar: "/placeholder.svg?key=testimonial-3",
      verified: true,
      aiAssisted: true,
      metrics: {
        growth: "+38%",
        time: "6h/week",
      },
    },
  ]

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <TestimonialCard
          key={index}
          quote={testimonial.quote}
          author={testimonial.author}
          role={testimonial.role}
          avatar={testimonial.avatar}
          verified={testimonial.verified}
          aiAssisted={testimonial.aiAssisted}
          metrics={testimonial.metrics}
        />
      ))}
    </div>
  )
}
