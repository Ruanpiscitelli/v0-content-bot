require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Replicate = require('replicate');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function fixStuckJobs() {
  try {
    console.log('🔍 Checking for stuck jobs...');

    // Find jobs stuck in 'processing' for more than 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    const { data: stuckJobs, error } = await supabase
      .from('generation_jobs')
      .select('*')
      .eq('status', 'processing')
      .lt('created_at', tenMinutesAgo);

    if (error) {
      console.error('❌ Error fetching stuck jobs:', error);
      return;
    }

    if (!stuckJobs || stuckJobs.length === 0) {
      console.log('✅ No stuck jobs found');
      return;
    }

    console.log(`🔧 Found ${stuckJobs.length} potentially stuck jobs`);

    for (const job of stuckJobs) {
      console.log(`\n📝 Checking job ${job.id} (${job.job_type})`);
      console.log(`   Replicate ID: ${job.replicate_prediction_id}`);
      console.log(`   Created: ${job.created_at}`);

      if (!job.replicate_prediction_id) {
        console.log('   ⚠️  No Replicate prediction ID, marking as failed');
        await markJobAsFailed(job.id, 'No Replicate prediction ID found');
        continue;
      }

      try {
        // Check status on Replicate
        const prediction = await replicate.predictions.get(job.replicate_prediction_id);
        console.log(`   Replicate status: ${prediction.status}`);

        if (prediction.status === 'succeeded') {
          console.log('   ✅ Job completed on Replicate, updating database...');
          await completeJob(job, prediction);
        } else if (prediction.status === 'failed') {
          console.log('   ❌ Job failed on Replicate, updating database...');
          await markJobAsFailed(job.id, prediction.error || 'Failed on Replicate');
        } else if (prediction.status === 'canceled') {
          console.log('   🚫 Job was canceled on Replicate, updating database...');
          await markJobAsFailed(job.id, 'Job was canceled');
        } else {
          console.log(`   ⏳ Job still ${prediction.status} on Replicate, leaving as is`);
        }
      } catch (replicateError) {
        console.error(`   ❌ Error checking Replicate status:`, replicateError.message);
        // Don't mark as failed yet, might be a temporary API issue
      }
    }

    console.log('\n🎉 Finished checking stuck jobs');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

async function completeJob(job, prediction) {
  try {
    const completedAt = new Date().toISOString();
    const createdAt = new Date(job.created_at);
    const processingTime = Math.round((Date.now() - createdAt.getTime()) / 1000);

    // Update job status
    await supabase
      .from('generation_jobs')
      .update({
        status: 'completed',
        completed_at: completedAt,
        processing_time_seconds: processingTime,
        result_data: { type: job.job_type, output: prediction.output, prediction_id: prediction.id }
      })
      .eq('id', job.id);

    // Create completion notification
    await supabase
      .from('notifications')
      .insert({
        user_id: job.user_id,
        type: 'generation_completed',
        message: `Your ${job.job_type.replace('_', ' ')} is ready! Click to view in gallery.`,
        link: '/gallery',
        metadata: {
          job_id: job.id,
          job_type: job.job_type,
          result: { output: prediction.output }
        }
      });

    // Save to appropriate media table
    if (job.job_type === 'image_generation' && prediction.output) {
      await saveImageToMetadata(job, prediction);
    }

    console.log('   ✅ Job marked as completed');
  } catch (error) {
    console.error('   ❌ Error completing job:', error);
  }
}

async function markJobAsFailed(jobId, errorMessage) {
  try {
    await supabase
      .from('generation_jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_message: errorMessage
      })
      .eq('id', jobId);

    console.log('   ✅ Job marked as failed');
  } catch (error) {
    console.error('   ❌ Error marking job as failed:', error);
  }
}

async function saveImageToMetadata(job, prediction) {
  try {
    const { v4: uuidv4 } = require('uuid');
    
    let imageUrls = [];
    if (Array.isArray(prediction.output)) {
      imageUrls = prediction.output.filter(url => typeof url === 'string' && url.startsWith('http'));
    } else if (typeof prediction.output === 'string' && prediction.output.startsWith('http')) {
      imageUrls = [prediction.output];
    }

    for (const imageUrl of imageUrls) {
      // For now, just save the direct URL (you can implement download/reupload later)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3);

      await supabase
        .from('generated_images_metadata')
        .insert({
          user_id: job.user_id,
          prompt: job.prompt,
          replicate_prediction_id: prediction.id,
          image_url: imageUrl, // Direct Replicate URL for now
          expires_at: expiresAt.toISOString(),
        });
    }

    console.log(`   📸 Saved ${imageUrls.length} images to metadata`);
  } catch (error) {
    console.error('   ❌ Error saving image metadata:', error);
  }
}

// Run the script
fixStuckJobs().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 