require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkFailedJobs() {
  console.log('🔍 Checking failed jobs details...\\n');

  const userId = '49170521-c78b-4387-b463-e680e58c75c1';

  const { data: failedJobs, error } = await supabase
    .from('generation_jobs')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'failed')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Error fetching failed jobs:', error);
    return;
  }

  console.log(`Found ${failedJobs.length} failed jobs\\n`);

  failedJobs.forEach((job, i) => {
    console.log(`📋 Job ${i + 1}: ${job.id}`);
    console.log(`   Type: ${job.job_type}`);
    console.log(`   Prompt: "${job.prompt}"`);
    console.log(`   Status: ${job.status}`);
    console.log(`   Error: ${job.error_message || 'No error message'}`);
    console.log(`   Created: ${job.created_at}`);
    console.log(`   Updated: ${job.updated_at}`);
    console.log(`   Input Params:`, JSON.stringify(job.input_parameters, null, 2));
    console.log('   ---');
  });

  // Check most recent processing attempts
  console.log('\\n🔄 Checking processing log for recent errors...');
  
  // Try to trigger processing of the most recent failed job
  const mostRecentJob = failedJobs[0];
  if (mostRecentJob) {
    console.log(`\\n🚀 Attempting to reprocess job: ${mostRecentJob.id}`);
    console.log(`   Type: ${mostRecentJob.job_type}`);
    console.log(`   Prompt: "${mostRecentJob.prompt}"`);
    
    try {
      const response = await fetch('http://localhost:3001/api/jobs/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: mostRecentJob.id
        })
      });
      
      const result = await response.text();
      console.log(`   Response: ${response.status} ${response.statusText}`);
      console.log(`   Body: ${result}`);
      
    } catch (error) {
      console.error(`   ❌ Processing error:`, error.message);
    }
  }
}

checkFailedJobs().catch(console.error); 