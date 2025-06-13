"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, Image, Video, Loader2, CheckCircle, AlertCircle, X, Eye, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AnimatedLoading } from '@/components/ui/animated-loading';
import { useRouter } from 'next/navigation';

export function GlobalJobIndicator() {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dismissedJobs, setDismissedJobs] = useState<Set<string>>(new Set());
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const router = useRouter();
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cacheRef = useRef<{ jobs: any[], timestamp: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Optimized API call - single request for all statuses
  const fetchActiveJobs = useCallback(async (forceRefresh = false): Promise<any[]> => {
    const now = Date.now();
    const CACHE_DURATION = 10000; // 10 seconds cache
    
    // Use cache if recent and not forced refresh
    if (!forceRefresh && cacheRef.current && (now - cacheRef.current.timestamp < CACHE_DURATION)) {
      return cacheRef.current.jobs;
    }

    try {
      const response = await fetch('/api/jobs?limit=20', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      const jobs = data.jobs || [];
      
      // Filter for active jobs only
      const activeJobs = jobs.filter((job: any) => 
        job.status === 'pending' || job.status === 'processing'
      );

      // Update cache
      cacheRef.current = {
        jobs: activeJobs,
        timestamp: now
      };

      return activeJobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return cacheRef.current?.jobs || [];
    }
  }, []);

  // Check for active jobs with smart polling
  const checkActiveJobs = useCallback(async (forceRefresh = false) => {
    if (!mounted) return;
    
    try {
      setIsLoading(true);
      const jobs = await fetchActiveJobs(forceRefresh);
      
      // Filter out dismissed jobs
      const visibleJobs = jobs.filter(job => !dismissedJobs.has(job.id));
      setActiveJobs(visibleJobs);
      setLastFetch(Date.now());
      
      // Auto-remove completed jobs from dismissed list after 5 minutes
      const completedJobIds = jobs
        .filter(job => job.status === 'completed')
        .map(job => job.id);
      
      if (completedJobIds.length > 0) {
        setTimeout(() => {
          setDismissedJobs(prev => {
            const newSet = new Set(prev);
            completedJobIds.forEach(id => newSet.delete(id));
            return newSet;
          });
        }, 5 * 60 * 1000); // 5 minutes
      }
      
    } catch (error) {
      console.error('Error checking active jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [mounted, dismissedJobs, fetchActiveJobs]);

  // Smart polling with adaptive intervals
  useEffect(() => {
    if (!mounted) return;

    // Initial fetch
    checkActiveJobs(true);

    const setupPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Adaptive polling interval based on active jobs
      const getPollingInterval = () => {
        if (activeJobs.length === 0) return 30000; // 30s when no active jobs
        if (activeJobs.some(job => job.status === 'processing')) return 10000; // 10s when processing
        return 20000; // 20s when only pending
      };

      intervalRef.current = setInterval(() => {
        checkActiveJobs();
      }, getPollingInterval());
    };

    setupPolling();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [mounted, activeJobs.length, checkActiveJobs]);

  const getJobIcon = (jobType: string, inputParams?: any) => {
    if (jobType === 'audio_generation' || inputParams?.is_audio_generation) {
      return <Volume2 className="w-4 h-4" />;
    } else if (jobType === 'video_generation' && inputParams?.is_lip_sync) {
      return <Video className="w-4 h-4" />;
    } else if (jobType === 'video_generation') {
      return <Video className="w-4 h-4" />;
    } else if (jobType === 'image_generation') {
      return <Image className="w-4 h-4" />;
    }
    return <Loader2 className="w-4 h-4" />;
  };

  const getJobDisplayName = (jobType: string, inputParams?: any) => {
    if (jobType === 'audio_generation' || inputParams?.is_audio_generation) {
      return 'Audio Generation';
    } else if (jobType === 'video_generation' && inputParams?.is_lip_sync) {
      return 'Lip Sync';
    } else if (jobType === 'video_generation') {
      return 'Video Generation';
    } else if (jobType === 'image_generation') {
      return 'Image Generation';
    }
    return 'Generation';
  };

  const getJobRoute = (jobType: string, inputParams?: any) => {
    if (jobType === 'audio_generation' || inputParams?.is_audio_generation) {
      return '/tools/audio-generation';
    } else if (jobType === 'video_generation' && inputParams?.is_lip_sync) {
      return '/tools/lip-sync';
    } else if (jobType === 'video_generation') {
      return '/tools/video-generation';
    } else if (jobType === 'image_generation') {
      return '/tools/image-generation';
    }
    return '/tools';
  };

  const dismissJob = (jobId: string) => {
    setDismissedJobs(prev => new Set([...prev, jobId]));
  };

  const navigateToJob = (job: any) => {
    const route = getJobRoute(job.job_type, job.input_parameters);
    router.push(route);
  };

  const navigateToGallery = () => {
    router.push('/gallery');
  };

  const handleRefresh = () => {
    checkActiveJobs(true); // Force refresh
  };

  if (!mounted || activeJobs.length === 0) {
    return null;
  }

  const timeSinceLastFetch = Math.floor((Date.now() - lastFetch) / 1000);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Compact Indicator */}
      {!expanded && (
        <div 
          className="bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-sm border border-white/20 rounded-full p-3 shadow-lg cursor-pointer hover:from-purple-700/90 hover:to-pink-700/90 transition-all duration-200"
          onClick={() => setExpanded(true)}
        >
          <div className="flex items-center space-x-2">
            <div className="relative">
              <AnimatedLoading 
                icon="sparkles"
                className="scale-75"
                showProgress={false}
                texts={[]}
                duration={2000}
              />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {activeJobs.length}
              </div>
            </div>
            <span className="text-white font-medium text-sm">
              {activeJobs.length} job{activeJobs.length !== 1 ? 's' : ''} in progress
            </span>
          </div>
        </div>
      )}

      {/* Expanded View */}
      {expanded && (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl p-4 w-80 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AnimatedLoading 
                icon="sparkles"
                className="scale-75"
                showProgress={false}
                texts={[]}
                duration={2000}
              />
              <h3 className="text-white font-semibold">Active Generations</h3>
            </div>
            <div className="flex items-center space-x-2">
              {timeSinceLastFetch < 60 && (
                <span className="text-xs text-gray-400">
                  {timeSinceLastFetch}s ago
                </span>
              )}
              <Button
                onClick={() => setExpanded(false)}
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-2">
            {activeJobs.map((job, index) => (
              <div 
                key={job.id}
                className="bg-black/40 border border-white/10 rounded-lg p-3 hover:bg-black/60 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getJobIcon(job.job_type, job.input_parameters)}
                      <span className="text-sm font-medium text-white">
                        {getJobDisplayName(job.job_type, job.input_parameters)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        job.status === 'pending' ? 'bg-yellow-600/30 text-yellow-300' :
                        job.status === 'processing' ? 'bg-blue-600/30 text-blue-300' :
                        job.status === 'completed' ? 'bg-green-600/30 text-green-300' :
                        'bg-red-600/30 text-red-300'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-2 line-clamp-2" title={job.prompt}>
                      "{job.prompt}"
                    </p>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(job.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      onClick={() => navigateToJob(job)}
                      size="sm"
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300 p-1"
                      title="Go to generation page"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => dismissJob(job.id)}
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-gray-300 p-1"
                      title="Dismiss notification"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Progress indicator for active jobs */}
                {(job.status === 'pending' || job.status === 'processing') && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full animate-pulse"
                        style={{ 
                          width: job.status === 'pending' ? '30%' : '70%',
                          transition: 'width 0.5s ease-in-out'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="mt-4 pt-3 border-t border-white/10 flex space-x-2">
            <Button
              onClick={navigateToGallery}
              size="sm"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Eye className="w-4 h-4 mr-1" />
              Gallery
            </Button>
            <Button
              onClick={handleRefresh}
              size="sm"
              variant="outline"
              disabled={isLoading}
              className="text-gray-300 border-gray-600 hover:bg-gray-600/20"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 