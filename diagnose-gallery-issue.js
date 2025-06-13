require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function diagnoseGalleryIssue() {
  console.log('🔍 Diagnosing gallery issues...\\n');

  const userId = '49170521-c78b-4387-b463-e680e58c75c1';

  // 1. Check table structures
  console.log('📋 Checking table structures...');
  
  // Check generation_jobs table
  const { data: jobs, error: jobsError } = await supabase
    .from('generation_jobs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (jobsError) {
    console.error('❌ Error fetching jobs:', jobsError);
  } else {
    console.log(`✅ Found ${jobs.length} jobs for user`);
    jobs.forEach((job, i) => {
      console.log(`  Job ${i + 1}: ${job.id} - ${job.job_type} - ${job.status} - ${job.output_url ? 'HAS URL' : 'NO URL'}`);
    });
  }

  // 2. Check images table
  const { data: images, error: imagesError } = await supabase
    .from('generated_images_metadata')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (imagesError) {
    console.error('❌ Error fetching images:', imagesError);
  } else {
    console.log(`\\n📸 Found ${images.length} images in metadata table`);
    images.forEach((img, i) => {
      console.log(`  Image ${i + 1}: ${img.id} - ${img.prompt} - ${img.image_url ? 'HAS URL' : 'NO URL'}`);
    });
  }

  // 3. Check videos table
  const { data: videos, error: videosError } = await supabase
    .from('generated_videos_metadata')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (videosError) {
    console.error('❌ Error fetching videos:', videosError);
  } else {
    console.log(`\\n🎬 Found ${videos.length} videos in metadata table`);
    videos.forEach((vid, i) => {
      console.log(`  Video ${i + 1}: ${vid.id} - ${vid.prompt} - ${vid.video_url ? 'HAS URL' : 'NO URL'}`);
    });
  }

  // 4. Check audios table
  const { data: audios, error: audiosError } = await supabase
    .from('generated_audios_metadata')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (audiosError) {
    console.error('❌ Error fetching audios:', audiosError);
  } else {
    console.log(`\\n🎵 Found ${audios.length} audios in metadata table`);
    audios.forEach((aud, i) => {
      console.log(`  Audio ${i + 1}: ${aud.id} - ${aud.prompt} - ${aud.audio_url ? 'HAS URL' : 'NO URL'}`);
    });
  }

  // 5. Test the gallery API endpoint logic
  console.log('\\n🧪 Testing gallery API logic...');
  
  try {
    const response = await fetch(`${supabaseUrl.replace('supabase.co', 'supabase.co')}/rest/v1/rpc/get_gallery_items?user_id=${userId}`, {
      headers: {
        'apikey': supabaseServiceRoleKey,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ RPC function response:', data);
    } else {
      console.log('❌ RPC function not available, testing manual queries...');
      
      // Manual gallery simulation
      const allItems = [];
      
      if (images?.length > 0) {
        images.forEach(img => {
          allItems.push({
            id: img.id,
            type: 'image',
            prompt: img.prompt,
            url: img.image_url,
            created_at: img.created_at
          });
        });
      }
      
      if (videos?.length > 0) {
        videos.forEach(vid => {
          allItems.push({
            id: vid.id,
            type: 'video',
            prompt: vid.prompt,
            url: vid.video_url,
            created_at: vid.created_at
          });
        });
      }
      
      if (audios?.length > 0) {
        audios.forEach(aud => {
          allItems.push({
            id: aud.id,
            type: 'audio',
            prompt: aud.prompt,
            url: aud.audio_url,
            created_at: aud.created_at
          });
        });
      }
      
      console.log(`✅ Manual gallery simulation: ${allItems.length} total items`);
      allItems.forEach((item, i) => {
        console.log(`  Item ${i + 1}: ${item.type} - "${item.prompt}" - ${item.url ? 'HAS URL' : 'NO URL'}`);
      });
    }
  } catch (error) {
    console.error('❌ Error testing gallery API:', error);
  }

  // 6. Check for orphaned successful jobs
  console.log('\\n🔍 Checking for orphaned successful jobs...');
  const successfulJobs = jobs?.filter(job => 
    job.status === 'completed' && 
    job.output_url && 
    job.output_url.startsWith('http')
  ) || [];

  console.log(`Found ${successfulJobs.length} successful jobs with URLs`);
  
  successfulJobs.forEach((job, i) => {
    console.log(`  Job ${i + 1}: ${job.job_type} - "${job.prompt}" - ${job.output_url}`);
    
    // Check if this job has corresponding metadata
    let hasMetadata = false;
    if (job.job_type === 'image_generation') {
      hasMetadata = images?.some(img => img.job_id === job.id) || false;
    } else if (job.job_type === 'video_generation') {
      hasMetadata = videos?.some(vid => vid.job_id === job.id) || false;
    } else if (job.job_type === 'audio_generation') {
      hasMetadata = audios?.some(aud => aud.job_id === job.id) || false;
    }
    
    console.log(`    Metadata exists: ${hasMetadata ? '✅' : '❌'}`);
  });
}

diagnoseGalleryIssue().catch(console.error); 