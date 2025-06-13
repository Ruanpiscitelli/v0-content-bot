import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

// Helper function to get authenticated user
async function getUser(request: Request) {
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

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }
  
  return user;
}

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
    const user = await getUser(request);
    if (!user) {
      console.log('🚫 User not authenticated for gallery access');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log(`🖼️ Starting images query for user: ${user.id}`);
    
    // Get images
    const { data: imagesData, error: imagesError } = await supabase
      .from('generated_images_metadata')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    console.log(`🖼️ Images query result: { images: ${imagesData?.length || 0}, imagesError: ${imagesError ? imagesError.message : 'null'} }`);

    console.log('🎬 Starting videos query...');
    
    // Get videos (this includes both regular videos and lip-synced videos)
    const { data: videosData, error: videosError } = await supabase
      .from('generated_videos_metadata')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    console.log(`🎬 Videos query result: { videosData: ${videosData?.length || 0}, videosError: ${videosError ? videosError.message : 'null'} }`);

    console.log('🎵 Starting audios query...');
    
    // Get audios from dedicated table
    const { data: audiosData, error: audiosError } = await supabase
      .from('generated_audios_metadata')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    console.log(`🎵 Audios query result: { audiosData: ${audiosData?.length || 0}, audiosError: ${audiosError ? audiosError.message : 'null'} }`);

    // Combine and sort all items
    const allItems = [
      ...(imagesData || []).map(item => ({
        ...item,
        type: 'image',
        url: item.image_url,
        created_at: item.created_at,
        isLipSync: false,
        isAudio: false
      })),
      ...(videosData || []).map(item => {
        let type = 'video';
        let isLipSync = false;
        let isAudio = false;
        if (item && typeof item.metadata === 'object' && item.metadata !== null && !Array.isArray(item.metadata)) {
          if ((item.metadata as any).type === 'lip_sync') {
            type = 'lip_sync';
            isLipSync = true;
          } else if ((item.metadata as any).type === 'audio_generation') {
            type = 'audio';
            isAudio = true;
          }
        }
        return {
          ...item,
          type,
          url: item.video_url,
          created_at: item.created_at,
          isLipSync,
          isAudio
        };
      }),
      ...(audiosData || []).map(item => ({
        ...item,
        type: 'audio',
        url: item.audio_url,
        created_at: item.created_at,
        isLipSync: false,
        isAudio: true
      }))
    ].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return dateB - dateA;
    });

    console.log(`✅ Gallery items processed: ${allItems.length} total items`);

    return NextResponse.json({
      items: allItems,
      total: allItems.length
    });
  } catch (error) {
    console.error('Error in gallery API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { id, type, storage_path } = await request.json();

    if (!id || !type) {
      return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
    }

    let tableName: string;
    let bucketName: string;

    if (type === 'image') {
      tableName = 'generated_images_metadata';
      bucketName = 'generated_images';
    } else if (type === 'video') {
      tableName = 'generated_videos_metadata';
      bucketName = 'generated_videos';
    } else if (type === 'audio') {
      tableName = 'generated_audios_metadata';
      bucketName = 'generated-audios';
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Delete metadata from table
    const { error: dbError } = await supabase
      .from(tableName as 'generated_images_metadata' | 'generated_videos_metadata' | 'generated_audios_metadata')
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (dbError) {
      console.error(`Error deleting from ${tableName}:`, dbError);
      return NextResponse.json({ error: `Failed to delete ${type} metadata` }, { status: 500 });
    }

    // Delete file from storage if storage_path is provided
    if (storage_path) {
        const { error: storageError } = await supabase.storage
            .from(bucketName)
            .remove([storage_path]);

        if (storageError) {
            console.error(`Error deleting from ${bucketName} storage:`, storageError);
            // Continue even if storage deletion fails, as metadata is already deleted
        }
    } else {
        console.warn(`No storage_path provided for ${type} id ${id}. Skipping storage deletion.`);
    }

    return NextResponse.json({ success: true, message: `${type} deleted successfully` });

  } catch (error) {
    console.error("Error in gallery DELETE:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 