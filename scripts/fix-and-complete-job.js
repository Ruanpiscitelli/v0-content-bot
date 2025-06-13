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

async function fixAndCompleteJob() {
  try {
    console.log('🔧 Fixing and completing the job...\n');

    const jobId = '200e3f42-77fe-433f-aaab-5970c9994fa0';
    
    // Get the job
    const { data: jobs, error } = await supabase
      .from('generation_jobs')
      .select('*')
      .eq('id', jobId);

    if (error || !jobs || jobs.length === 0) {
      console.error('❌ Error fetching job:', error);
      return;
    }

    const job = jobs[0];
    console.log(`📝 Working on job: ${job.id}`);
    console.log(`   Type: ${job.job_type}`);
    console.log(`   Status: ${job.status}`);
    console.log(`   Prompt: ${job.prompt}`);

    // Get Replicate prediction
    const prediction = await replicate.predictions.get(job.replicate_prediction_id);
    console.log(`\n🔍 Replicate status: ${prediction.status}`);

    if (prediction.status !== 'succeeded') {
      console.log('❌ Prediction not succeeded, cannot complete');
      return;
    }

    console.log('✅ Prediction succeeded, completing job...');

    // 1. Update job status
    const completedAt = new Date().toISOString();
    const createdAt = new Date(job.created_at);
    const processingTime = Math.round((Date.now() - createdAt.getTime()) / 1000);

    const { error: updateError } = await supabase
      .from('generation_jobs')
      .update({
        status: 'completed',
        completed_at: completedAt,
        processing_time_seconds: processingTime,
        result_data: { 
          type: job.job_type, 
          output: prediction.output, 
          prediction_id: prediction.id 
        }
      })
      .eq('id', jobId);

    if (updateError) {
      console.error('❌ Error updating job status:', updateError);
      return;
    }
    console.log('✅ Job status updated to completed');

    // 2. Save image to metadata table (without replicate_prediction_id)
    let imageUrls = [];
    if (Array.isArray(prediction.output)) {
      imageUrls = prediction.output.filter(url => typeof url === 'string' && url.startsWith('http'));
    } else if (typeof prediction.output === 'string' && prediction.output.startsWith('http')) {
      imageUrls = [prediction.output];
    }

    console.log(`\n📸 Saving ${imageUrls.length} images to gallery...`);

    for (const imageUrl of imageUrls) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3);

      const insertData = {
        user_id: job.user_id,
        prompt: job.prompt,
        image_url: imageUrl,
        expires_at: expiresAt.toISOString(),
      };

      console.log(`   Inserting image: ${imageUrl.substring(0, 60)}...`);

      const { data, error: insertError } = await supabase
        .from('generated_images_metadata')
        .insert(insertData)
        .select();

      if (insertError) {
        console.error(`   ❌ Error inserting image:`, insertError);
      } else {
        console.log(`   ✅ Image saved successfully with ID: ${data[0].id}`);
      }
    }

    // 3. Create completion notification
    const { error: notifError } = await supabase
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

    if (notifError) {
      console.error('⚠️ Error creating notification:', notifError);
    } else {
      console.log('✅ Completion notification created');
    }

    console.log('\n🎉 Job successfully completed and image saved to gallery!');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the script
fixAndCompleteJob().then(() => {
  console.log('\nScript completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 