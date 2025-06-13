-- Add audio_generation to the job_type constraint in generation_jobs table
-- First, check if table exists and drop the existing constraint safely
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'generation_jobs') THEN
        ALTER TABLE generation_jobs DROP CONSTRAINT IF EXISTS generation_jobs_job_type_check;
        
        -- Add the new constraint that includes audio_generation
        ALTER TABLE generation_jobs ADD CONSTRAINT generation_jobs_job_type_check 
        CHECK (job_type IN ('image_generation', 'video_generation', 'lip_sync', 'audio_generation'));
    END IF;
END $$;

-- Create audio metadata table for storing audio generation results (if not exists)
CREATE TABLE IF NOT EXISTS generated_audios_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL,
  audio_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours',
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES generation_jobs(id) ON DELETE CASCADE
);

-- Create index for performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_generated_audios_user_created 
ON generated_audios_metadata(user_id, created_at DESC);

-- Set up Row Level Security (RLS) - only if table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'generated_audios_metadata') THEN
        ALTER TABLE generated_audios_metadata ENABLE ROW LEVEL SECURITY;
        
        -- Policy for users to see only their own audio files
        DROP POLICY IF EXISTS "Users can view own audio files" ON generated_audios_metadata;
        CREATE POLICY "Users can view own audio files" ON generated_audios_metadata
        FOR SELECT USING (auth.uid() = user_id);

        -- Policy for users to insert their own audio files
        DROP POLICY IF EXISTS "Users can insert own audio files" ON generated_audios_metadata;
        CREATE POLICY "Users can insert own audio files" ON generated_audios_metadata
        FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Policy for users to delete their own audio files
        DROP POLICY IF EXISTS "Users can delete own audio files" ON generated_audios_metadata;
        CREATE POLICY "Users can delete own audio files" ON generated_audios_metadata
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$; 