"use client";

import type { DashboardPerformanceStats } from "@/types/dashboard"; // Importar tipo centralizado

// Removida definição local de PerformanceStats
// interface PerformanceStats { ... }

interface ContentPerformanceCardProps {
  stats: DashboardPerformanceStats | null | undefined;
  isLoading?: boolean;
}

export default function ContentPerformanceCard({ stats, isLoading }: ContentPerformanceCardProps) {
  if (isLoading || !stats) {
    return (
      <div className="mt-6 md:mt-8 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div> {/* Title placeholder */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex flex-wrap justify-between mb-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-full sm:w-auto mb-4 sm:mb-0 space-y-1 pr-2">
                <div className="h-3 bg-gray-300 rounded w-20"></div>
                <div className="h-5 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="h-5 bg-gray-300 rounded w-1/4"></div> {/* Chart placeholder text */}
          </div>
        </div>
      </div>
    );
  }
  
  const displayStats = stats; // Usar os dados das props

  return (
    <div className="mt-6 md:mt-8">
      <h2 className="text-lg md:text-xl font-bold mb-4">Content Performance</h2>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap justify-between mb-4">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <span className="text-sm text-gray-500">Total Content</span>
            <p className="text-2xl font-bold">{displayStats.totalContent}</p>
          </div>
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <span className="text-sm text-gray-500">Average Engagement</span>
            <p className="text-2xl font-bold">{displayStats.averageEngagement}</p>
          </div>
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <span className="text-sm text-gray-500">Top Platform</span>
            <p className="text-2xl font-bold">{displayStats.topPlatform}</p>
          </div>
          <div className="w-full sm:w-auto">
            <span className="text-sm text-gray-500">Content Created This Month</span>
            <p className="text-2xl font-bold">{displayStats.createdThisMonth}</p>
          </div>
        </div>

        {/* Placeholder para o gráfico */}
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Performance Chart</p>
          {/* Aqui entraria um componente de gráfico real, ex: usando Recharts, Chart.js */}
        </div>
      </div>
    </div>
  );
} 