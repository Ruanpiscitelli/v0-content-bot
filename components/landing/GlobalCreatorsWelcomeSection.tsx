"use client"

import { Section } from "./section"
import { Container } from "./container"

export function GlobalCreatorsWelcomeSection() {
  const welcomes = [
    { lang: "🇺🇸", text: "Welcome!" },
    { lang: "🇩🇪", text: "Willkommen!" },
    { lang: "🇪🇸", text: "¡Bienvenido!" },
    { lang: "🇹🇷", text: "Hoş geldin!" },
    { lang: "🇫🇷", text: "Bienvenue!" },
    { lang: "🇧🇷", text: "Bem-vindo!" },
  ]

  return (
    <Section className="py-8 sm:py-12 bg-gradient-to-r from-gray-800 via-slate-900 to-gray-800">
      <Container>
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            <span role="img" aria-label="globe" className="mr-2">🌍</span>
            GLOBAL CREATORS WELCOME!
            <span role="img" aria-label="globe" className="ml-2">🌍</span>
          </h2>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-8 gap-y-4">
          {welcomes.map((welcome) => (
            <div key={welcome.lang} className="flex items-center bg-white/10 backdrop-blur-sm p-3 rounded-lg shadow-md hover:bg-white/20 transition-all">
              <span className="text-2xl mr-2">{welcome.lang}</span>
              <span className="text-sm sm:text-base text-gray-200 font-medium">
                {welcome.text}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
} 