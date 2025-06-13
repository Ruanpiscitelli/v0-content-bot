"use client";

import React from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageSkeletonProps {
  aspectRatio?: string; // e.g., "1:1", "16:9"
}

export const ImageSkeleton: React.FC<ImageSkeletonProps> = ({ aspectRatio = "1:1" }) => {
  let paddingTop = "100%"; // default for 1:1
  if (aspectRatio === "16:9") paddingTop = "56.25%";
  else if (aspectRatio === "9:16") paddingTop = "177.78%";
  else if (aspectRatio === "4:3") paddingTop = "75%";
  else if (aspectRatio === "3:4") paddingTop = "133.33%";

  return (
    <div
      className="w-full bg-white/5 rounded-lg sm:rounded-xl animate-pulse overflow-hidden border border-white/10 mx-auto max-w-full"
      style={{ position: 'relative', paddingTop }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-500 opacity-50" />
      </div>
      
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
    </div>
  );
}; 