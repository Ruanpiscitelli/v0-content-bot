import Replicate from "replicate";
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { createServerClient } from '@/lib/supabase-server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const GENERAL_ERROR_MESSAGE = 'An unexpected error occurred. Please try again later.';

// Interface for the Kling v1.6 model
interface KlingModelInput {
  prompt: string;
  aspect_ratio?: '1:1' | '16:9' | '9:16';
  duration: number;
  start_image?: string;
  reference_images?: string[];
  cfg_scale?: number;
}

interface ReplicatePredictionOutput {
  [key: string]: any;
}

// Function to map aspect ratio to the format expected by Kling
function mapAspectRatio(aspectRatio: string): '1:1' | '16:9' | '9:16' {
  const validRatios = ['1:1', '16:9', '9:16'] as const;
  return validRatios.includes(aspectRatio as any) ? aspectRatio as any : '16:9';
}

// Function to convert base64 to URL
async function base64ToUrl(base64String: string): Promise<string> {
  try {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique filename
    const filename = `${uuidv4()}.jpg`;
    const storagePath = `temp/${filename}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generated_videos')
      .upload(storagePath, buffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('generated_videos')
      .getPublicUrl(storagePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error converting base64 to URL:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "REPLICATE_API_TOKEN not configured." },
      { status: 500 }
    );
  }

  try {
    // Get user authentication
    const userSupabase = await createServerClient();
    const { data: { user }, error: authError } = await userSupabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const reqBody = await request.json();
    const { prompt, aspectRatio, duration, startImage, referenceImages } = reqBody;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    // Prepare model input
    const input: KlingModelInput = {
      prompt: prompt,
      duration: duration || 5,
      cfg_scale: 0.5, // Default value as per model specs
    };

    // Process start image if provided
    if (startImage) {
      try {
        input.start_image = await base64ToUrl(startImage);
      } catch (error) {
        console.error('Error processing start image:', error);
        return NextResponse.json(
          { error: "Failed to process start image." },
          { status: 400 }
        );
      }
    } else {
      // Only set aspect ratio if no start image is provided
      input.aspect_ratio = mapAspectRatio(aspectRatio || "16:9");
    }

    // Process reference images if provided
    if (referenceImages && Array.isArray(referenceImages) && referenceImages.length > 0) {
      try {
        const processedUrls = await Promise.all(
          referenceImages.slice(0, 4).map(img => base64ToUrl(img))
        );
        input.reference_images = processedUrls;
      } catch (error) {
        console.error('Error processing reference images:', error);
        return NextResponse.json(
          { error: "Failed to process reference images." },
          { status: 400 }
        );
      }
    }

    const modelIdentifier = "kwaivgi/kling-v1.6-standard";

    console.log(`Running Replicate model ${modelIdentifier} with input:`, JSON.stringify(input, null, 2));

    // Implement retry logic to handle temporary server errors
    let output;
    let attempts = 0;
    const maxAttempts = 3;
    let completedPrediction: any = null;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`Attempt ${attempts}/${maxAttempts} for Replicate API call`);
        
        // Use the prediction API for better control
        const prediction = await replicate.predictions.create({
          model: modelIdentifier,
          input: input,
        });

        console.log("Created prediction:", prediction.id);
        
        // Wait for completion with polling
        completedPrediction = prediction;
        let pollAttempts = 0;
        const maxPollAttempts = 60; // 10 minutes max (10 seconds * 60)
        
        while (completedPrediction.status !== 'succeeded' && completedPrediction.status !== 'failed' && pollAttempts < maxPollAttempts) {
          await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
          completedPrediction = await replicate.predictions.get(prediction.id);
          pollAttempts++;
          console.log(`Poll attempt ${pollAttempts}: Status = ${completedPrediction.status}`);
        }
        
        if (completedPrediction.status === 'succeeded') {
          output = completedPrediction.output;
          console.log("Prediction completed successfully:", output);
          break;
        } else if (completedPrediction.status === 'failed') {
          throw new Error(`Prediction failed: ${completedPrediction.error || 'Unknown error'}`);
        } else {
          throw new Error(`Prediction timed out after ${maxPollAttempts} attempts`);
        }
        
      } catch (retryError: any) {
        console.error(`Attempt ${attempts} failed:`, retryError.message);
        
        if (attempts === maxAttempts) {
          // Last attempt failed, rethrow the error
          throw retryError;
        }
        
        // Wait before the next attempt
        await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
      }
    }

    let videoUrls: string[] = [];

    console.log("Final output type:", typeof output);
    console.log("Final output:", output);
    
    // Kling model returns a video URL
    if (typeof output === 'string' && output.startsWith('http')) {
      videoUrls = [output];
    } else if (Array.isArray(output)) {
      videoUrls = output.filter(url => typeof url === 'string' && url.startsWith('http'));
    }

    if (videoUrls.length === 0) {
      console.log("No valid video URLs found in completed prediction. Output:", JSON.stringify(output, null, 2));
      return NextResponse.json(
        { error: "Failed to generate video. No valid URLs received from the completed prediction." },
        { status: 500 }
      );
    }

    console.log("Successfully extracted video URLs:", videoUrls);

    // Process all generated videos
    const processedVideoUrls: string[] = [];
    
    for (let i = 0; i < videoUrls.length; i++) {
      try {
        // 1. Download the video from Replicate URL
        const videoResponse = await fetch(videoUrls[i]);
        if (!videoResponse.ok) {
          console.error(`Failed to download video ${i + 1} from Replicate: ${videoResponse.statusText}`);
          continue;
        }
        
        const videoBlob = await videoResponse.blob();
        const videoContentType = videoResponse.headers.get('content-type') || 'video/mp4';
        const fileExtension = 'mp4'; // Always use mp4 for videos

        // 2. Upload the video to Supabase Storage
        const fileName = `${uuidv4()}.${fileExtension}`;
        const storagePath = `public/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('generated_videos')
          .upload(storagePath, videoBlob, {
            contentType: videoContentType,
            upsert: false,
          });

        if (uploadError) {
          console.error(`Supabase Storage upload error for video ${i + 1}:`, uploadError);
          continue;
        }

        if (!uploadData || !uploadData.path) {
          console.error(`Supabase Storage upload failed to return a valid path for video ${i + 1}.`);
          continue;
        }
        
        console.log(`Supabase upload data for video ${i + 1}:`, uploadData);

        // 3. Get the public URL for the uploaded video
        const { data: publicUrlData } = supabase.storage
          .from('generated_videos')
          .getPublicUrl(uploadData.path);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          console.error(`Could not get public URL for Supabase video ${i + 1}.`);
          continue;
        }

        const videoUrlInSupabase = publicUrlData.publicUrl;
        console.log(`Video ${i + 1} successfully uploaded to Supabase Storage:`, videoUrlInSupabase);

        // 4. Save metadata to Supabase table
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Videos expire in 7 days

        const { error: metadataError } = await supabase
          .from('generated_videos_metadata')
          .insert({
            user_id: user.id,
            prompt: prompt,
            replicate_prediction_id: `${completedPrediction.id}_${i}`,
            storage_path: uploadData.path,
            video_url: videoUrlInSupabase,
            duration: duration || 5,
            aspect_ratio: input.aspect_ratio || aspectRatio || '16:9',
            expires_at: expiresAt.toISOString(),
          });

        if (metadataError) {
          console.error(`Supabase metadata insert error for video ${i + 1}:`, metadataError);
          console.warn(`Video ${i + 1} uploaded, but metadata saving failed. Manual cleanup might be needed for:`, uploadData.path);
        } else {
          console.log(`Video ${i + 1} metadata saved to Supabase.`);
        }

        processedVideoUrls.push(videoUrlInSupabase);
        console.log(`Successfully processed video ${i + 1}:`, videoUrlInSupabase);
        
      } catch (processError) {
        console.error(`Error processing video ${i + 1}:`, processError);
        continue;
      }
    }

    if (processedVideoUrls.length === 0) {
      return NextResponse.json(
        { error: "Failed to process and store the generated videos." },
        { status: 500 }
      );
    }

    // Cleanup: Delete temporary images after successful video generation
    if (input.start_image || input.reference_images) {
      try {
        const filesToDelete = [];
        if (input.start_image) {
          filesToDelete.push(input.start_image.split('/').pop()!);
        }
        if (input.reference_images) {
          filesToDelete.push(...input.reference_images.map(url => url.split('/').pop()!));
        }

        await Promise.all(
          filesToDelete.map(filename =>
            supabase.storage
              .from('generated_videos')
              .remove([`temp/${filename}`])
          )
        );
      } catch (cleanupError) {
        console.error('Error cleaning up temporary files:', cleanupError);
        // Don't fail the request if cleanup fails
      }
    }

    return NextResponse.json({ videoUrls: processedVideoUrls });

  } catch (error: any) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: error.message || GENERAL_ERROR_MESSAGE },
      { status: 500 }
    );
  }
} 