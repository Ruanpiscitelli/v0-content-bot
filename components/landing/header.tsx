"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MobileMenu } from "./mobile-menu"
import { Container } from "./container"
import { Button } from "../ui/button"
import { Menu, X, Rocket, Sparkles } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-lg shadow-2xl py-2 border-b-2 border-gray-200" 
          : "bg-black/20 backdrop-blur-md py-4 border-b border-white/20"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="relative w-12 h-12 mr-3">
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            </div>
            <h1 className={`text-2xl font-black transition-all duration-300 ${
              isScrolled 
                ? "text-transparent bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text" 
                : "text-white drop-shadow-lg"
            }`}>
              Virallyzer
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="#features" 
              className={`font-bold text-lg transition-all duration-300 hover:scale-110 ${
                isScrolled 
                  ? "text-gray-800 hover:text-purple-600" 
                  : "text-white hover:text-cyan-400 drop-shadow-lg"
              }`}
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className={`font-bold text-lg transition-all duration-300 hover:scale-110 ${
                isScrolled 
                  ? "text-gray-800 hover:text-purple-600" 
                  : "text-white hover:text-cyan-400 drop-shadow-lg"
              }`}
            >
              How it Works
            </Link>
            <Link 
              href="#pricing" 
              className={`font-bold text-lg transition-all duration-300 hover:scale-110 ${
                isScrolled 
                  ? "text-gray-800 hover:text-purple-600" 
                  : "text-white hover:text-cyan-400 drop-shadow-lg"
              }`}
            >
              Pricing
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button 
                variant="outline" 
                size="sm"
                className={`transition-all duration-300 font-bold ${
                  isScrolled 
                    ? "border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white" 
                    : "border-2 border-white/50 bg-white/20 text-white hover:bg-white/30 hover:border-white drop-shadow-lg"
                }`}
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                variant="default" 
                size="sm" 
                className={`font-semibold border transition-all duration-300 transform hover:scale-105 ${
                  isScrolled 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-500 shadow-lg" 
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-blue-400/50 shadow-xl"
                }`}
              >
                Sign Up Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isScrolled 
                ? "text-gray-800 hover:text-purple-600 hover:bg-purple-100" 
                : "text-white hover:text-cyan-400 hover:bg-white/20 drop-shadow-lg"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} className="font-bold" /> : <Menu size={28} className="font-bold" />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />}
    </header>
  )
}
