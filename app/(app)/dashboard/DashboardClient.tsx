"use client"

import { useEffect, useState } from "react"
// import { getSupabase } from "@/lib/supabase"; // Não mais necessário para userProfile aqui
import ProfileCard from "./components/ProfileCard"
import EngagementCard from "./components/EngagementCard"
import GrowthCard from "./components/GrowthCard"
import RecentPostsSection from "./components/RecentPostsSection"
import ContentPerformanceCard from "./components/ContentPerformanceCard"
// Ensure all necessary types are imported if they are used directly in this component,
// though most will be inferred from the hooks.
// import type { 
//   DashboardEngagementData, 
//   DashboardGrowthData, 
//   PostItemData, 
//   DashboardPerformanceStats 
// } from "@/types/dashboard"; 
import { useUserProfile } from "./hooks/useUserProfile";
import { useEngagementData } from "./hooks/useEngagementData";
import { useGrowthData } from "./hooks/useGrowthData";
import { useRecentPosts } from "./hooks/useRecentPosts";
import { useContentPerformance } from "./hooks/useContentPerformance";
import { getSupabase } from "@/lib/supabase";

export default function DashboardClient() {
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchSessionUserId = async () => {
      const supabase = getSupabase();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        setCurrentUserId(session?.user?.id);
      }
    };
    fetchSessionUserId();
  }, []);

  // Use SWR hooks for data fetching
  const { profile: userProfile, isLoading: isLoadingProfile } = useUserProfile({ userId: currentUserId });
  const { engagementData, isLoadingEngagement } = useEngagementData({ userId: currentUserId });
  const { growthData, isLoadingGrowth } = useGrowthData({ userId: currentUserId });
  const { recentPosts, isLoadingRecentPosts } = useRecentPosts({ userId: currentUserId });
  const { performanceStats, isLoadingPerformance } = useContentPerformance({ userId: currentUserId });

  // Overall loading state can be derived if needed, e.g., for a global spinner
  // const isLoadingAll = isLoadingProfile || isLoadingEngagement || isLoadingGrowth || isLoadingRecentPosts || isLoadingPerformance;

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="relative">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* ProfileCard already handles its loading state via isLoadingProfile passed to useUserProfile */}
          <ProfileCard userData={userProfile} isLoading={isLoadingProfile} />
          <EngagementCard engagementData={engagementData} isLoading={isLoadingEngagement} /> 
          <GrowthCard growthData={growthData} isLoading={isLoadingGrowth} /> 
        </div>

        <div className="space-y-6">
          <RecentPostsSection posts={recentPosts} isLoading={isLoadingRecentPosts} /> 
          <ContentPerformanceCard stats={performanceStats} isLoading={isLoadingPerformance} /> 
        </div>
      </div>
    </div>
  );
}
