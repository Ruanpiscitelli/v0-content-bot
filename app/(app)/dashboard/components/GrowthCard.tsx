"use client";

import type { DashboardGrowthData, GrowthItem } from "@/types/dashboard"; // Importar tipos centralizados

// Removidas definições locais de GrowthItem, GrowthData
// interface GrowthItem { ... }
// interface GrowthData { ... }

// Define placeholder icons if not already defined elsewhere
// Or ensure they are passed correctly through props if dynamic
const DefaultIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface GrowthCardProps {
  growthData: DashboardGrowthData | null | undefined;
  isLoading?: boolean;
}

// Ícones SVG como componentes React para melhor reutilização e clareza
const ArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const PieChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

export default function GrowthCard({ growthData, isLoading }: GrowthCardProps) {
  if (isLoading || !growthData) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md col-span-1 animate-pulse">
        <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div> {/* Title placeholder */}
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-300"></div>
              <div className="ml-3 md:ml-4 space-y-2 flex-1">
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayData = growthData; // Usar os dados das props

  const renderGrowthItem = (item: GrowthItem) => (
    <div key={item.metric} className="flex items-center">
      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${item.iconBgColor} flex items-center justify-center ${item.iconTextColor}`}>
        {item.icon || <DefaultIcon />} {/* Render a default icon if item.icon is null/undefined */}
      </div>
      <div className="ml-3 md:ml-4">
        <p className="text-xs md:text-sm text-gray-600">{item.metric}</p>
        <p className="font-bold text-base md:text-xl">{item.value}</p>
        <p className={`text-xs ${item.changeColor}`}>{item.change}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md col-span-1">
      <h2 className="font-bold text-base md:text-lg mb-4">Growth</h2>
      <div className="space-y-4">
        {renderGrowthItem(displayData.newFollowers)}
        {renderGrowthItem(displayData.profileViews)}
        {renderGrowthItem(displayData.engagementRate)}
      </div>
    </div>
  );
} 