"use client";

import PostItemCard from "./PostItemCard";
import type { PostItemData } from "@/types/dashboard"; // Importar tipo centralizado

interface RecentPostsSectionProps {
  posts: PostItemData[] | null | undefined;
  isLoading?: boolean;
}

// Removidos dados mockados daqui, idealmente virão das props
// const mockPosts: PostItemData[] = [ ... ]

export default function RecentPostsSection({ posts, isLoading }: RecentPostsSectionProps) {
  if (isLoading) { // Prioritize isLoading for skeleton
    return (
      <div className="mt-6 md:mt-8 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div> {/* Title placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-36 md:h-48 bg-gray-300"></div>
              <div className="p-3 md:p-4 space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) { // Handle no data after loading
    return (
      <div className="mt-6 md:mt-8">
        <h2 className="text-lg md:text-xl font-bold mb-4">Recent Posts</h2>
        <p className="text-gray-500">No recent posts to display.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 md:mt-8">
      <h2 className="text-lg md:text-xl font-bold mb-4">Recent Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostItemCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
} 