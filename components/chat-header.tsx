import { useMediaQuery } from "@/hooks/use-media-query"
import { Search, Rocket } from "lucide-react"

export default function ChatHeader() {
  // Use media queries to detect screen size
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isSmallMobile = useMediaQuery("(max-width: 380px)")

  return (
    <header className="relative z-10 bg-gradient-to-r from-gray-900/90 via-purple-900/90 to-indigo-900/90 backdrop-blur-lg border-b border-cyan-400/30 py-3 md:py-4 px-4 shadow-xl shadow-cyan-500/20">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <div className="relative h-10 w-10 mr-3 overflow-hidden">
            <div className="relative animate-rocket-launch">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 hover:opacity-75 transition-opacity duration-300"></div>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Virallyzer
          </h1>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden bg-gradient-to-br from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/30 hover:border-cyan-400/50 text-cyan-300 px-3 py-1.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
