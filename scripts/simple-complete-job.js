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

async function simpleCompleteJob() {
  try {
    console.log('🔧 Simply completing the job with minimal fields...\n');

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
    console.log(`📝 Job: ${job.id} (${job.status})`);

    // Get Replicate prediction
    const prediction = await replicate.predictions.get(job.replicate_prediction_id);
    console.log(`🔍 Replicate: ${prediction.status}`);

    if (prediction.status !== 'succeeded') {
      console.log('❌ Not succeeded');
      return;
    }

    // 1. Update job to completed with only basic fields
    console.log('\n🔄 Updating job status...');
    const { error: updateError } = await supabase
      .from('generation_jobs')
      .update({
        status: 'completed',
        result_data: { 
          output: prediction.output
        }
      })
      .eq('id', jobId);

    if (updateError) {
      console.error('❌ Error updating job:', updateError);
      return;
    }
    console.log('✅ Job marked as completed');

    // 2. Save image with minimal fields
    console.log('\n📸 Saving image...');
    
    let imageUrl = null;
    if (Array.isArray(prediction.output) && prediction.output.length > 0) {
      imageUrl = prediction.output[0];
    } else if (typeof prediction.output === 'string') {
      imageUrl = prediction.output;
    }

    if (!imageUrl) {
      console.log('❌ No image URL found');
      return;
    }

    const { data: imageData, error: insertError } = await supabase
      .from('generated_images_metadata')
      .insert({
        user_id: job.user_id,
        prompt: job.prompt,
        image_url: imageUrl
      })
      .select();

    if (insertError) {
      console.error('❌ Error saving image:', insertError);
    } else {
      console.log(`✅ Image saved with ID: ${imageData[0].id}`);
      console.log(`📷 Image URL: ${imageUrl}`);
    }

    console.log('\n🎉 DONE! Check your gallery now!');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the script
simpleCompleteJob().then(() => {
  console.log('\nScript completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 