"use client"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

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
        "overflow-hidden border-none shadow-custom shadow-custom-hover",
        aiAssisted ? "bg-gradient-to-br from-white to-primary/5" : "",
        className,
      )}
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-yellow-500">★★★★★</div>
            {aiAssisted && (
              <div className="ml-auto flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Assisted
              </div>
            )}
          </div>
          <div className="relative">
            <p className="text-foreground mb-4 italic">"{quote}"</p>
          </div>

          {metrics && (
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
              {metrics.engagement && (
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="font-bold text-primary">{metrics.engagement}</div>
                  <div className="text-foreground">Engagement</div>
                </div>
              )}
              {metrics.growth && (
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="font-bold text-primary">{metrics.growth}</div>
                  <div className="text-foreground">Growth</div>
                </div>
              )}
              {metrics.time && (
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="font-bold text-primary">{metrics.time}</div>
                  <div className="text-foreground">Time Saved</div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <Image
              src={avatar || "/placeholder.svg"}
              alt={author}
              width={60}
              height={60}
              className="rounded-full border-2 border-primary/20"
            />
            <div>
              <p className="font-medium text-foreground">{author}</p>
              <p className="text-sm text-foreground">{role}</p>
            </div>
            {verified && (
              <div className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">✓ Verified</div>
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
    <div className="grid gap-6 md:grid-cols-3">
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
