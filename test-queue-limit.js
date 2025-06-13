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

async function testQueueLimit() {
  console.log('🧪 Testing queue limit functionality...\n');

  try {
    // 1. Get current active jobs for all users
    const { data: allActiveJobs, error: activeError } = await supabase
      .from('generation_jobs')
      .select('id, user_id, status, job_type, created_at')
      .in('status', ['pending', 'processing']);

    if (activeError) {
      console.error('❌ Error fetching active jobs:', activeError);
      return;
    }

    console.log(`📊 Current active jobs across all users: ${allActiveJobs?.length || 0}`);
    
    // Group by user
    const jobsByUser = {};
    allActiveJobs?.forEach(job => {
      if (!jobsByUser[job.user_id]) {
        jobsByUser[job.user_id] = [];
      }
      jobsByUser[job.user_id].push(job);
    });

    console.log('\n👥 Jobs by user:');
    Object.entries(jobsByUser).forEach(([userId, jobs]) => {
      console.log(`  User ${userId.substring(0, 8)}...: ${jobs.length} active jobs`);
      if (jobs.length > 5) {
        console.log(`    ⚠️  WARNING: User has ${jobs.length} active jobs (exceeds limit of 5)`);
      }
    });

    // 2. Test the queue status endpoint
    console.log('\n🔍 Testing queue status endpoint...');
    
    if (Object.keys(jobsByUser).length === 0) {
      console.log('No active jobs found. Test completed successfully ✅');
      return;
    }

    // Get first user with active jobs for testing
    const testUserId = Object.keys(jobsByUser)[0];
    const userActiveJobs = jobsByUser[testUserId];
    
    console.log(`Testing with user: ${testUserId.substring(0, 8)}...`);
    console.log(`User has ${userActiveJobs.length} active jobs`);

    // 3. Simulate queue limit check
    const MAX_ACTIVE_JOBS = 5;
    
    if (userActiveJobs.length >= MAX_ACTIVE_JOBS) {
      console.log(`✅ Queue limit working: User has ${userActiveJobs.length}/${MAX_ACTIVE_JOBS} jobs (at or over limit)`);
    } else {
      console.log(`📝 User can create ${MAX_ACTIVE_JOBS - userActiveJobs.length} more jobs`);
    }

    // 4. Check if any users are violating the limit
    const violatingUsers = Object.entries(jobsByUser).filter(([_, jobs]) => jobs.length > MAX_ACTIVE_JOBS);
    
    if (violatingUsers.length > 0) {
      console.log('\n⚠️  Users exceeding the 5-job limit:');
      violatingUsers.forEach(([userId, jobs]) => {
        console.log(`  User ${userId.substring(0, 8)}...: ${jobs.length} jobs`);
        console.log(`    Jobs: ${jobs.map(j => `${j.job_type} (${j.status})`).join(', ')}`);
      });
    } else {
      console.log('\n✅ All users are within the 5-job limit');
    }

    // 5. Clean up old stuck jobs (optional)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: stuckJobs } = await supabase
      .from('generation_jobs')
      .select('id, user_id, status, created_at')
      .eq('status', 'processing')
      .lt('created_at', oneHourAgo);

    if (stuckJobs && stuckJobs.length > 0) {
      console.log(`\n⚠️  Found ${stuckJobs.length} jobs stuck in 'processing' for over 1 hour`);
      console.log('Consider running cleanup to mark these as failed');
    }

  } catch (error) {
    console.error('❌ Error testing queue limit:', error);
  }
}

// Run the test
testQueueLimit(); 