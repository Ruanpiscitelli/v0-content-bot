import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Get user authentication
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Determine file type and appropriate bucket
    const validVideoTypes = ['video/mp4', 'video/mov', 'video/quicktime'];
    const validAudioTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/mpeg', 'audio/ogg', 'audio/flv'];
    
    let bucket: string;
    let maxSize: number;
    let isAudio = false;
    let isVideo = false;

    // Check file type by MIME type and file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const audioExtensions = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flv'];
    const videoExtensions = ['mp4', 'mov'];

    if (validAudioTypes.includes(file.type) || audioExtensions.includes(fileExtension)) {
      bucket = 'generated-audios';
      maxSize = 50 * 1024 * 1024; // 50MB for audio
      isAudio = true;
    } else if (validVideoTypes.includes(file.type) || videoExtensions.includes(fileExtension)) {
      bucket = 'generated-videos';
      maxSize = 100 * 1024 * 1024; // 100MB for video
      isVideo = true;
    } else {
      return NextResponse.json(
        { error: 'Invalid file type. Supported: MP4, MOV for videos; MP3, WAV, M4A, AAC, OGG, FLV for audio' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `File too large. Max size: ${maxSizeMB}MB for ${isAudio ? 'audio' : 'video'} files` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileName = `${uuidv4()}.${fileExtension}`;
    const storagePath = `temp/${fileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Use correct content type
    let contentType = file.type;
    
    // Fallback content types for common extensions if MIME type is missing
    if (!contentType || contentType === 'application/octet-stream') {
      const mimeMap: { [key: string]: string } = {
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'm4a': 'audio/m4a',
        'aac': 'audio/aac',
        'ogg': 'audio/ogg',
        'flv': 'audio/flv',
        'mp4': 'video/mp4',
        'mov': 'video/quicktime'
      };
      contentType = mimeMap[fileExtension] || 'application/octet-stream';
    }

    console.log(`📁 Uploading ${file.type || 'unknown'} file (${fileExtension}) as ${contentType} to bucket: ${bucket}`);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType: contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: `Failed to upload file to storage: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData.publicUrl;

    // Insert record into temp_uploads table for tracking
    const { data: tempUploadData, error: tempUploadError } = await supabase
      .from('temp_uploads')
      .insert({
        user_id: user.id,
        file_path: uploadData.path,
        file_type: contentType,
        file_size: file.size,
        upload_url: publicUrl,
        metadata: {
          original_name: file.name,
          bucket: bucket,
          is_audio: isAudio,
          is_video: isVideo
        }
      })
      .select()
      .single();

    if (tempUploadError) {
      console.error('Failed to insert temp_upload record:', tempUploadError);
      // Continue execution - don't fail the upload for this
    }

    console.log(`✅ Successfully uploaded to ${bucket}: ${publicUrl}`);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      bucket: bucket,
      contentType: contentType,
      uploadId: tempUploadData?.id || null,
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 