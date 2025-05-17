"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MobileMenu } from "./mobile-menu"
import { Container } from "./container"
import { CustomButton } from "../ui/custom-button"
import { Menu, X } from "lucide-react"

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
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 mr-2">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5Z"
                  fill="white"
                  stroke="#5281EE"
                  strokeWidth="2"
                />
                <path
                  d="M15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15Z"
                  fill="#5281EE"
                />
                <path
                  d="M29 15C29 16.6569 27.6569 18 26 18C24.3431 18 23 16.6569 23 15C23 13.3431 24.3431 12 26 12C27.6569 12 29 13.3431 29 15Z"
                  fill="#5281EE"
                />
                <path
                  d="M13 22C13 22 15 25 20 25C25 25 27 22 27 22"
                  stroke="#5281EE"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-primary">Virallyzer</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors">
              How it Works
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <CustomButton variant="outline" size="sm">
                Login
              </CustomButton>
            </Link>
            <Link href="/signup">
              <CustomButton variant="primary" size="sm" animationType="shine">
                Sign Up Free
              </CustomButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />}
    </header>
  )
}
