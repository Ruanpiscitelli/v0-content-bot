import useSWR from 'swr';
import type { DashboardPerformanceStats } from '@/types/dashboard';
import { getSupabase } from '@/lib/supabase';
import { formatCount } from '@/lib/utils';

const fetchContentPerformanceInternal = async (userId: string | undefined): Promise<DashboardPerformanceStats | null> => {
  const supabase = getSupabase();
  if (!supabase || !userId) {
    return null;
  }

  try {
    // Returning mock data instead of calling non-existent RPC function
    return {
      totalContent: '32',
      averageEngagement: '12.5%',
      topPlatform: 'Instagram',
      createdThisMonth: '5',
    };

    /* Original code commented out
    const { data: stats, error: rpcError } = await supabase
      .rpc('get_user_performance_stats', { p_user_id: userId })
      .single(); // Expect a single row of aggregated stats

    if (rpcError) {
      console.error('Error fetching content performance stats:', rpcError);
      // PGRST116 means no rows found by the RPC. This could happen if the user has no posts.
      // In this case, we can return default zeroed-out stats.
      if (rpcError.code === 'PGRST116') {
        return {
          totalContent: '0',
          averageEngagement: '0%',
          topPlatform: 'N/A',
          createdThisMonth: '0',
        };
      }
      throw rpcError; // Re-throw other errors
    }

    if (stats) {
      const totalContent = stats.total_content_count || 0;
      const totalLikes = stats.total_likes_sum || 0;
      const totalComments = stats.total_comments_sum || 0;
      const totalShares = stats.total_shares_sum || 0;

      let avgEngagement = 0;
      if (totalContent > 0) {
        avgEngagement = ((totalLikes + totalComments + totalShares) / totalContent);
      }
      
      // Ensure avgEngagement is a percentage string with one decimal place
      const averageEngagementString = avgEngagement.toFixed(1) + '%';

      return {
        totalContent: formatCount(totalContent),
        averageEngagement: averageEngagementString,
        topPlatform: stats.top_platform_name || 'N/A',
        createdThisMonth: formatCount(stats.content_this_month_count || 0),
      };
    }
    return null; // Should ideally be handled by PGRST116 or other errors
    */

  } catch (error) {
    console.error('Unexpected error in fetchContentPerformanceInternal:', error);
    throw error;
  }
};

interface UseContentPerformanceProps {
  userId?: string;
}

export function useContentPerformance({ userId }: UseContentPerformanceProps = {}) {
  const swrKey = userId ? ['content-performance', userId] : null;

  const { data, error, isLoading } = useSWR<DashboardPerformanceStats | null>(
    swrKey,
    () => fetchContentPerformanceInternal(userId),
    {
      // Optional SWR config
    }
  );

  return {
    performanceStats: data,
    isLoadingPerformance: isLoading,
    isErrorPerformance: !!error,
    errorPerformance: error,
  };
} 