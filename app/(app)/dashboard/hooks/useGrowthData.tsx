import useSWR from 'swr';
import type { DashboardGrowthData } from '@/types/dashboard';
import React from 'react'; // Import React for JSX

// Simple SVG Icon Components for mock data
const ArrowUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

const EyeIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const SparklesIcon = () => ( // Using a different icon for Engagement Rate
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// Simulate a fetcher function
const fetcher = async (url: string): Promise<DashboardGrowthData> => {
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay
  
  // Mock data with ReactNode icons
  return {
    newFollowers: { metric: "New Followers", value: "+1,350", change: "+15.5%", changeColor: "text-green-600", iconBgColor: "bg-green-100", iconTextColor: "text-green-600", icon: <ArrowUpIcon /> }, 
    profileViews: { metric: "Profile Views", value: "9,500", change: "+20.2%", changeColor: "text-blue-600", iconBgColor: "bg-blue-100", iconTextColor: "text-blue-600", icon: <EyeIcon /> }, 
    engagementRate: { metric: "Engagement Rate", value: "6.1%", change: "+1.9%", changeColor: "text-purple-600", iconBgColor: "bg-purple-100", iconTextColor: "text-purple-600", icon: <SparklesIcon /> }
  };
};

interface UseGrowthDataProps {
  userId?: string;
}

export function useGrowthData({ userId }: UseGrowthDataProps = {}) {
  const key = userId ? `/api/mock/dashboard/growth/${userId}` : null;
  const { data, error, isLoading } = useSWR<DashboardGrowthData>(key, fetcher);

  return {
    growthData: data,
    isLoadingGrowth: isLoading,
    isErrorGrowth: !!error,
  };
} 