"use client"

import { useState, useEffect } from "react"
import { Bot, Sparkles, ArrowRight } from "lucide-react"

interface ChatDemoProps {
  className?: string
}

export function ChatDemo({ className }: ChatDemoProps) {
  const [typedText, setTypedText] = useState("")
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  const aiPrompts = [
    "Create a viral Instagram post about sustainable fashion",
    "Write a LinkedIn article about AI in marketing",
    "Generate a Twitter thread about content strategy",
    "Design a Facebook ad campaign for a new product launch",
  ]

  // Typing effect for AI prompts
  useEffect(() => {
    const text = aiPrompts[currentTextIndex]
    let timer: NodeJS.Timeout

    if (isTyping) {
      if (typedText.length < text.length) {
        timer = setTimeout(() => {
          setTypedText(text.substring(0, typedText.length + 1))
        }, 50)
      } else {
        setIsTyping(false)
        timer = setTimeout(() => {
          setIsTyping(true)
          setTypedText("")
          setCurrentTextIndex((currentTextIndex + 1) % aiPrompts.length)
        }, 3000)
      }
    }

    return () => clearTimeout(timer)
  }, [typedText, currentTextIndex, isTyping, aiPrompts])

  return (
    <div className={`relative max-w-full ${className}`}>
      <div className="relative z-10 bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200 cartoon-border mx-auto max-w-md lg:max-w-full">
        <div className="bg-gray-50 p-3 sm:p-4 border-b border-gray-200 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="mx-auto flex items-center">
            <Bot className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium">Virallyzer AI Assistant</span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-start mb-4 sm:mb-6">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3 rounded-tl-none max-w-xs">
              <p className="text-sm text-gray-700">What type of content would you like to create today?</p>
            </div>
          </div>

          <div className="flex items-start mb-4 sm:mb-6">
            <div className="bg-primary/10 rounded-lg p-3 rounded-tr-none max-w-xs ml-auto">
              <p className="text-sm text-gray-700">
                {typedText}
                <span
                  className={`inline-block w-1 h-4 ml-0.5 bg-primary ${isTyping ? "animate-pulse" : "opacity-0"}`}
                ></span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-3 mt-1 flex-shrink-0">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3 rounded-tl-none flex-grow">
              <div className="flex items-center mb-2">
                <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  Generating
                </span>
                <span className="ml-2 flex">
                  <span className="animate-bounce mx-0.5 delay-0">.</span>
                  <span className="animate-bounce mx-0.5 delay-150">.</span>
                  <span className="animate-bounce mx-0.5 delay-300">.</span>
                </span>
              </div>
              <div className="h-16 sm:h-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-3 sm:p-4">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
            <input
              type="text"
              placeholder="Type your content request..."
              className="flex-1 bg-transparent border-0 focus:ring-0 text-sm"
              disabled
            />
            <button className="ml-2 bg-primary text-white rounded-full p-1.5" disabled>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -right-6 w-48 sm:w-64 h-48 sm:h-64 bg-primary/30 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -top-6 -left-6 w-32 sm:w-48 h-32 sm:h-48 bg-purple-200 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
    </div>
  )
}
