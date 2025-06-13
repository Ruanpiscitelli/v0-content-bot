import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Replicate from "replicate";
import { v4 as uuidv4 } from 'uuid';

// Initialize clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

interface JobData {
  id: string;
  user_id: string;
  job_type: string;
  prompt: string;
  input_parameters: any;
  status: string;
}

export async function POST(request: Request) {
  try {
    let jobId = null;
    
    // Try to parse JSON body, but don't fail if it's empty
    try {
      const body = await request.json();
      jobId = body?.jobId;
    } catch (e) {
      // Empty body or invalid JSON, that's okay
    }

    let job;
    
    if (jobId) {
      // Process specific job
      const { data: jobData, error: jobError } = await supabase
        .from('generation_jobs')
        .select('*')
        .eq('id', jobId)
        .eq('status', 'pending')
        .single();

      if (jobError || !jobData) {
        return NextResponse.json(
          { error: 'Job not found or already processing' },
          { status: 404 }
        );
      }
      
      job = jobData;
    } else {
      // Find the oldest pending job
      const { data: jobData, error: jobError } = await supabase
        .from('generation_jobs')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (jobError || !jobData) {
        return NextResponse.json(
          { success: true, message: 'No pending jobs to process' },
          { status: 200 }
        );
      }
      
      job = jobData;
      jobId = job.id;
    }

    // Update job status to processing (simplified to avoid schema cache issues)
    await supabase
      .from('generation_jobs')
      .update({ status: 'processing' })
      .eq('id', jobId);

    // Send notification that processing started
    await supabase
      .from('notifications')
      .insert({
        user_id: job.user_id,
        type: 'generation_processing',
        message: `Your ${job.job_type.replace('_', ' ')} is now being processed...`,
        metadata: {
          job_id: job.id,
          job_type: job.job_type
        }
      });

    // Process the job based on type
    try {
      let result;
      if (job.job_type === 'image_generation') {
        // Check if this is actually a face swap job
        if (job.input_parameters?.is_face_swap === true) {
          result = await processFaceSwap(job);
        } else {
          result = await processImageGeneration(job);
        }
      } else if (job.job_type === 'video_generation') {
        // Check if this is actually a lip sync job
        if (job.input_parameters?.is_lip_sync === true) {
          result = await processLipSync(job);
        } else {
          result = await processVideoGeneration(job);
        }
      } else if (job.job_type === 'audio_generation') {
        result = await processAudioGeneration(job);
      } else {
        throw new Error(`Unknown job type: ${job.job_type}`);
      }

      // Update job as completed (simplified to avoid schema cache issues)
      const completedAt = new Date().toISOString();

      // Extract output URL from result for easier access
      let outputUrl = null;
      if (
        result.type === 'image' &&
        'urls' in result &&
        Array.isArray(result.urls) &&
        result.urls.length > 0
      ) {
        outputUrl = result.urls[0];
      } else if (
        result.type === 'face_swap' &&
        'url' in result &&
        typeof result.url === 'string'
      ) {
        outputUrl = result.url;
      } else if (
        result.type === 'video' &&
        'url' in result &&
        typeof result.url === 'string'
      ) {
        outputUrl = result.url;
      } else if (
        result.type === 'audio' &&
        'result' in result &&
        typeof result.result === 'string'
      ) {
        outputUrl = result.result;
      } else if (
        result.type === 'lip_sync' &&
        'url' in result &&
        typeof result.url === 'string'
      ) {
        outputUrl = result.url;
      }

      await supabase
        .from('generation_jobs')
        .update({
          status: 'completed',
          completed_at: completedAt,
          output_url: outputUrl
        })
        .eq('id', jobId);

      console.log(`✅ Job ${jobId} marked as completed with output URL:`, outputUrl);

      // Send success notification
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
            result: result
          }
        });

      return NextResponse.json({ success: true, result });

    } catch (error: any) {
      console.error(`Error processing job ${jobId}:`, error);

      // Update job as failed (simplified)
      await supabase
        .from('generation_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error.message
        })
        .eq('id', jobId);

      // Send failure notification
      await supabase
        .from('notifications')
        .insert({
          user_id: job.user_id,
          type: 'generation_failed',
          message: `Your ${job.job_type.replace('_', ' ')} failed to generate. Please try again.`,
          metadata: {
            job_id: job.id,
            job_type: job.job_type,
            error: error.message
          }
        });

      return NextResponse.json({ success: false, error: error.message });
    }

  } catch (error: any) {
    console.error('Error in job processor:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function processImageGeneration(job: JobData) {
  const { prompt, input_parameters } = job;
  
  // Map input parameters for FLUX Schnell
  const input = {
    prompt: prompt,
    aspect_ratio: input_parameters.aspectRatio || "1:1",
    num_outputs: 1,
    num_inference_steps: 4,
    output_format: 'png',
    output_quality: 90,
    disable_safety_checker: false,
    go_fast: false,
    megapixels: '1',
    ...input_parameters
  };

  // Create Replicate prediction
  const prediction = await replicate.predictions.create({
    model: "black-forest-labs/flux-schnell",
    input: input,
  });

  // Update job with prediction ID
  await supabase
    .from('generation_jobs')
    .update({ replicate_prediction_id: prediction.id })
    .eq('id', job.id);

  // Wait for completion
  let completedPrediction = prediction;
  let pollAttempts = 0;
  const maxPollAttempts = 30;
  
  while (completedPrediction.status !== 'succeeded' && 
         completedPrediction.status !== 'failed' && 
         pollAttempts < maxPollAttempts) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    completedPrediction = await replicate.predictions.get(prediction.id);
    pollAttempts++;
  }
  
  if (completedPrediction.status === 'failed') {
    const errorMessage = typeof completedPrediction.error === 'string'
      ? completedPrediction.error
      : 'Unknown error';
    throw new Error(`Prediction failed: ${errorMessage}`);
  }
  
  if (completedPrediction.status !== 'succeeded') {
    throw new Error(`Prediction timed out after ${maxPollAttempts} attempts`);
  }

  const output = completedPrediction.output;
  let imageUrls: string[] = [];

  if (Array.isArray(output)) {
    imageUrls = output.filter(url => typeof url === 'string' && url.startsWith('http'));
  } else if (typeof output === 'string' && output.startsWith('http')) {
    imageUrls = [output];
  }

  if (imageUrls.length === 0) {
    throw new Error('No valid image URLs received from prediction');
  }

  // Process and save images
  const processedUrls = [];
  
  for (const imageUrl of imageUrls) {
    // Download image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }
    
    const imageBlob = await imageResponse.blob();
    const imageContentType = imageResponse.headers.get('content-type') || 'image/png';
    const fileExtension = imageContentType.split('/')[1] || 'png';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storagePath = `public/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generated_images')
      .upload(storagePath, imageBlob, {
        contentType: imageContentType,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('generated_images')
      .getPublicUrl(uploadData.path);

    const imageUrlInSupabase = publicUrlData.publicUrl;

    // Save metadata (simplified to avoid schema cache issues)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3);

    await supabase
      .from('generated_images_metadata')
      .insert({
        user_id: job.user_id,
        job_id: job.id,
        prompt: prompt,
        storage_path: uploadData.path,
        image_url: imageUrlInSupabase,
        expires_at: expiresAt.toISOString(),
        metadata: {
          prediction_id: prediction.id,
          aspect_ratio: input_parameters.aspectRatio || "1:1",
          model: "black-forest-labs/flux-schnell"
        }
      });

    processedUrls.push(imageUrlInSupabase);
  }

  return {
    type: 'image',
    urls: processedUrls,
    prediction_id: prediction.id
  };
}

async function processVideoGeneration(job: JobData) {
  const { prompt, input_parameters } = job;
  
  // Map input parameters for video generation
  const input: Record<string, any> = {
    prompt: prompt,
    aspect_ratio: input_parameters.aspectRatio || "16:9",
  };

  // Add first frame image if provided
  if (input_parameters.startImage) {
    console.log('🖼️ Using start image for video generation');
    // The model expects first_frame_image in base64 or URL format
    // If it's already a data URL, use as is, otherwise it's a base64 string
    input.first_frame_image = input_parameters.startImage;
  }

  // Add other parameters
  if (input_parameters.duration) {
    input.duration = input_parameters.duration;
  }

  console.log('🎬 Creating video with input:', { 
    prompt, 
    aspect_ratio: input.aspect_ratio,
    has_first_frame: !!input.first_frame_image,
    duration: input.duration 
  });

  // Create Replicate prediction for video
  const prediction = await replicate.predictions.create({
    model: "minimax/video-01",
    input: input,
  });

  // Update job with prediction ID
  await supabase
    .from('generation_jobs')
    .update({ replicate_prediction_id: prediction.id })
    .eq('id', job.id);

  // Wait for completion
  let completedPrediction = prediction;
  let pollAttempts = 0;
  const maxPollAttempts = 60; // Videos take longer
  
  while (completedPrediction.status !== 'succeeded' && 
         completedPrediction.status !== 'failed' && 
         pollAttempts < maxPollAttempts) {
    await new Promise(resolve => setTimeout(resolve, 15000)); // Check every 15 seconds
    completedPrediction = await replicate.predictions.get(prediction.id);
    pollAttempts++;
    
    console.log(`🎬 Video generation progress: ${completedPrediction.status} (attempt ${pollAttempts}/${maxPollAttempts})`);
  }
  
  if (completedPrediction.status === 'failed') {
    const errorMessage = typeof completedPrediction.error === 'string'
      ? completedPrediction.error
      : 'Unknown error';
    
    // Provide more specific error messages
    if (errorMessage.includes('Video duration should be between')) {
      throw new Error(`Video duration error: The uploaded video must be between 2.0 and 10.9 seconds long. Please upload a shorter video and try again.`);
    } else if (errorMessage.includes('duration')) {
      throw new Error(`Video duration error: ${errorMessage}. Please check your video length and try again.`);
    } else {
      throw new Error(`Video generation failed: ${errorMessage}`);
    }
  }
  
  if (completedPrediction.status !== 'succeeded') {
    throw new Error(`Prediction timed out after ${maxPollAttempts} attempts`);
  }

  const videoUrl = completedPrediction.output;
  
  if (!videoUrl || typeof videoUrl !== 'string') {
    throw new Error('No valid video URL received from prediction');
  }

  console.log('✅ Video generation completed, saving to storage...');

  // Download and save video
  const videoResponse = await fetch(videoUrl);
  if (!videoResponse.ok) {
    throw new Error(`Failed to download video: ${videoResponse.statusText}`);
  }
  
  const videoBlob = await videoResponse.blob();
  const fileName = `${uuidv4()}.mp4`;
  const storagePath = `public/${fileName}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('generated-videos')
    .upload(storagePath, videoBlob, {
      contentType: 'video/mp4',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('generated-videos')
    .getPublicUrl(uploadData.path);

  const videoUrlInSupabase = publicUrlData.publicUrl;

  // Save metadata
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  try {
    const { error: metadataError } = await supabase
      .from('generated_videos_metadata')
      .insert({
        user_id: job.user_id,
        job_id: job.id,
        prompt: prompt,
        storage_path: uploadData.path,
        video_url: videoUrlInSupabase,
        duration: input_parameters.duration || null,
        aspect_ratio: input_parameters.aspectRatio || "16:9",
        expires_at: expiresAt.toISOString(),
        metadata: {
          prediction_id: prediction.id,
          model: "minimax/video-01"
        }
      });

    if (metadataError) {
      console.error('❌ Error saving video metadata:', metadataError);
      throw new Error(`Failed to save video metadata: ${metadataError.message}`);
    }

    console.log('✅ Video saved to database successfully');
  } catch (dbError: any) {
    console.error('❌ Database error:', dbError);
    throw new Error(`Database operation failed: ${dbError.message}`);
  }

  return {
    type: 'video',
    url: videoUrlInSupabase,
    prediction_id: prediction.id
  };
}

async function processLipSync(job: JobData) {
  const { prompt, input_parameters } = job;
  
  console.log('🎤 Starting lip sync processing with params:', input_parameters);

  // Prepare input for Kling lip sync model
  const input: any = {
    video_url: input_parameters.video_url,
  };

  // Add audio file or text based on mode
  if (input_parameters.mode === 'audio') {
    if (!input_parameters.audio_file) {
      throw new Error('Audio file is required for audio mode');
    }
    input.audio_file = input_parameters.audio_file;
    console.log('🎵 Using audio file for lip sync');
  } else if (input_parameters.mode === 'text') {
    if (!input_parameters.text) {
      throw new Error('Text is required for text mode');
    }
    input.text = input_parameters.text;
    input.voice_id = input_parameters.voice_id || 'en_AOT';
    input.voice_speed = input_parameters.voice_speed || 1;
    console.log('📝 Using text-to-speech for lip sync:', {
      voice_id: input.voice_id,
      voice_speed: input.voice_speed
    });
  } else {
    throw new Error('Invalid mode. Must be "audio" or "text"');
  }

  console.log('🎬 Creating lip sync prediction with input:', { 
    has_video_url: !!input.video_url,
    has_audio_file: !!input.audio_file,
    has_text: !!input.text,
    voice_id: input.voice_id,
    voice_speed: input.voice_speed
  });

  // Create Replicate prediction for lip sync
  const prediction = await replicate.predictions.create({
    model: "kwaivgi/kling-lip-sync",
    input: input,
  });

  // Update job with prediction ID
  await supabase
    .from('generation_jobs')
    .update({ replicate_prediction_id: prediction.id })
    .eq('id', job.id);

  // Wait for completion
  let completedPrediction = prediction;
  let pollAttempts = 0;
  const maxPollAttempts = 60; // Lip sync can take time
  
  while (completedPrediction.status !== 'succeeded' && 
         completedPrediction.status !== 'failed' && 
         pollAttempts < maxPollAttempts) {
    await new Promise(resolve => setTimeout(resolve, 15000)); // Check every 15 seconds
    completedPrediction = await replicate.predictions.get(prediction.id);
    pollAttempts++;
    
    console.log(`🎤 Lip sync progress: ${completedPrediction.status} (attempt ${pollAttempts}/${maxPollAttempts})`);
  }
  
  if (completedPrediction.status === 'failed') {
    const errorMessage = typeof completedPrediction.error === 'string'
      ? completedPrediction.error
      : 'Unknown error';
    console.error('🚫 Lip sync failed:', errorMessage);
    
    // Provide more specific error messages
    if (errorMessage.includes('Video duration should be between')) {
      throw new Error(`❌ Video Duration Error: Your video must be between 2.0 and 10.9 seconds long. The automatic trimming may have failed. Please manually trim your video to the correct length and try again.`);
    } else if (errorMessage.includes('duration')) {
      throw new Error(`❌ Duration Error: ${errorMessage}. Please check your video length (should be 2-10.9 seconds) and try again.`);
    } else if (errorMessage.includes('format') || errorMessage.includes('codec')) {
      throw new Error(`❌ Video Format Error: ${errorMessage}. Please try converting your video to MP4 format and try again.`);
    } else if (errorMessage.includes('resolution') || errorMessage.includes('size')) {
      throw new Error(`❌ Video Resolution Error: ${errorMessage}. Please ensure your video is between 720p and 1080p resolution.`);
    } else {
      throw new Error(`❌ Lip Sync Failed: ${errorMessage}. Please try with a different video file.`);
    }
  }
  
  if (completedPrediction.status !== 'succeeded') {
    throw new Error(`Lip sync timed out after ${maxPollAttempts} attempts`);
  }

  const videoUrl = completedPrediction.output;
  
  if (!videoUrl || typeof videoUrl !== 'string') {
    throw new Error('No valid video URL received from lip sync prediction');
  }

  console.log('✅ Lip sync completed, saving to storage...');

  // Download and save the lip-synced video
  const videoResponse = await fetch(videoUrl);
  if (!videoResponse.ok) {
    throw new Error(`Failed to download lip-synced video: ${videoResponse.statusText}`);
  }
  
  const videoBlob = await videoResponse.blob();
  const fileName = `${uuidv4()}.mp4`;
  const storagePath = `public/${fileName}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('generated-videos')
    .upload(storagePath, videoBlob, {
      contentType: 'video/mp4',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('generated-videos')
    .getPublicUrl(uploadData.path);

  const videoUrlInSupabase = publicUrlData.publicUrl;

  // Save metadata to database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

  await supabase
    .from('generated_videos_metadata')
    .insert({
      user_id: job.user_id,
      job_id: job.id, // Use job_id instead of replicate_prediction_id
      prompt: input_parameters.mode === 'text' ? input_parameters.text : 'Lip sync with audio',
      storage_path: uploadData.path,
      video_url: videoUrlInSupabase,
      duration: null, // Duration not specified for lip sync
      aspect_ratio: null, // Aspect ratio inherited from source video
      expires_at: expiresAt.toISOString(),
      metadata: {
        type: 'lip_sync',
        mode: input_parameters.mode,
        voice_id: input_parameters.voice_id,
        voice_speed: input_parameters.voice_speed,
        original_video_url: input_parameters.video_url,
        prediction_id: prediction.id,
        model: "kwaivgi/kling-lip-sync"
      }
    });

  console.log('✅ Lip-synced video saved to database successfully');

  return {
    type: 'lip_sync',
    url: videoUrlInSupabase,
    prediction_id: prediction.id,
    mode: input_parameters.mode
  };
}

async function processAudioGeneration(job: JobData) {
  const { prompt, input_parameters } = job;

  console.log('🎤 Starting audio generation with MiniMax Speech-02-HD model, params:', {
    text: prompt,
    voice_id: input_parameters.voice_id || 'Friendly_Person',
    speed: input_parameters.speed || 1,
    volume: input_parameters.volume || 1,
    pitch: input_parameters.pitch || 0,
    emotion: input_parameters.emotion || 'happy',
    english_normalization: input_parameters.english_normalization || true,
    sample_rate: input_parameters.sample_rate || 32000,
    bitrate: input_parameters.bitrate || 128000,
    channel: input_parameters.channel || 'mono',
    language_boost: input_parameters.language_boost || 'English'
  });
  
  const input: any = {
    text: prompt,
    voice_id: input_parameters.voice_id || 'Friendly_Person', // Default to friendly voice
    speed: input_parameters.speed || 1,
    volume: input_parameters.volume || 1,
    pitch: input_parameters.pitch || 0,
    emotion: input_parameters.emotion || 'happy',
    english_normalization: input_parameters.english_normalization === undefined ? true : input_parameters.english_normalization,
    sample_rate: input_parameters.sample_rate || 32000,
    bitrate: input_parameters.bitrate || 128000,
    channel: input_parameters.channel || 'mono',
    language_boost: input_parameters.language_boost || 'English'
  };

  console.log('🔧 MiniMax Speech-02-HD input parameters:', input);

  try {
    const modelIdentifier = "minimax/speech-02-hd";
    console.log(`🚀 Creating Replicate prediction with model: ${modelIdentifier}`);
    
    const initialPrediction = await replicate.predictions.create({
      model: modelIdentifier,
      input: input,
    });

    console.log('⏳ MiniMax Speech-02-HD prediction created:', initialPrediction.id);
    console.log('   Status:', initialPrediction.status);

    // Update job with prediction ID
    await supabase
      .from('generation_jobs')
      .update({ replicate_prediction_id: initialPrediction.id })
      .eq('id', job.id);

    // Wait for completion
    let completedPrediction = initialPrediction;
    let pollAttempts = 0;
    const maxPollAttempts = 45; // Approx 7.5 minutes (45 * 10s)
    
    while (completedPrediction.status !== 'succeeded' && 
           completedPrediction.status !== 'failed' && 
           pollAttempts < maxPollAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Check every 10 seconds
      completedPrediction = await replicate.predictions.get(initialPrediction.id);
      pollAttempts++;
      console.log(`🎧 Audio generation progress for ${initialPrediction.id}: ${completedPrediction.status} (attempt ${pollAttempts}/${maxPollAttempts})`);
    }
    
    if (completedPrediction.status === 'failed') {
      console.error('❌ MiniMax Speech-02-HD prediction failed:', completedPrediction.error);
      throw new Error(`Audio generation failed on Replicate: ${completedPrediction.error || 'Unknown error'}`);
    }
    
    if (completedPrediction.status !== 'succeeded') {
      throw new Error(`Audio generation timed out after ${maxPollAttempts} attempts for prediction ${initialPrediction.id}`);
    }

    const output = completedPrediction.output;
    console.log('🎯 MiniMax Speech-02-HD prediction output:', output);

    // MiniMax Speech-02-HD returns a direct URL to the audio file (MP3)
    let audioUrl = null;
    if (typeof output === 'string' && output.startsWith('http')) {
      audioUrl = output;
    } else if (Array.isArray(output) && output.length > 0 && typeof output[0] === 'string' && output[0].startsWith('http')) {
      audioUrl = output[0];
    }

    if (!audioUrl) {
      const errorMessage = 'Audio generation failed: No audio URL in MiniMax Speech-02-HD output. Raw output: ' + JSON.stringify(output);
      console.error('❌ MiniMax Speech-02-HD output does not contain a valid audio URL:', output);
      throw new Error(errorMessage);
    }
    
    console.log('✅ Audio URL extracted:', audioUrl);

    // Save to generated_audios_metadata (simplified to avoid schema cache issues)
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7-day expiry

      await supabase.from('generated_audios_metadata').insert({
        user_id: job.user_id,
        job_id: job.id, // Link back to the job
        prompt: prompt,
        audio_url: audioUrl, // Using the direct Replicate URL
        expires_at: expiresAt.toISOString(),
        metadata: input_parameters || {}
      });
       console.log('✅ Audio metadata saved to generated_audios_metadata');
    } catch (metadataError: any) {
      console.error('⚠️ Error saving audio metadata (job will still be marked completed with Replicate URL):', metadataError.message);
      // Do not throw here, allow the job to complete with the Replicate URL at least
    }

    return {
      type: 'audio',
      status: 'succeeded',
      result: audioUrl, // This is the direct URL from Replicate
      prediction_id: completedPrediction.id
    };
  } catch (error: any) {
    console.error('❌ MiniMax Speech-02-HD generation failed:', error);
    if (error.response && typeof error.response.json === 'function') {
        try {
            const errorDetails = await error.response.json();
            console.error('❌ Replicate API Error Details:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: errorDetails
            });
        } catch (jsonError) {
            const rawText = await error.response.text().catch(() => 'Could not parse error response body or get raw text');
            console.error('❌ Replicate API Error Details (raw):', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: rawText
            });
        }
    } else if (error.response && error.response.data) {
         console.error('❌ Replicate API Error Details (fallback):', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
        });
    }
    throw new Error(`Audio generation process failed for minimax/speech-02-hd: ${error.message}`);
  }
}

async function processFaceSwap(job: JobData) {
  const { prompt, input_parameters } = job;

  console.log('🎭 Starting face swap with Easel Advanced Face Swap model, params:', {
    has_target_image: !!input_parameters.target_image,
    has_swap_image: !!input_parameters.swap_image,
    has_swap_image_b: !!input_parameters.swap_image_b,
    user_gender: input_parameters.user_gender,
    user_b_gender: input_parameters.user_b_gender,
    hair_source: input_parameters.hair_source || 'target'
  });

  // Prepare input for Easel face swap model
  const input: any = {
    target_image: input_parameters.target_image,
    swap_image: input_parameters.swap_image,
    hair_source: input_parameters.hair_source || 'target'
  };

  // Add optional parameters
  if (input_parameters.user_gender && input_parameters.user_gender !== 'default') {
    input.user_gender = input_parameters.user_gender;
  }

  if (input_parameters.swap_image_b) {
    input.swap_image_b = input_parameters.swap_image_b;
  }

  if (input_parameters.user_b_gender && input_parameters.user_b_gender !== 'default') {
    input.user_b_gender = input_parameters.user_b_gender;
  }

  console.log('🔧 Easel face swap input parameters:', {
    has_target_image: !!input.target_image,
    has_swap_image: !!input.swap_image,
    has_swap_image_b: !!input.swap_image_b,
    user_gender: input.user_gender,
    user_b_gender: input.user_b_gender,
    hair_source: input.hair_source
  });

  try {
    const modelIdentifier = "easel/advanced-face-swap";
    console.log(`🚀 Creating Replicate prediction with model: ${modelIdentifier}`);
    
    const initialPrediction = await replicate.predictions.create({
      model: modelIdentifier,
      input: input,
    });

    console.log('⏳ Easel face swap prediction created:', initialPrediction.id);
    console.log('   Status:', initialPrediction.status);

    // Update job with prediction ID
    await supabase
      .from('generation_jobs')
      .update({ replicate_prediction_id: initialPrediction.id })
      .eq('id', job.id);

    // Wait for completion
    let completedPrediction = initialPrediction;
    let pollAttempts = 0;
    const maxPollAttempts = 45; // Face swap can take time
    
    while (completedPrediction.status !== 'succeeded' && 
           completedPrediction.status !== 'failed' && 
           pollAttempts < maxPollAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Check every 10 seconds
      completedPrediction = await replicate.predictions.get(initialPrediction.id);
      pollAttempts++;
      console.log(`🎭 Face swap progress for ${initialPrediction.id}: ${completedPrediction.status} (attempt ${pollAttempts}/${maxPollAttempts})`);
    }
    
    if (completedPrediction.status === 'failed') {
      console.error('❌ Easel face swap prediction failed:', completedPrediction.error);
      throw new Error(`Face swap failed on Replicate: ${completedPrediction.error || 'Unknown error'}`);
    }
    
    if (completedPrediction.status !== 'succeeded') {
      throw new Error(`Face swap timed out after ${maxPollAttempts} attempts for prediction ${initialPrediction.id}`);
    }

    const output = completedPrediction.output;
    console.log('🎯 Easel face swap prediction output:', typeof output, output?.substring ? output.substring(0, 100) + '...' : output);

    // Easel face swap returns a direct URL to the image
    let imageUrl = null;
    if (typeof output === 'string' && output.startsWith('http')) {
      imageUrl = output;
    }

    if (!imageUrl) {
      const errorMessage = 'Face swap failed: No image URL in Easel output. Raw output: ' + JSON.stringify(output);
      console.error('❌ Easel face swap output does not contain a valid image URL:', output);
      throw new Error(errorMessage);
    }
    
    console.log('✅ Face swap URL extracted:', imageUrl);

    // Download and save the face-swapped image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download face-swapped image: ${imageResponse.statusText}`);
    }
    
    const imageBlob = await imageResponse.blob();
    const imageContentType = imageResponse.headers.get('content-type') || 'image/png';
    const fileExtension = imageContentType.split('/')[1] || 'png';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storagePath = `public/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generated_images')
      .upload(storagePath, imageBlob, {
        contentType: imageContentType,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('generated_images')
      .getPublicUrl(uploadData.path);

    const imageUrlInSupabase = publicUrlData.publicUrl;

    // Save metadata to generated_images_metadata
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3); // 3-day expiry

      await supabase.from('generated_images_metadata').insert({
        user_id: job.user_id,
        job_id: job.id,
        prompt: prompt,
        storage_path: uploadData.path,
        image_url: imageUrlInSupabase,
        expires_at: expiresAt.toISOString(),
        metadata: {
          prediction_id: completedPrediction.id,
          model: "easel/advanced-face-swap",
          type: "face_swap",
          hair_source: input.hair_source,
          user_gender: input.user_gender,
          user_b_gender: input.user_b_gender,
          has_second_face: !!input.swap_image_b
        }
      });
      console.log('✅ Face swap metadata saved to generated_images_metadata');
    } catch (metadataError: any) {
      console.error('⚠️ Error saving face swap metadata (job will still be marked completed with Supabase URL):', metadataError.message);
      // Do not throw here, allow the job to complete with the Supabase URL at least
    }

    return {
      type: 'face_swap',
      status: 'succeeded',
      url: imageUrlInSupabase, // This is the URL stored in Supabase
      prediction_id: completedPrediction.id,
      original_url: imageUrl // Keep the original Replicate URL for reference
    };
  } catch (error: any) {
    console.error('❌ Easel face swap generation failed:', error);
    if (error.response && typeof error.response.json === 'function') {
      try {
        const errorDetails = await error.response.json();
        console.error('❌ Replicate API Error Details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: errorDetails
        });
      } catch (jsonError) {
        const rawText = await error.response.text().catch(() => 'Could not parse error response body or get raw text');
        console.error('❌ Replicate API Error Details (raw):', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: rawText
        });
      }
    } else if (error.response && error.response.data) {
      console.error('❌ Replicate API Error Details (fallback):', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    throw new Error(`Face swap process failed for easel/advanced-face-swap: ${error.message}`);
  }
} 