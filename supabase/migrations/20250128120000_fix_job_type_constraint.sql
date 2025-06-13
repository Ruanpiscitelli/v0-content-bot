-- Add lip_sync to the job_type constraint in generation_jobs table
-- First, drop the existing constraint
ALTER TABLE generation_jobs DROP CONSTRAINT IF EXISTS generation_jobs_job_type_check;

-- Add the new constraint that includes lip_sync and audio_generation
ALTER TABLE generation_jobs ADD CONSTRAINT generation_jobs_job_type_check 
CHECK (job_type IN ('image_generation', 'video_generation', 'lip_sync', 'audio_generation')); 