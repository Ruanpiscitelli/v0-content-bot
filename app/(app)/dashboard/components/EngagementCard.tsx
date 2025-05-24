"use client"; // Pode ser necessário se houver interatividade ou hooks futuros

import type { DashboardEngagementData } from "@/types/dashboard"; // Importar tipo centralizado

// Removida a definição local de EngagementData
// interface EngagementData { ... }

interface EngagementCardProps {
  engagementData: DashboardEngagementData | null | undefined; // Can be undefined during SWR validation
  isLoading?: boolean;
}

export default function EngagementCard({ engagementData, isLoading }: EngagementCardProps) {
  if (isLoading || !engagementData) { // Show skeleton if isLoading or if data is null/undefined
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md col-span-1 animate-pulse">
        <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div> {/* Title placeholder */}
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/6"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-300 h-2 rounded-full" style={{ width: `${60 - index * 5}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayData = engagementData;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md col-span-1">
      <h2 className="font-bold text-base md:text-lg mb-4">Engagement</h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs md:text-sm text-gray-600">Likes</span>
            <span className="text-xs md:text-sm font-medium">{displayData.likes.count}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-600 h-2 rounded-full" style={{ width: displayData.likes.percentage }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs md:text-sm text-gray-600">Comments</span>
            <span className="text-xs md:text-sm font-medium">{displayData.comments.count}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-600 h-2 rounded-full" style={{ width: displayData.comments.percentage }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs md:text-sm text-gray-600">Shares</span>
            <span className="text-xs md:text-sm font-medium">{displayData.shares.count}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-600 h-2 rounded-full" style={{ width: displayData.shares.percentage }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs md:text-sm text-gray-600">Saves</span>
            <span className="text-xs md:text-sm font-medium">{displayData.saves.count}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-600 h-2 rounded-full" style={{ width: displayData.saves.percentage }}></div>
          </div>
        </div>
      </div>
    </div>
  );
} 