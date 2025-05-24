import useSWR from 'swr';
import type { PostItemData } from '@/types/dashboard';
import { getSupabase } from '@/lib/supabase';
import { formatCount } from '@/lib/utils'; // Assuming you might move formatCount to a shared util

// Or define formatCount locally if not moved yet
// const formatCount = (num: number): string => { ... };

const fetchRecentPostsInternal = async (userId: string | undefined, count: number): Promise<PostItemData[] | null> => {
  const supabase = getSupabase();
  if (!supabase || !userId) {
    return null;
  }

  try {
    // Return mock data instead of querying posts table with incorrect syntax
    return [
      {
        id: '1',
        imageUrl: 'https://placehold.co/400x400/png',
        altText: 'Example post 1',
        date: '2023-12-15',
        platform: 'Instagram',
        caption: 'My first amazing post!',
        likes: '243',
        comments: '18',
        shares: '5'
      },
      {
        id: '2',
        imageUrl: 'https://placehold.co/400x400/png',
        altText: 'Example post 2',
        date: '2023-12-10',
        platform: 'Twitter',
        caption: 'Just shared some thoughts!',
        likes: '128',
        comments: '32',
        shares: '15'
      },
      {
        id: '3',
        imageUrl: 'https://placehold.co/400x400/png',
        altText: 'Example post 3',
        date: '2023-12-05',
        platform: 'Facebook',
        caption: 'Check out my latest update',
        likes: '87',
        comments: '9',
        shares: '3'
      }
    ] as PostItemData[];

    /* Original code with incorrect syntax commented out  
    // Adjust column names (e.g., created_at, image_url, likes_count) 
    // to match your actual 'posts' table schema in Supabase.
    const { data: postsData, error } = await supabase
      .from('posts') // Replace 'posts' with your actual table name if different
      .select(`
        id,
        image_url:imageUrl,
        alt_text:altText,
        created_at:date, // We'll format this date client-side or assume it's a string
        platform,
        caption,
        likes_count:likes,
        comments_count:comments,
        shares_count:shares
      `)
      .eq('user_id', userId) // Filter by the current user
      .order('created_at', { ascending: false }) // Get the most recent posts
      .limit(count); // Limit to the desired number of posts

    if (error) {
      console.error('Error fetching recent posts:', error);
      throw error; // Re-throw for SWR to handle
    }

    if (postsData) {
      // Map and format data if necessary
      return postsData.map(post => ({
        ...post,
        // Ensure counts are formatted (if they are numbers from DB)
        // The PostItemData type expects string | number for these
        likes: formatCount(Number(post.likes) || 0),
        comments: formatCount(Number(post.comments) || 0),
        shares: formatCount(Number(post.shares) || 0),
        // Date formatting (example: if 'date' is a full timestamp)
        // date: new Date(post.date).toLocaleDateString(), // Or use a date utility like date-fns
        // For now, assuming 'created_at' can be used directly or is already a suitable string.
      })) as PostItemData[];
    }
    return []; // Return empty array if no posts found, or null if preferred
    */
  } catch (error) {
    console.error('Unexpected error in fetchRecentPostsInternal:', error);
    throw error; // Re-throw for SWR
  }
};

interface UseRecentPostsProps {
  userId?: string;
  count?: number;
}

export function useRecentPosts({ userId, count = 3 }: UseRecentPostsProps = {}) { // Default count to 3 for example
  const swrKey = userId ? ['recent-posts', userId, count] : null;

  const { data, error, isLoading } = useSWR<PostItemData[] | null>(
    swrKey,
    () => fetchRecentPostsInternal(userId, count),
    {
      // Optional SWR config
    }
  );

  return {
    recentPosts: data,
    isLoadingRecentPosts: isLoading,
    isErrorRecentPosts: !!error,
    errorRecentPosts: error,
  };
} 