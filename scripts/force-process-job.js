require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Replicate = require('replicate');

// Initialize clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function forceProcessJob() {
  try {
    console.log('🔍 Looking for pending jobs...\n');

    // Find the pending job
    const { data: jobs, error } = await supabase
      .from('generation_jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('❌ Error fetching jobs:', error);
      return;
    }

    if (!jobs || jobs.length === 0) {
      console.log('✅ No pending jobs found');
      return;
    }

    const job = jobs[0];
    console.log(`📝 Found pending job: ${job.id}`);
    console.log(`   Type: ${job.job_type}`);
    console.log(`   Prompt: ${job.prompt}`);
    console.log(`   Replicate ID: ${job.replicate_prediction_id}`);

    if (job.replicate_prediction_id) {
      // Check status on Replicate first
      try {
        const prediction = await replicate.predictions.get(job.replicate_prediction_id);
        console.log(`\n🔍 Replicate status: ${prediction.status}`);
        
        if (prediction.status === 'succeeded') {
          console.log('✅ Job already completed on Replicate! Updating database...');
          await completeJob(job, prediction);
          return;
        } else if (prediction.status === 'failed') {
          console.log('❌ Job failed on Replicate! Updating database...');
          await markJobAsFailed(job.id, prediction.error || 'Failed on Replicate');
          return;
        }
      } catch (replicateError) {
        console.error('⚠️ Error checking Replicate:', replicateError.message);
      }
    }

    // Force trigger job processing via API call
    console.log('\n🚀 Force triggering job processing...');
    
    try {
      const response = await fetch('http://localhost:3000/api/jobs/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Job processing triggered successfully:', result);
      } else {
        const error = await response.text();
        console.error('❌ Job processing failed:', error);
      }
    } catch (fetchError) {
      console.error('❌ Error calling processing API:', fetchError.message);
    }

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

    // Save to metadata table
    if (job.job_type === 'image_generation' && prediction.output) {
      await saveImageToMetadata(job, prediction);
    }

    console.log('✅ Job completed successfully');
  } catch (error) {
    console.error('❌ Error completing job:', error);
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

    console.log('✅ Job marked as failed');
  } catch (error) {
    console.error('❌ Error marking job as failed:', error);
  }
}

async function saveImageToMetadata(job, prediction) {
  try {
    let imageUrls = [];
    if (Array.isArray(prediction.output)) {
      imageUrls = prediction.output.filter(url => typeof url === 'string' && url.startsWith('http'));
    } else if (typeof prediction.output === 'string' && prediction.output.startsWith('http')) {
      imageUrls = [prediction.output];
    }

    for (const imageUrl of imageUrls) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3);

      await supabase
        .from('generated_images_metadata')
        .insert({
          user_id: job.user_id,
          prompt: job.prompt,
          replicate_prediction_id: prediction.id,
          image_url: imageUrl,
          expires_at: expiresAt.toISOString(),
        });
    }

    console.log(`📸 Saved ${imageUrls.length} images to metadata`);
  } catch (error) {
    console.error('❌ Error saving image metadata:', error);
  }
}

// Run the script
forceProcessJob().then(() => {
  console.log('\nScript completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 