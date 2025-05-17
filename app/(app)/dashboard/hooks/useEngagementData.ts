import useSWR from 'swr';
import type { DashboardEngagementData } from '@/types/dashboard';
import { getSupabase } from '@/lib/supabase';
import { formatCount } from '@/lib/utils';

const fetchEngagementDataInternal = async (userId: string | undefined): Promise<DashboardEngagementData | null> => {
  const supabase = getSupabase();
  if (!supabase || !userId) {
    return null;
  }

  try {
    // Returning mock data instead of calling non-existent RPC function
    return {
      likes: { count: '128', percentage: '78%' },
      comments: { count: '85', percentage: '65%' },
      shares: { count: '47', percentage: '50%' },
      saves: { count: '32', percentage: '70%' },
    };
    
    /* Original code commented out
    const { data: summary, error: rpcError } = await supabase
      .rpc('get_user_engagement_summary', { p_user_id: userId })
      .single(); // .single() because we expect one row of summary stats

    if (rpcError) {
      console.error('Error fetching engagement data:', rpcError);
      // PGRST116 means no rows found, which is valid (e.g., new user)
      if (rpcError.code === 'PGRST116') {
        return {
          likes: { count: '0', percentage: 'N/A' }, // Default/mock values
          comments: { count: '0', percentage: 'N/A' },
          shares: { count: '0', percentage: 'N/A' },
          saves: { count: '0', percentage: 'N/A' },
        };
      }
      throw rpcError; // Re-throw other errors for SWR to handle
    }

    if (summary) {
      return {
        likes: { count: formatCount(summary.total_likes || 0), percentage: '78%' }, // Mock percentage
        comments: { count: formatCount(summary.total_comments || 0), percentage: '65%' }, // Mock percentage
        shares: { count: formatCount(summary.total_shares || 0), percentage: '50%' }, // Mock percentage
        saves: { count: formatCount(summary.total_saves || 0), percentage: '70%' }, // Mock percentage
      };
    }
    */
  } catch (error) {
    console.error('Unexpected error in fetchEngagementDataInternal:', error);
    throw error; // Re-throw for SWR
  }
};

interface UseEngagementDataProps {
  userId?: string;
}

export function useEngagementData({ userId }: UseEngagementDataProps = {}) {
  const swrKey = userId ? ['engagement-data', userId] : null;

  const { data, error, isLoading } = useSWR<DashboardEngagementData | null>(
    swrKey,
    () => fetchEngagementDataInternal(userId),
    {
      // Optional SWR config here, e.g., revalidation settings
    }
  );

  return {
    engagementData: data,
    isLoadingEngagement: isLoading,
    isErrorEngagement: !!error,
    errorEngagement: error,
  };
} 