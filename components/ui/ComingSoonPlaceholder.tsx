import React from 'react';
import { Construction, Rocket, Sparkles } from 'lucide-react';
import { Button } from './button';

interface ComingSoonPlaceholderProps {
  title?: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonHref?: string;
}

export function ComingSoonPlaceholder({
  title = "Coming Soon",
  description = "This amazing feature is being developed and will be available soon!",
  showButton = true,
  buttonText = "Back to Home",
  buttonHref = "/chat"
}: ComingSoonPlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center p-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 mb-6">
            <Construction className="w-16 h-16 text-cyan-300" />
          </div>
          {/* Floating icons */}
          <div className="absolute -top-4 -right-4 animate-bounce">
            <Sparkles className="w-8 h-8 text-yellow-400 opacity-70" />
          </div>
          <div className="absolute -bottom-2 -left-6 animate-pulse">
            <Rocket className="w-6 h-6 text-purple-400 opacity-60" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
          {title}
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg mx-auto">
          {description}
        </p>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              In development
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center">
              <Rocket className="w-4 h-4 mr-2 text-purple-400" />
              Launching soon
            </div>
          </div>
        </div>

        {showButton && (
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-600 hover:via-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30"
          >
            <a href={buttonHref}>{buttonText}</a>
          </Button>
        )}

        <div className="mt-12 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
} 