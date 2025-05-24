"use client"

import Link from "next/link"
import { CustomButton } from "../ui/custom-button"
import { Sparkles, Rocket, X } from "lucide-react"

interface MobileMenuProps {
  onClose: () => void
}

export function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-900 to-purple-900 backdrop-blur-lg">
      {/* Close button */}
      <div className="flex justify-end p-6">
        <button 
          onClick={onClose} 
          className="p-3 text-white hover:text-cyan-400 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
        >
          <X className="h-6 w-6 font-bold" />
        </button>
      </div>

      {/* Menu content */}
      <div className="flex flex-col items-center justify-center gap-8 p-8 h-full">
        {/* Logo */}
        <div className="flex items-center mb-8">
          <div className="relative w-16 h-16 mr-4">
            <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50"></div>
          </div>
          <h1 className="text-3xl font-black text-white">Virallyzer</h1>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col items-center gap-6">
          <Link 
            href="#features" 
            onClick={onClose} 
            className="text-2xl font-bold text-white hover:text-cyan-400 transition-all duration-300 hover:scale-110 drop-shadow-lg"
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            onClick={onClose} 
            className="text-2xl font-bold text-white hover:text-cyan-400 transition-all duration-300 hover:scale-110 drop-shadow-lg"
          >
            How it Works
          </Link>
          <Link 
            href="#pricing" 
            onClick={onClose} 
            className="text-2xl font-bold text-white hover:text-cyan-400 transition-all duration-300 hover:scale-110 drop-shadow-lg"
          >
            Pricing
          </Link>
        </nav>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-6 w-full max-w-sm">
          <Link href="/login" onClick={onClose} className="w-full">
            <CustomButton 
              variant="outline" 
              className="w-full border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold text-lg py-4 drop-shadow-lg"
            >
              Login
            </CustomButton>
          </Link>
          <Link href="/signup" onClick={onClose} className="w-full">
            <CustomButton 
              variant="primary" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold border border-blue-400/50 shadow-xl text-lg py-4 transition-all duration-300"
            >
              Sign Up Free
            </CustomButton>
          </Link>
        </div>
      </div>
    </div>
  )
}
