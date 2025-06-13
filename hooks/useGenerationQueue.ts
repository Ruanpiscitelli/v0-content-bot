"use client";

import { useState, useCallback } from 'react';
import { GenerationJob } from '@/types/supabase';

interface UseGenerationQueueProps {
  onJobComplete?: (job: GenerationJob) => void;
  onJobFailed?: (job: GenerationJob) => void;
}

interface CreateJobParams {
  jobType: 'image_generation' | 'video_generation' | 'lip_sync' | 'audio_generation' | 'face_swap';
  prompt: string;
  inputParameters?: Record<string, any>;
}

export function useGenerationQueue({ 
  onJobComplete, 
  onJobFailed 
}: UseGenerationQueueProps = {}) {
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [activeJobs, setActiveJobs] = useState<GenerationJob[]>([]);

  const createJob = useCallback(async ({ 
    jobType, 
    prompt, 
    inputParameters 
  }: { 
    jobType: 'image_generation' | 'video_generation' | 'lip_sync' | 'audio_generation' | 'face_swap';
    prompt: string; 
    inputParameters: any; 
  }) => {
    setIsCreatingJob(true);
    
    try {
      // For lip sync, we need to use 'video_generation' due to database constraint
      // and add metadata to distinguish it
      let actualJobType = jobType;
      let actualInputParameters = inputParameters;
      
      if (jobType === 'lip_sync') {
        actualJobType = 'video_generation';
        actualInputParameters = {
          ...inputParameters,
          is_lip_sync: true,
          original_job_type: 'lip_sync'
        };
      }
      
      // Face swap uses image_generation job type since it returns an image
      if (jobType === 'face_swap') {
        actualJobType = 'image_generation';
        actualInputParameters = {
          ...inputParameters,
          is_face_swap: true,
          original_job_type: 'face_swap'
        };
      }
      
      // Audio generation can now use the correct job type directly
      // No special handling needed since the API and database support it
      if (jobType === 'audio_generation') {
        actualInputParameters = {
          ...inputParameters,
          // Keep the original job type for tracking
          original_job_type: 'audio_generation'
        };
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobType: actualJobType,
          prompt,
          inputParameters: actualInputParameters
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create job');
      }

      const data = await response.json();
      
      // Trigger immediate processing
      fetch('/api/jobs/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId: data.job.id }),
      }).catch(console.error); // Fire and forget

      return { success: true, job: data.job };
    } catch (error: any) {
      console.error('Error creating job:', error);
      return { success: false, error: error.message };
    } finally {
      setIsCreatingJob(false);
    }
  }, []);

  const createImageGenerationJob = useCallback((
    prompt: string, 
    options: {
      aspectRatio?: string;
      numOutputs?: number;
      outputFormat?: string;
      outputQuality?: number;
      seed?: number;
      negativePrompt?: string;
    } = {}
  ) => {
    return createJob({
      jobType: 'image_generation',
      prompt,
      inputParameters: {
        aspectRatio: options.aspectRatio || '1:1',
        numOutputs: options.numOutputs || 1,
        outputFormat: options.outputFormat || 'png',
        outputQuality: options.outputQuality || 90,
        seed: options.seed,
        negativePrompt: options.negativePrompt,
        ...options
      }
    });
  }, [createJob]);

  const createVideoGenerationJob = useCallback((
    prompt: string,
    options: {
      aspectRatio?: string;
      duration?: number;
      startImageFile?: File;
      referenceImageFiles?: FileList;
    } = {}
  ) => {
    return createJob({
      jobType: 'video_generation',
      prompt,
      inputParameters: {
        aspectRatio: options.aspectRatio || '16:9',
        duration: options.duration,
        // Note: File handling would need to be done before calling this
        // The actual files should be converted to base64 or uploaded separately
        ...options
      }
    });
  }, [createJob]);

  const getJobs = useCallback(async (options: {
    status?: string;
    limit?: number;
    includeProcessing?: boolean;
  } = {}) => {
    try {
      // Use single optimized call for active jobs
      if (options.includeProcessing && options.status === 'pending') {
        // Single call to get all active jobs (pending + processing)
        const response = await fetch(`/api/jobs?limit=${options.limit || 20}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();
        const allJobs = data.jobs as GenerationJob[];
        
        // Filter for active jobs locally
        const activeJobs = allJobs.filter(job => 
          job.status === 'pending' || job.status === 'processing'
        );
        
        return {
          jobs: activeJobs,
          queueStatus: data.queueStatus
        };
      }

      // Regular single status call
      const params = new URLSearchParams();
      if (options.status) params.append('status', options.status);
      if (options.limit) params.append('limit', options.limit.toString());

      const response = await fetch(`/api/jobs?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      return {
        jobs: data.jobs as GenerationJob[],
        queueStatus: data.queueStatus
      };

    } catch (error) {
      console.error('Error fetching jobs:', error);
      return {
        jobs: [],
        queueStatus: null
      };
    }
  }, []);

  const getJobById = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs?jobId=${jobId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch job');
      }

      const data = await response.json();
      return data.jobs?.[0] as GenerationJob | null;

    } catch (error) {
      console.error('Error fetching job:', error);
      return null;
    }
  }, []);

  return {
    // State
    isCreatingJob,
    activeJobs,

    // Actions
    createJob,
    createImageGenerationJob,
    createVideoGenerationJob,

    // Query
    getJobs,
    getJobById,

    // Events
    onJobComplete,
    onJobFailed,
  };
}

export default useGenerationQueue; 