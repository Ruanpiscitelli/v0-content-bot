require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkRecentJobs() {
  console.log('🔍 Checking recent generation jobs...\n');

  // Get the most recent jobs
  const { data: recentJobs, error } = await supabase
    .from('generation_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Error fetching jobs:', error);
    return;
  }

  console.log(`Found ${recentJobs.length} recent jobs:\n`);

  recentJobs.forEach((job, index) => {
    console.log(`${index + 1}. Job ${job.id.substring(0, 8)}... (${job.job_type})`);
    console.log(`   Status: ${job.status}`);
    console.log(`   Prompt: "${job.prompt.substring(0, 50)}..."`);
    console.log(`   Created: ${new Date(job.created_at).toLocaleString()}`);
    console.log(`   Started: ${job.started_at ? new Date(job.started_at).toLocaleString() : 'Never'}`);
    console.log(`   Completed: ${job.completed_at ? new Date(job.completed_at).toLocaleString() : 'Never'}`);
    console.log(`   Has Output URL: ${!!job.output_url}`);
    console.log(`   Error: ${job.error_message || 'None'}`);
    console.log(`   Replicate ID: ${job.replicate_prediction_id || 'None'}`);
    console.log('');
  });

  // Check specific test jobs
  const testJobIds = ['95b8758c-480f-4436-a31c-bfd3dba321ea', '5cb8368c-5f62-4b9a-862c-d4b2d78d9754'];
  
  console.log('📊 Checking our test jobs specifically:\n');
  
  for (const jobId of testJobIds) {
    const { data: job } = await supabase
      .from('generation_jobs')
      .select('*')
      .eq('id', jobId)
      .single();
      
    if (job) {
      console.log(`🎯 Job ${jobId}:`);
      console.log(`   Type: ${job.job_type}`);
      console.log(`   Status: ${job.status}`);
      console.log(`   Created: ${new Date(job.created_at).toLocaleString()}`);
      console.log(`   Started: ${job.started_at ? new Date(job.started_at).toLocaleString() : 'Never'}`);
      console.log(`   Completed: ${job.completed_at ? new Date(job.completed_at).toLocaleString() : 'Never'}`);
      console.log(`   Has Result Data: ${!!job.result_data}`);
      console.log(`   Has Output URL: ${!!job.output_url}`);
      console.log(`   Replicate ID: ${job.replicate_prediction_id || 'None'}`);
      console.log(`   Error: ${job.error_message || 'None'}`);
      
      if (job.result_data) {
        console.log(`   Result Type: ${job.result_data.type || 'Unknown'}`);
        if (job.result_data.type === 'image' && job.result_data.urls) {
          console.log(`   Image URLs: ${job.result_data.urls.length} found`);
        } else if (job.result_data.type === 'audio' && job.result_data.result) {
          console.log(`   Audio URL: ${job.result_data.result.substring(0, 80)}...`);
        }
      }
      console.log('');
    }
  }

  // Check metadata tables for these jobs
  console.log('📸 Checking generated images metadata...');
  const { data: images } = await supabase
    .from('generated_images_metadata')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
    
  console.log(`   Found ${images?.length || 0} recent images`);
  
  console.log('\n🎵 Checking generated audios metadata...');
  const { data: audios } = await supabase
    .from('generated_audios_metadata')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
    
  console.log(`   Found ${audios?.length || 0} recent audios`);
  
  if (audios && audios.length > 0) {
    audios.forEach((audio, index) => {
      console.log(`   ${index + 1}. Job ${audio.job_id} - "${audio.prompt.substring(0, 30)}..."`);
      console.log(`      URL: ${audio.audio_url.substring(0, 60)}...`);
    });
  }
}

checkRecentJobs().catch(console.error); 