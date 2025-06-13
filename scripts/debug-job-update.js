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

async function debugJobUpdate() {
  try {
    console.log('🔍 Debugging job update...\n');

    // Get the specific job
    const { data: jobs, error } = await supabase
      .from('generation_jobs')
      .select('*')
      .eq('id', '200e3f42-77fe-433f-aaab-5970c9994fa0');

    if (error) {
      console.error('❌ Error fetching job:', error);
      return;
    }

    if (!jobs || jobs.length === 0) {
      console.log('❌ Job not found');
      return;
    }

    const job = jobs[0];
    console.log('📝 Current job state:');
    console.log(`   ID: ${job.id}`);
    console.log(`   Status: ${job.status}`);
    console.log(`   User ID: ${job.user_id}`);
    console.log(`   Replicate ID: ${job.replicate_prediction_id}`);
    console.log(`   Result Data: ${JSON.stringify(job.result_data, null, 2)}`);

    // Check Replicate status
    if (job.replicate_prediction_id) {
      try {
        const prediction = await replicate.predictions.get(job.replicate_prediction_id);
        console.log(`\n🔍 Replicate prediction details:`);
        console.log(`   Status: ${prediction.status}`);
        console.log(`   Output: ${JSON.stringify(prediction.output, null, 2)}`);

        // Try to save image again with proper debugging
        if (prediction.status === 'succeeded' && prediction.output) {
          console.log(`\n🔧 Attempting to save image again...`);
          await saveImageWithDebugging(job, prediction);
        }
      } catch (err) {
        console.error('❌ Error getting Replicate prediction:', err);
      }
    }

    // Check if image exists in metadata table for this user
    console.log(`\n🖼️ Checking for images by this user...`);
    const { data: userImages, error: imageError } = await supabase
      .from('generated_images_metadata')
      .select('*')
      .eq('user_id', job.user_id);

    if (imageError) {
      console.error('❌ Error fetching user images:', imageError);
    } else {
      console.log(`   Found ${userImages.length} images for user ${job.user_id}`);
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

async function saveImageWithDebugging(job, prediction) {
  try {
    console.log('🔍 Starting image save with debugging...');
    
    let imageUrls = [];
    if (Array.isArray(prediction.output)) {
      imageUrls = prediction.output.filter(url => typeof url === 'string' && url.startsWith('http'));
    } else if (typeof prediction.output === 'string' && prediction.output.startsWith('http')) {
      imageUrls = [prediction.output];
    }

    console.log(`   Detected ${imageUrls.length} image URLs`);
    
    for (const imageUrl of imageUrls) {
      console.log(`   Processing URL: ${imageUrl.substring(0, 60)}...`);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3);

      const insertData = {
        user_id: job.user_id,
        prompt: job.prompt,
        replicate_prediction_id: prediction.id,
        image_url: imageUrl,
        expires_at: expiresAt.toISOString(),
      };

      console.log('   Insert data:');
      console.log(`     user_id: ${insertData.user_id}`);
      console.log(`     prompt: ${insertData.prompt}`);
      console.log(`     replicate_prediction_id: ${insertData.replicate_prediction_id}`);
      console.log(`     expires_at: ${insertData.expires_at}`);

      const { data, error } = await supabase
        .from('generated_images_metadata')
        .insert(insertData)
        .select();

      if (error) {
        console.error(`   ❌ Error inserting image:`, error);
      } else {
        console.log(`   ✅ Image inserted successfully:`, data);
      }
    }

  } catch (error) {
    console.error('❌ Error in saveImageWithDebugging:', error);
  }
}

// Run the script
debugJobUpdate().then(() => {
  console.log('\nScript completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 