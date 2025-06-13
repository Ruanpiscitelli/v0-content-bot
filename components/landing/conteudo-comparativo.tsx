"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkles, Zap, ChevronUp, Clock, MessageSquare, TrendingUp, ArrowRight, Check, X } from "lucide-react"
import { Button } from "../ui/button"
import { motion } from "framer-motion"

export function ConteudoComparativo() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("depois") // 'antes' or 'depois'
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle intersection observer to trigger animations when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      },
      { threshold: 0.2 },
    )

    const section = sectionRef.current
    if (section) observer.observe(section)

    return () => {
      if (section) observer.unobserve(section)
    }
  }, [])

  // Handle auto-toggle between tabs
  useEffect(() => {
    if (isAutoPlaying && isVisible) {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveTab((prev) => (prev === "antes" ? "depois" : "antes"))
      }, 5000)
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current)
      }
    }
  }, [isAutoPlaying, isVisible])

  // Stop auto-play when user interacts with tabs
  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    setIsAutoPlaying(false)

    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
    }
  }

  // Resume auto-play
  const handleResumeAutoPlay = () => {
    setIsAutoPlaying(true)
  }

  return (
    <section
      id="transformacao-section"
      ref={sectionRef}
      className="w-full py-16 px-4 bg-gradient-to-br from-primary-dark via-primary to-primary-light relative overflow-hidden"
      aria-labelledby="transformacao-title"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-yellow-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div
            className={`inline-block transition-all duration-1000 ${
              isVisible ? "opacity-100 transform-none" : "opacity-0 -translate-y-10"
            }`}
          >
            <div className="bg-gradient-to-r from-accent via-white to-secondary text-transparent bg-clip-text relative">
              <h2 id="transformacao-title" className="text-5xl md:text-7xl font-extrabold mb-3">
                Antes vs. Depois
              </h2>
              <div className="absolute -top-6 -right-6">
                <Sparkles className="text-yellow-400 w-12 h-12 animate-ping opacity-75" />
              </div>
            </div>
            <div className="relative">
              <h3 className="text-3xl font-bold text-white">
                da{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">Bebel</span>
              </h3>
              <div className="absolute h-2 w-24 bg-gradient-to-r from-accent to-secondary rounded-full mx-auto left-0 right-0 bottom-0"></div>
            </div>
          </div>

          <p
            className={`text-xl text-blue-100 max-w-3xl mx-auto mt-8 transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-10"
            }`}
          >
            Veja a transformação real no conteúdo e nos resultados das nossas criadoras
          </p>
        </div>

        {/* Tabs for both mobile and desktop */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => handleTabClick("antes")}
            className={`py-2 px-6 rounded-full font-bold transition-all text-lg ${
              activeTab === "antes"
                ? "bg-red-500 text-white shadow-lg scale-105"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-700/70"
            }`}
            aria-pressed={activeTab === "antes"}
            aria-label="Ver conteúdo antes da Bebel"
          >
            ANTES
          </button>
          <button
            onClick={() => handleTabClick("depois")}
            className={`py-2 px-6 rounded-full font-bold transition-all text-lg ${
              activeTab === "depois"
                ? "bg-green-500 text-white shadow-lg scale-105"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-700/70"
            }`}
            aria-pressed={activeTab === "depois"}
            aria-label="Ver conteúdo depois da Bebel"
          >
            DEPOIS
          </button>
          {!isAutoPlaying && (
            <button
              onClick={handleResumeAutoPlay}
              className="py-2 px-4 rounded-full text-sm text-gray-300 hover:text-white transition-colors"
              aria-label="Retomar alternância automática"
            >
              Auto
            </button>
          )}
        </div>

        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-20"
          }`}
        >
          <div className="relative">
            {/* ANTES Card */}
            <div
              className={`w-full md:w-[85%] mx-auto transition-all duration-700 ${
                activeTab === "antes"
                  ? "opacity-100 z-20 translate-y-0"
                  : "opacity-0 absolute inset-0 -translate-y-8 pointer-events-none"
              }`}
              aria-hidden={activeTab !== "antes"}
            >
              <div className="relative">
                <div className="absolute -top-12 -left-8 bg-red-500 text-white font-extrabold py-2 px-6 rounded-full text-xl shadow-lg transform -rotate-12">
                  ANTES
                </div>
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-2xl p-6 shadow-xl">
                  <div className="bg-white rounded-xl p-6 border-2 border-slate-300 relative">
                    <div className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full py-1 px-3 text-sm font-bold border border-red-200">
                      Resultado Fraco
                    </div>
                    <blockquote className="text-xl italic text-slate-700 relative">
                      <div className="absolute -top-2 -left-2 text-4xl text-gray-200">"</div>
                      Oi gente! Hoje tem conteúdo novo lá no meu privado. Quem quiser ver é só assinar o link na bio!
                      <div className="absolute -bottom-2 -right-2 text-4xl text-gray-200">"</div>
                    </blockquote>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-b-2xl p-6 text-white shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <TrendingUp className="mr-2" size={20} />
                        <p className="font-bold text-lg">Taxa de conversão</p>
                      </div>
                      <div className="relative h-8 bg-red-800 rounded-full overflow-hidden">
                        <div className="absolute inset-0 w-1/4 h-full bg-red-300 rounded-full flex items-center pl-3">
                          <span className="font-bold text-red-900">2.1%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <MessageSquare className="mr-2" size={20} />
                        <p className="font-bold text-lg">Engajamento</p>
                      </div>
                      <div className="flex items-center">
                        <div className="text-4xl font-extrabold">15</div>
                        <div className="ml-2 text-red-200">comentários</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Clock className="mr-2" size={20} />
                        <p className="font-bold text-lg">Tempo de criação</p>
                      </div>
                      <div className="flex items-center">
                        <div className="text-4xl font-extrabold">45</div>
                        <div className="ml-2 text-red-200">minutos</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DEPOIS Card */}
            <div
              className={`w-full md:w-[85%] mx-auto transition-all duration-700 ${
                activeTab === "depois"
                  ? "opacity-100 z-20 translate-y-0"
                  : "opacity-0 absolute inset-0 -translate-y-8 pointer-events-none"
              }`}
              aria-hidden={activeTab !== "depois"}
            >
              <div className="relative">
                <div className="absolute -top-12 -right-8 bg-green-500 text-white font-extrabold py-2 px-6 rounded-full text-xl shadow-lg transform rotate-12">
                  DEPOIS
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-2xl p-6 shadow-xl">
                  <div className="bg-white rounded-xl p-6 border-2 border-blue-300 relative">
                    <div className="absolute -top-3 -right-3 bg-green-100 text-green-600 rounded-full py-1 px-3 text-sm font-bold border border-green-200">
                      Resultado Incrível
                    </div>
                    <blockquote className="text-xl italic text-slate-700 relative">
                      <div className="absolute -top-2 -left-2 text-4xl text-gray-200">"</div>
                      Acabei de postar aquele vídeo que você pediu... sim, AQUELE 🔥 Os primeiros 10 assinantes hoje
                      ganham um presente especial no privado. Link na bio para descobrir o que é... 😈
                      <div className="absolute -bottom-2 -right-2 text-4xl text-gray-200">"</div>
                    </blockquote>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-b-2xl p-6 text-white shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <TrendingUp className="mr-2" size={20} />
                        <p className="font-bold text-lg">Taxa de conversão</p>
                      </div>
                      <div className="relative h-8 bg-green-800 rounded-full overflow-hidden">
                        <div className="absolute inset-0 w-4/5 h-full bg-green-300 rounded-full flex items-center pl-3">
                          <span className="font-bold text-green-900">8.7%</span>
                        </div>
                      </div>
                      <div className="flex items-center mt-1 text-green-200 text-sm">
                        <ChevronUp className="mr-1" size={16} />
                        <span>313% de aumento</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <MessageSquare className="mr-2" size={20} />
                        <p className="font-bold text-lg">Engajamento</p>
                      </div>
                      <div className="flex items-center">
                        <div className="text-4xl font-extrabold">78</div>
                        <div className="ml-2 text-green-200">comentários</div>
                      </div>
                      <div className="flex items-center mt-1 text-green-200 text-sm">
                        <ChevronUp className="mr-1" size={16} />
                        <span>420% de aumento</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Clock className="mr-2" size={20} />
                        <p className="font-bold text-lg">Tempo de criação</p>
                      </div>
                      <div className="flex items-center">
                        <div className="text-4xl font-extrabold">5</div>
                        <div className="ml-2 text-green-200">minutos</div>
                      </div>
                      <div className="flex items-center mt-1 text-green-200 text-sm">
                        <ChevronUp className="mr-1" size={16} />
                        <span>89% menos tempo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Zap Icon - Always visible */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 hidden md:block">
              <div className="w-20 h-20 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center shadow-xl border-4 border-white animate-pulse">
                <Zap size={32} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Examples Carousel */}
        <div
          className={`mt-16 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="text-2xl font-bold text-white text-center mb-6">Mais exemplos de transformação</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-red-500 text-white rounded-full p-2 shrink-0">
                  <span className="font-bold">A</span>
                </div>
                <div>
                  <p className="text-white/80 italic">"Oi pessoal, não esqueçam de assinar meu conteúdo exclusivo!"</p>
                  <p className="text-red-200 text-sm mt-2">Resultado: 1.8% de conversão</p>
                </div>
              </div>
              <div className="h-0.5 bg-white/20 my-4"></div>
              <div className="flex items-start gap-4">
                <div className="bg-green-500 text-white rounded-full p-2 shrink-0">
                  <span className="font-bold">D</span>
                </div>
                <div>
                  <p className="text-white italic">
                    "Você pediu, eu entreguei... 🔥 Só os primeiros 5 que responderem 'quero' ganham 30% OFF no meu
                    conteúdo exclusivo hoje!"
                  </p>
                  <p className="text-green-200 text-sm mt-2">Resultado: 7.5% de conversão (+316%)</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-red-500 text-white rounded-full p-2 shrink-0">
                  <span className="font-bold">A</span>
                </div>
                <div>
                  <p className="text-white/80 italic">
                    "Bom dia! Espero que gostem da minha nova foto. Comentem o que acharam!"
                  </p>
                  <p className="text-red-200 text-sm mt-2">Resultado: 23 comentários</p>
                </div>
              </div>
              <div className="h-0.5 bg-white/20 my-4"></div>
              <div className="flex items-start gap-4">
                <div className="bg-green-500 text-white rounded-full p-2 shrink-0">
                  <span className="font-bold">D</span>
                </div>
                <div>
                  <p className="text-white italic">
                    "Qual você prefere: essa pose ou a do story de ontem? 👀 Vou fazer mais fotos no estilo que vocês
                    escolherem..."
                  </p>
                  <p className="text-green-200 text-sm mt-2">Resultado: 94 comentários (+309%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div
          className={`mt-16 text-center transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-10"
          }`}
        >
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
            Transforme seu Conteúdo Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-white/80 mt-4 text-sm">Resultados baseados em dados reais de nossas criadoras</p>
        </div>
      </div>
    </section>
  )
}
