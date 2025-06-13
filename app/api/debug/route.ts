import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log(`🔍 Debug: Checking data for user: ${user.id}`);

    // Check generation_jobs table
    const { data: jobs, error: jobsError } = await supabase
      .from('generation_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    console.log(`📊 Found ${jobs?.length || 0} jobs`);

    // Check generated_videos_metadata table (where audios are stored)
    const { data: videos, error: videosError } = await supabase
      .from('generated_videos_metadata')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    console.log(`🎬 Found ${videos?.length || 0} video/audio records`);

    // Check generated_images_metadata table
    const { data: images, error: imagesError } = await supabase
      .from('generated_images_metadata')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    console.log(`🖼️ Found ${images?.length || 0} image records`);

    // Check generated_audios_metadata table (if it exists)
    const { data: audios, error: audiosError } = await supabase
      .from('generated_audios_metadata')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    console.log(`🎵 Found ${audios?.length || 0} dedicated audio records`);

    return NextResponse.json({
      user_id: user.id,
      jobs: {
        count: jobs?.length || 0,
        data: jobs || [],
        error: jobsError?.message
      },
      videos_metadata: {
        count: videos?.length || 0,
        data: videos || [],
        error: videosError?.message
      },
      images_metadata: {
        count: images?.length || 0,
        data: images || [],
        error: imagesError?.message
      },
      audios_metadata: {
        count: audios?.length || 0,
        data: audios || [],
        error: audiosError?.message
      }
    });

  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 