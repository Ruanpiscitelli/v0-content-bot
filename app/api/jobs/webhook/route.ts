import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: Request) {
  try {
    const { jobId, status, resultData, errorMessage } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Update job status in database
    const { data: job, error: updateError } = await supabase
      .from('generation_jobs')
      .update({
        status,
        result_data: resultData,
        error_message: errorMessage,
        completed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null,
      })
      .eq('id', jobId)
      .select('*, user_id')
      .single();

    if (updateError) {
      console.error('Error updating job:', updateError);
      return NextResponse.json(
        { error: 'Failed to update job' },
        { status: 500 }
      );
    }

    // Create notification for user
    if (status === 'completed' || status === 'failed') {
      const notificationTitle = status === 'completed' 
        ? `Your ${job.job_type.replace('_', ' ')} is ready!`
        : `Your ${job.job_type.replace('_', ' ')} failed`;
        
      const notificationMessage = status === 'completed'
        ? 'Your AI generation has completed successfully. Check your gallery to view the result!'
        : `Unfortunately, your generation failed: ${errorMessage || 'Unknown error'}`;

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: job.user_id,
          title: notificationTitle,
          message: notificationMessage,
          type: status === 'completed' ? 'success' : 'error',
          action_type: status === 'completed' ? 'view_gallery' : null,
          action_data: status === 'completed' ? { jobId: job.id } : null,
          read: false,
          created_at: new Date().toISOString(),
        });

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the webhook for notification errors
      }

      // If completed, also save to appropriate media table
      if (status === 'completed' && resultData?.output?.length > 0) {
        await saveToMediaTable(job, resultData);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Job status updated successfully' 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function saveToMediaTable(job: any, resultData: any) {
  try {
    if (job.job_type === 'image_generation' && resultData.output?.length > 0) {
      // Save to images metadata table
      for (const imageUrl of resultData.output) {
        const { error } = await supabase
          .from('generated_images_metadata')
          .insert({
            user_id: job.user_id,
            prompt: job.prompt,
            replicate_prediction_id: job.replicate_prediction_id,
            image_url: imageUrl,
            aspect_ratio: job.input_parameters?.aspectRatio || '1:1',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          });

        if (error) {
          console.error('Error saving image metadata:', error);
        }
      }
    } else if (job.job_type === 'video_generation' && resultData.output?.length > 0) {
      // Save to videos metadata table
      for (const videoUrl of resultData.output) {
        const { error } = await supabase
          .from('generated_videos_metadata')
          .insert({
            user_id: job.user_id,
            prompt: job.prompt,
            replicate_prediction_id: job.replicate_prediction_id,
            video_url: videoUrl,
            duration: job.input_parameters?.duration || 5,
            aspect_ratio: job.input_parameters?.aspectRatio || '16:9',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          });

        if (error) {
          console.error('Error saving video metadata:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error saving media to database:', error);
  }
} 