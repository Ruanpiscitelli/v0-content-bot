"use client"

import React from 'react'
import { ArrowRight, LayoutGrid, ImageIcon, VideoIcon, MicIcon, LayersIcon, UsersIcon, PaletteIcon, Volume2Icon } from 'lucide-react' // Placeholder icons

const tools = [
  { name: 'Image Generation', href: '/tools/image-generation', icon: ImageIcon, description: 'Create stunning visuals with AI.' },
  { name: 'Video Generation', href: '/tools/video-generation', icon: VideoIcon, description: 'Produce engaging videos in minutes.' },
  { name: 'Lip Sync', href: '/tools/lip-sync', icon: MicIcon, description: 'Synchronize lip movements with audio or text.' },
  { name: 'Audio Generation', href: '/tools/audio-generation', icon: Volume2Icon, description: 'Clone voices and generate speech with AI.' },
  { name: 'Face Swap', href: '/tools/face-swap', icon: UsersIcon, description: 'Swap faces in images and videos seamlessly.' },
  { name: 'Logo Creator', href: '/tools/logo-creator', icon: PaletteIcon, description: 'Design professional logos for your brand.' },
  { name: 'Carousel Generation', href: '/tools/carousel-generation', icon: LayersIcon, description: 'Create engaging carousels for social media.' },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4 sm:p-6 md:p-8 text-white">
      <header className="mb-8 md:mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-2">
          Content Creator Tools
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl">
          Unlock your creative potential with our suite of AI-powered content generation tools.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.href} // Simple href for now, can be NextLink later
            className="group relative rounded-xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:shadow-cyan-500/30 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 group-hover:from-cyan-500/30 group-hover:to-purple-600/30">
              <tool.icon className="w-6 h-6 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
              {tool.description}
            </p>
            <div className="flex items-center text-sm font-medium text-cyan-400 group-hover:text-cyan-200 transition-colors">
              Access Tool
              <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </a>
        ))}
      </div>

      <footer className="mt-12 md:mt-16 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Virallyzer. All tools at your command.</p>
      </footer>
    </div>
  )
} 