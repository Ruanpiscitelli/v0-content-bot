-- Create temp-uploads bucket for temporary file storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'temp-uploads',
  'temp-uploads',
  true,
  104857600, -- 100MB limit
  ARRAY['video/mp4', 'video/mov', 'video/quicktime', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/mpeg']
);

-- Create temp_uploads table to track temporary uploads
CREATE TABLE IF NOT EXISTS temp_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  public_url TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_temp_uploads_expires_at ON temp_uploads(expires_at);
CREATE INDEX IF NOT EXISTS idx_temp_uploads_user_id ON temp_uploads(user_id);

-- Enable RLS
ALTER TABLE temp_uploads ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own temp uploads
CREATE POLICY "Users can manage their own temp uploads" ON temp_uploads
  FOR ALL USING (auth.uid() = user_id);

-- Create storage policy for temp-uploads bucket
CREATE POLICY "Users can upload to temp-uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'temp-uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view temp-uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'temp-uploads');

CREATE POLICY "Users can delete their temp-uploads" ON storage.objects
  FOR DELETE USING (bucket_id = 'temp-uploads' AND auth.uid()::text = (storage.foldername(name))[1]); 