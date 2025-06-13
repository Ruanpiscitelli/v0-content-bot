import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Initialize Supabase clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Input validation schemas using Zod (Next.js best practice)
const CreateJobSchema = z.object({
  jobType: z.enum(['image_generation', 'video_generation', 'lip_sync', 'audio_generation']),
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt too long'),
  inputParameters: z.record(z.any()).optional().default({})
});

const GetJobsSchema = z.object({
  jobId: z.string().uuid().optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  limit: z.coerce.number().min(1).max(100).default(10),
});

type CreateJobRequest = z.infer<typeof CreateJobSchema>;
type GetJobsQuery = z.infer<typeof GetJobsSchema>;

// Helper function to create authenticated Supabase client
async function createAuthenticatedClient() {
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

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  return { supabase, user };
}

// Helper function to check active jobs
async function checkActiveJobs(userId: string, jobType: string): Promise<{ activeJobs: any[], totalActive: number }> {
  let query = supabaseAdmin
    .from('generation_jobs')
    .select('id, status, job_type, input_parameters')
    .eq('user_id', userId)
    .in('status', ['pending', 'processing']);

  const { data: jobs, error } = await query;
  
  if (error) {
    console.error(`Error checking active ${jobType} jobs:`, error);
    throw new Error('Failed to check active jobs');
  }

  const allActiveJobs = jobs || [];
  const totalActiveJobs = allActiveJobs.length;

  // Filter based on job type for specific type checking
  let specificTypeJobs: typeof allActiveJobs = [];
  switch (jobType) {
    case 'video_generation':
      specificTypeJobs = allActiveJobs.filter(job => 
        job.job_type === 'video_generation' && !job.input_parameters?.is_lip_sync
      );
      break;
    
    case 'lip_sync':
      specificTypeJobs = allActiveJobs.filter(job => 
        job.job_type === 'video_generation' && job.input_parameters?.is_lip_sync === true
      );
      break;
    
    case 'audio_generation':
      specificTypeJobs = allActiveJobs.filter(job => 
        job.job_type === 'audio_generation'
      );
      break;
    
    case 'image_generation':
      specificTypeJobs = allActiveJobs.filter(job => 
        job.job_type === 'image_generation'
      );
      break;
    
    default:
      specificTypeJobs = [];
  }

  return {
    activeJobs: specificTypeJobs,
    totalActive: totalActiveJobs
  };
}

export async function POST(request: Request) {
  try {
    // Validate request body using Zod schema
    let body: CreateJobRequest;
    try {
      const rawBody = await request.json();
      body = CreateJobSchema.parse(rawBody);
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Validation failed', 
            details: parseError.errors.map(e => `${e.path.join('.')}: ${e.message}`)
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const { user } = await createAuthenticatedClient();

    const { jobType, prompt, inputParameters } = body;

    // Check for active jobs of the same type
    const { activeJobs, totalActive } = await checkActiveJobs(user.id, jobType);
    
    // Check global job limit (max 5 active jobs per user)
    const MAX_ACTIVE_JOBS = 5;
    if (totalActive >= MAX_ACTIVE_JOBS) {
      return NextResponse.json(
        { 
          error: `You have reached the maximum limit of ${MAX_ACTIVE_JOBS} active generations. Please wait for some to complete before creating new ones.`,
          hasActiveJob: true,
          totalActiveJobs: totalActive,
          maxAllowed: MAX_ACTIVE_JOBS
        },
        { status: 429 } // Too Many Requests
      );
    }
    
    if (activeJobs.length > 0) {
      const displayJobType = jobType === 'lip_sync' ? 'lip sync' : 
                             jobType === 'audio_generation' ? 'audio generation' :
                             jobType.replaceAll('_', ' ');
      
      return NextResponse.json(
        { 
          error: `You already have a ${displayJobType} being generated. Please wait for it to complete before creating a new one.`,
          hasActiveJob: true,
          activeJobs: activeJobs,
          totalActiveJobs: totalActive
        },
        { status: 429 } // Too Many Requests
      );
    }

    // Prepare job data
    let actualJobType = jobType;
    let actualInputParameters = inputParameters;
    
    // Special handling for lip_sync (stored as video_generation with flag)
    if (jobType === 'lip_sync') {
      actualJobType = 'video_generation';
      actualInputParameters = {
        ...inputParameters,
        is_lip_sync: true,
        original_job_type: 'lip_sync'
      };
    }

    // Create job in database
    const { data: job, error: insertError } = await supabaseAdmin
      .from('generation_jobs')
      .insert({
        user_id: user.id,
        job_type: actualJobType,
        prompt,
        input_parameters: actualInputParameters,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating job:', insertError);
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      );
    }

    // Create notification for user
    const displayJobType = jobType === 'lip_sync' ? 'lip sync' : 
                           jobType === 'audio_generation' ? 'audio generation' :
                           jobType.replaceAll('_', ' ');
    
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'generation_started',
        message: `Your ${displayJobType} is now in queue and will be processed shortly.`,
        metadata: {
          job_id: job.id,
          job_type: jobType,
          prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : '')
        }
      });

    // Trigger background processing (fire and forget)
    const urlObj = new URL(request.url);
    const baseUrl = urlObj.origin;
    fetch(`${baseUrl}/api/jobs/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: job.id })
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        job_type: jobType,
        created_at: job.created_at
      }
    }, { status: 201 }); // 201 Created for successful resource creation

  } catch (error: any) {
    console.error('Error in jobs POST:', error);
    
    // Return appropriate error response
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (error.message === 'Failed to check active jobs') {
      return NextResponse.json(
        { error: 'Failed to check active jobs' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = {
      jobId: url.searchParams.get('jobId') || undefined,
      status: url.searchParams.get('status') || undefined,
      limit: url.searchParams.get('limit') || '10',
    };

    let parsedQuery: GetJobsQuery;
    try {
      parsedQuery = GetJobsSchema.parse(queryParams);
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Invalid query parameters', 
            details: parseError.errors.map(e => `${e.path.join('.')}: ${e.message}`)
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const { user } = await createAuthenticatedClient();

    const { jobId, status, limit } = parsedQuery;

    // Build query
    let query = supabaseAdmin
      .from('generation_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (jobId) {
      query = query.eq('id', jobId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: jobs, error } = await query;

    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }

    // Get active jobs count for queue status
    const { data: activeJobs, error: activeError } = await supabaseAdmin
      .from('generation_jobs')
      .select('id, status, job_type')
      .eq('user_id', user.id)
      .in('status', ['pending', 'processing']);

    const totalActiveJobs = activeJobs?.length || 0;
    const MAX_ACTIVE_JOBS = 5;

    return NextResponse.json({ 
      jobs,
      count: jobs?.length || 0,
      limit,
      queueStatus: {
        activeJobs: totalActiveJobs,
        maxAllowed: MAX_ACTIVE_JOBS,
        available: Math.max(0, MAX_ACTIVE_JOBS - totalActiveJobs)
      }
    });

  } catch (error: any) {
    console.error('Error in jobs GET:', error);
    
    // Return appropriate error response
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 