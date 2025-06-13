require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkAllJobs() {
  try {
    console.log('🔍 Checking all recent jobs...\n');

    // Get all jobs from last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: jobs, error } = await supabase
      .from('generation_jobs')
      .select('*')
      .gte('created_at', yesterday)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ Error fetching jobs:', error);
      return;
    }

    if (!jobs || jobs.length === 0) {
      console.log('📭 No recent jobs found');
      return;
    }

    console.log(`📋 Found ${jobs.length} recent jobs:\n`);

    for (const job of jobs) {
      const createdTime = new Date(job.created_at).toLocaleString();
      const age = Math.round((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60));
      
      console.log(`🔸 Job ${job.id.substring(0, 8)}...`);
      console.log(`   Type: ${job.job_type}`);
      console.log(`   Status: ${job.status}`);
      console.log(`   Created: ${createdTime} (${age} min ago)`);
      console.log(`   Prompt: ${job.prompt.substring(0, 50)}${job.prompt.length > 50 ? '...' : ''}`);
      console.log(`   Replicate ID: ${job.replicate_prediction_id || 'None'}`);
      if (job.error_message) {
        console.log(`   Error: ${job.error_message}`);
      }
      console.log('');
    }

    // Summary by status
    const statusCounts = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Status Summary:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the script
checkAllJobs().then(() => {
  console.log('\nScript completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 