"use client"

import { Instagram, Facebook, Twitter, Linkedin, Youtube } from "lucide-react"
import { Section } from "./section"
import { Container } from "./container"

export function PlatformIconsBar() {
  const platforms = [
    { name: "Instagram", icon: <Instagram className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500" /> },
    { name: "Facebook", icon: <Facebook className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" /> },
    { name: "Twitter", icon: <Twitter className="w-8 h-8 sm:w-10 sm:h-10 text-sky-500" /> },
    { name: "LinkedIn", icon: <Linkedin className="w-8 h-8 sm:w-10 sm:h-10 text-blue-700" /> },
    { name: "YouTube", icon: <Youtube className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" /> },
  ]

  return (
    <Section className="py-8 sm:py-12 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
      <Container>
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            <span role="img" aria-label="stars" className="mr-2">🌟</span>
            CREATE CONTENT FOR ALL PLATFORMS
            <span role="img" aria-label="stars" className="ml-2">🌟</span>
          </h2>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12">
          {platforms.map((platform) => (
            <div key={platform.name} className="flex flex-col items-center group">
              {platform.icon}
              <span className="mt-2 text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                {platform.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
} 