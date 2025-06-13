require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const Replicate = require('replicate');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

async function debugSpecificJob() {
  // Let's use the audio job that we know succeeded on Replicate
  const jobId = '5cb8368c-5f62-4b9a-862c-d4b2d78d9754';
  const predictionId = 'q7eys5cp89rmc0cq3hqb02p4yw';
  
  console.log('🔍 Debugging job processing step by step...\n');

  // Step 1: Get job from database
  console.log('1️⃣ Getting job from database...');
  const { data: job, error: jobError } = await supabase
    .from('generation_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (jobError) {
    console.error('❌ Error getting job:', jobError);
    return;
  }
  
  console.log('✅ Job found:', {
    id: job.id,
    status: job.status,
    job_type: job.job_type,
    replicate_prediction_id: job.replicate_prediction_id
  });

  // Step 2: Get prediction from Replicate
  console.log('\n2️⃣ Getting prediction from Replicate...');
  const prediction = await replicate.predictions.get(predictionId);
  
  console.log('✅ Prediction status:', {
    id: prediction.id,
    status: prediction.status,
    model: prediction.model,
    hasOutput: !!prediction.output
  });

  if (prediction.output) {
    console.log('   Output URL:', prediction.output.substring(0, 100) + '...');
  }

  // Step 3: Try simpler update - just status first
  console.log('\n3️⃣ Updating job status to processing (simple)...');
  const { error: updateProcessingError } = await supabase
    .from('generation_jobs')
    .update({ status: 'processing' })
    .eq('id', jobId);
    
  if (updateProcessingError) {
    console.error('❌ Error updating to processing:', updateProcessingError);
  } else {
    console.log('✅ Job marked as processing');
  }

  // Step 4: Prepare completion data (using only basic fields)
  console.log('\n4️⃣ Preparing completion data...');
  
  const completedAt = new Date().toISOString();

  // Extract output URL
  let outputUrl = null;
  if (typeof prediction.output === 'string' && prediction.output.startsWith('http')) {
    outputUrl = prediction.output;
  }

  const result = {
    type: 'audio',
    status: 'succeeded',
    result: outputUrl,
    prediction_id: prediction.id
  };

  console.log('   Result data prepared:', {
    type: result.type,
    hasOutputUrl: !!outputUrl,
    outputUrl: outputUrl ? outputUrl.substring(0, 80) + '...' : 'None'
  });

  // Step 5: Update job as completed (using only confirmed fields)
  console.log('\n5️⃣ Updating job to completed (simple)...');
  const { error: updateCompletedError } = await supabase
    .from('generation_jobs')
    .update({
      status: 'completed',
      completed_at: completedAt,
      output_url: outputUrl
    })
    .eq('id', jobId);

  if (updateCompletedError) {
    console.error('❌ Error updating to completed:', updateCompletedError);
  } else {
    console.log('✅ Job marked as completed successfully!');
  }

  // Step 6: Insert audio metadata (using only basic fields)
  console.log('\n6️⃣ Inserting audio metadata (simplified)...');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error: metadataError } = await supabase
    .from('generated_audios_metadata')
    .insert({
      user_id: job.user_id,
      job_id: job.id,
      prompt: job.prompt,
      audio_url: outputUrl,
      expires_at: expiresAt.toISOString(),
      metadata: job.input_parameters || {}
    });

  if (metadataError) {
    console.error('❌ Error inserting metadata:', metadataError);
  } else {
    console.log('✅ Audio metadata inserted successfully!');
  }

  // Step 7: Verify final state
  console.log('\n7️⃣ Verifying final state...');
  const { data: finalJob } = await supabase
    .from('generation_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  console.log('Final job state:', {
    status: finalJob.status,
    hasOutputUrl: !!finalJob.output_url,
    completedAt: finalJob.completed_at,
    hasResultData: !!finalJob.result_data
  });

  const { data: audioMetadata } = await supabase
    .from('generated_audios_metadata')
    .select('*')
    .eq('job_id', jobId);

  console.log('Audio metadata records:', audioMetadata?.length || 0);
  if (audioMetadata && audioMetadata.length > 0) {
    console.log('Audio metadata details:', {
      id: audioMetadata[0].id,
      hasAudioUrl: !!audioMetadata[0].audio_url,
      audioUrl: audioMetadata[0].audio_url?.substring(0, 80) + '...'
    });
  }

  console.log('\n🎉 Job processing completed manually!');
  console.log('🔗 Audio URL:', outputUrl);
}

debugSpecificJob().catch(console.error); 