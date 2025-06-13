"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Video, Sparkles, Zap, Stars, Volume2 } from 'lucide-react';

interface AnimatedLoadingProps {
  texts?: string[];
  duration?: number;
  icon?: 'video' | 'sparkles' | 'zap' | 'stars' | 'loader' | 'volume';
  className?: string;
  showProgress?: boolean;
}

const icons = {
  video: Video,
  sparkles: Sparkles,
  zap: Zap,
  stars: Stars,
  loader: Loader2,
  volume: Volume2,
};

export function AnimatedLoading({
  texts = [
    "Preparing your video canvas...",
    "Consulting the AI oracles...",
    "Optimizing your creative prompt...",
    "Generating frames with pure creativity...",
    "Adding motion and magic...",
    "Wow! Almost there, your video is coming!"
  ],
  duration = 3000,
  icon = 'sparkles',
  className = '',
  showProgress = true
}: AnimatedLoadingProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Safe fallback for IconComponent
  const IconComponent = icons[icon] || Sparkles;

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, duration);

    return () => clearInterval(textInterval);
  }, [texts.length, duration]);

  useEffect(() => {
    if (showProgress) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + Math.random() * 15 + 5;
        });
      }, duration / 10);

      return () => clearInterval(progressInterval);
    }
  }, [duration, showProgress]);

  return (
    <div className={`text-center space-y-4 ${className}`}>
      {/* Animated Icon */}
      <div className="relative inline-flex items-center justify-center">
        {/* Pulsing outer ring */}
        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full animate-pulse" />
        
        {/* Spinning ring */}
        <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-cyan-400 border-r-purple-400 rounded-full animate-spin" />
        
        {/* Inner icon */}
        <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-cyan-500/30 to-purple-600/30 rounded-full backdrop-blur-sm">
          <IconComponent className="w-6 h-6 text-cyan-300 animate-pulse" />
        </div>
      </div>

      {/* Animated Text */}
      <div className="space-y-2">
        <div className="h-6 flex items-center justify-center">
          <p 
            key={currentTextIndex}
            className="text-lg font-medium text-cyan-100 animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
          >
            {texts[currentTextIndex]}
          </p>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-full max-w-xs mx-auto">
            <div className="w-full bg-gray-700/50 rounded-full h-2 backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {Math.min(Math.round(progress), 100)}% complete
            </p>
          </div>
        )}
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-bounce"
            style={{
              left: `${20 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
} 