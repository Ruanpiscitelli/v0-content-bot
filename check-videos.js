require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkVideos() {
  console.log('📹 Checking videos in generated_videos_metadata table...\n');
  
  const { data, error } = await supabase
    .from('generated_videos_metadata')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error('❌ Error querying videos:', error);
    return;
  }
  
  console.log('📊 Videos found:', data.length);
  
  if (data.length > 0) {
    console.log('\n📋 Recent videos:');
    data.forEach((video, index) => {
      console.log(`${index + 1}. ID: ${video.id}`);
      console.log(`   User: ${video.user_id}`);
      console.log(`   Prompt: ${video.prompt}`);
      console.log(`   URL: ${video.video_url}`);
      console.log(`   Created: ${video.created_at}`);
      console.log(`   Metadata: ${JSON.stringify(video.metadata, null, 2)}`);
      console.log('');
    });
  } else {
    console.log('🚫 No videos found in generated_videos_metadata table');
  }
  
  // Also check jobs table for video jobs
  console.log('🔍 Checking generation_jobs for video jobs...\n');
  
  const { data: jobs, error: jobsError } = await supabase
    .from('generation_jobs')
    .select('*')
    .eq('job_type', 'video_generation')
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (jobsError) {
    console.error('❌ Error querying jobs:', jobsError);
    return;
  }
  
  console.log('📊 Video jobs found:', jobs.length);
  
  if (jobs.length > 0) {
    console.log('\n📋 Recent video jobs:');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ID: ${job.id}`);
      console.log(`   Status: ${job.status}`);
      console.log(`   Prompt: ${job.prompt}`);
      console.log(`   Output URL: ${job.output_url}`);
      console.log(`   Created: ${job.created_at}`);
      console.log(`   Completed: ${job.completed_at}`);
      console.log('');
    });
  }
}

checkVideos().catch(console.error); 