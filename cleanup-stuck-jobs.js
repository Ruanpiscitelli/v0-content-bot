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

async function cleanupStuckJobs() {
  console.log('🧹 Cleaning up stuck jobs...\n');

  try {
    // 1. Get all pending/processing jobs older than 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const { data: stuckJobs, error: fetchError } = await supabase
      .from('generation_jobs')
      .select('id, user_id, status, job_type, created_at, prompt')
      .in('status', ['pending', 'processing'])
      .lt('created_at', thirtyMinutesAgo);

    if (fetchError) {
      console.error('❌ Error fetching stuck jobs:', fetchError);
      return;
    }

    if (!stuckJobs || stuckJobs.length === 0) {
      console.log('✅ No stuck jobs found');
      return;
    }

    console.log(`📊 Found ${stuckJobs.length} stuck jobs older than 30 minutes`);
    
    // Show details
    stuckJobs.forEach(job => {
      const ageMinutes = Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60));
      console.log(`  - ${job.job_type} (${job.status}) - ${ageMinutes}m old - "${job.prompt.substring(0, 50)}..."`);
    });

    // 2. Ask for confirmation
    console.log('\n⚠️  These jobs appear to be stuck and will be marked as failed.');
    console.log('This will:\n  - Free up queue slots\n  - Send failure notifications to users\n  - Allow new jobs to be created');
    
    // For automation, we'll proceed with cleanup
    console.log('\n🔧 Proceeding with cleanup...');

    // 3. Update stuck jobs to failed status
    const { data: updatedJobs, error: updateError } = await supabase
      .from('generation_jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: 'Job timed out - marked as failed during system cleanup'
      })
      .in('id', stuckJobs.map(job => job.id))
      .select();

    if (updateError) {
      console.error('❌ Error updating jobs:', updateError);
      return;
    }

    console.log(`✅ Successfully marked ${updatedJobs?.length || 0} jobs as failed`);

    // 4. Send notifications to affected users
    const notifications = stuckJobs.map(job => ({
      user_id: job.user_id,
      type: 'generation_failed',
      message: `Your ${job.job_type.replace('_', ' ')} job was cancelled due to system timeout. Please try again.`,
      metadata: {
        job_id: job.id,
        job_type: job.job_type,
        reason: 'timeout_cleanup',
        original_prompt: job.prompt.substring(0, 100)
      }
    }));

    if (notifications.length > 0) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notificationError) {
        console.warn('⚠️  Warning: Failed to send some notifications:', notificationError);
      } else {
        console.log(`📬 Sent ${notifications.length} failure notifications to users`);
      }
    }

    // 5. Verify cleanup
    const { data: remainingActive, error: checkError } = await supabase
      .from('generation_jobs')
      .select('id, user_id, status')
      .in('status', ['pending', 'processing']);

    if (!checkError && remainingActive) {
      console.log(`\n📊 After cleanup: ${remainingActive.length} active jobs remaining`);
      
      // Group by user
      const jobsByUser = {};
      remainingActive.forEach(job => {
        if (!jobsByUser[job.user_id]) {
          jobsByUser[job.user_id] = [];
        }
        jobsByUser[job.user_id].push(job);
      });

      console.log('👥 Remaining jobs by user:');
      Object.entries(jobsByUser).forEach(([userId, jobs]) => {
        console.log(`  User ${userId.substring(0, 8)}...: ${jobs.length} active jobs`);
      });
    }

    console.log('\n✅ Cleanup completed successfully!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupStuckJobs(); 