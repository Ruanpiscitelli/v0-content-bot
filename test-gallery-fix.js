const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testGalleryFix() {
  console.log('🖼️ Testing gallery fix...\n');

  try {
    const userId = '49170521-c78b-4387-b463-e680e58c75c1';
    
    // 1. Check images in metadata table
    console.log('📸 Checking images in generated_images_metadata...');
    const { data: imagesData, error: imagesError } = await supabase
      .from('generated_images_metadata')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (imagesError) {
      console.error('❌ Error fetching images:', imagesError);
      return;
    }

    console.log(`✅ Found ${imagesData?.length || 0} images in metadata table:`);
    if (imagesData && imagesData.length > 0) {
      imagesData.forEach((img, index) => {
        console.log(`   ${index + 1}. "${img.prompt}" - ${img.image_url}`);
      });
    }

    // 2. Check videos in metadata table
    console.log('\n🎬 Checking videos in generated_videos_metadata...');
    const { data: videosData, error: videosError } = await supabase
      .from('generated_videos_metadata')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (videosError) {
      console.error('❌ Error fetching videos:', videosError);
    } else {
      console.log(`✅ Found ${videosData?.length || 0} videos in metadata table`);
    }

    // 3. Check audios in metadata table
    console.log('\n🎵 Checking audios in generated_audios_metadata...');
    const { data: audiosData, error: audiosError } = await supabase
      .from('generated_audios_metadata')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (audiosError) {
      console.error('❌ Error fetching audios:', audiosError);
    } else {
      console.log(`✅ Found ${audiosData?.length || 0} audios in metadata table`);
      if (audiosData && audiosData.length > 0) {
        audiosData.forEach((audio, index) => {
          console.log(`   ${index + 1}. "${audio.prompt}" - ${audio.audio_url}`);
        });
      }
    }

    // 4. Simulate gallery combination
    console.log('\n🎭 Simulating gallery combination...');
    const allItems = [
      ...(imagesData || []).map(item => ({
        ...item,
        type: 'image',
        url: item.image_url,
        created_at: item.created_at,
        isLipSync: false,
        isAudio: false
      })),
      ...(videosData || []).map(item => ({
        ...item,
        type: item.metadata?.type === 'lip_sync' ? 'lip_sync' : 
              item.metadata?.type === 'audio_generation' ? 'audio' : 'video',
        url: item.video_url,
        created_at: item.created_at,
        isLipSync: item.metadata?.type === 'lip_sync',
        isAudio: item.metadata?.type === 'audio_generation'
      })),
      ...(audiosData || []).map(item => ({
        ...item,
        type: 'audio',
        url: item.audio_url,
        created_at: item.created_at,
        isLipSync: false,
        isAudio: true
      }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    console.log(`✅ Total gallery items: ${allItems.length}`);
    console.log('\n📋 Gallery items by type:');
    const itemsByType = allItems.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(itemsByType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} items`);
    });

    if (allItems.length > 0) {
      console.log('\n🎯 Most recent items:');
      allItems.slice(0, 3).forEach((item, index) => {
        console.log(`   ${index + 1}. [${item.type.toUpperCase()}] "${item.prompt}" - ${new Date(item.created_at).toLocaleDateString()}`);
      });
    }

    console.log('\n🎉 Gallery test completed successfully!');

  } catch (error) {
    console.error('❌ Error testing gallery:', error);
  }
}

testGalleryFix(); 