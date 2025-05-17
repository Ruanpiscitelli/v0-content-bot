import { useMediaQuery } from "@/hooks/use-media-query"
import { Search } from "lucide-react"

export default function ChatHeader() {
  // Use media queries to detect screen size
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isSmallMobile = useMediaQuery("(max-width: 380px)")

  return (
    <header className="bg-white border-b-2 border-black py-3 md:py-4 px-4 shadow-md transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <div className="relative h-10 w-10 mr-2">
            <div className="absolute animate-float">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5Z"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15Z"
                  fill="black"
                />
                <path
                  d="M29 15C29 16.6569 27.6569 18 26 18C24.3431 18 23 16.6569 23 15C23 13.3431 24.3431 12 26 12C27.6569 12 29 13.3431 29 15Z"
                  fill="black"
                />
                <path
                  d="M13 22C13 22 15 25 20 25C25 25 27 22 27 22"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Virallyzer</h1>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex relative max-w-md w-full mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search here"
              className="w-full py-2 pl-4 pr-10 rounded-full border-2 border-black focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden cartoon-button bg-white px-3 py-1.5 rounded-full">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
