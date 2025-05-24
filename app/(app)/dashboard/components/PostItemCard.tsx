"use client";

import Image from "next/image";
import type { PostItemData } from "@/types/dashboard";

interface PostItemCardProps {
  post: PostItemData;
}

export default function PostItemCard({ post }: PostItemCardProps) {
  if (!post) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-36 md:h-48 bg-gray-300"></div>
        <div className="p-3 md:p-4 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          <div className="flex justify-between text-xs md:text-sm">
            <div className="h-3 bg-gray-300 rounded w-1/6"></div>
            <div className="h-3 bg-gray-300 rounded w-1/6"></div>
            <div className="h-3 bg-gray-300 rounded w-1/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-36 md:h-48 bg-gray-200 relative">
        <Image
          src={post.imageUrl} 
          alt={post.altText}
          width={384}
          height={192}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 md:p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs md:text-sm text-gray-500">{post.date}</span>
          <span className="text-xs md:text-sm font-medium text-red-600">{post.platform}</span>
        </div>
        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-3">
          {post.caption}
        </p>
        <div className="flex justify-between text-xs md:text-sm text-gray-500">
          <span>❤️ {post.likes}</span>
          <span>💬 {post.comments}</span>
          <span>🔄 {post.shares}</span>
        </div>
      </div>
    </div>
  );
} 