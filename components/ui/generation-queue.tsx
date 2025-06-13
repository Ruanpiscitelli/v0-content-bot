"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Clock, CheckCircle, XCircle, Loader2, Image, Video } from 'lucide-react';
import { GenerationJob } from '@/types/supabase';

interface GenerationQueueProps {
  onJobComplete?: (job: GenerationJob) => void;
}

export function GenerationQueue({ onJobComplete }: GenerationQueueProps) {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Fetch initial jobs
    fetchJobs();

    // Set up real-time subscription for job updates
    const channel = supabase
      .channel('generation_jobs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'generation_jobs',
        },
        (payload) => {
          console.log('🔄 Job update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newJob = payload.new as GenerationJob;
            setJobs(prev => [newJob, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedJob = payload.new as GenerationJob;
            setJobs(prev => 
              prev.map(job => 
                job.id === updatedJob.id ? updatedJob : job
              )
            );
            
            // Call onJobComplete if job is completed
            if (updatedJob.status === 'completed' && onJobComplete) {
              onJobComplete(updatedJob);
            }
          } else if (payload.eventType === 'DELETE') {
            setJobs(prev => prev.filter(job => job.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('generation_jobs')
        .select('*')
        .in('status', ['pending', 'processing'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getJobTypeIcon = (jobType: string) => {
    switch (jobType) {
      case 'image_generation':
        return <Image className="w-4 h-4" />;
      case 'video_generation':
        return <Video className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const activeJobs = jobs.filter(job => job.status === 'pending' || job.status === 'processing');

  if (!isVisible || activeJobs.length === 0) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-hidden bg-white/95 backdrop-blur-md shadow-lg border-cyan-200/50 z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
            Generation Queue ({activeJobs.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>
        <p className="text-xs text-gray-600">
          You can safely leave this page. You'll get notified when ready!
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3 max-h-60 overflow-y-auto">
        {activeJobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/80 border border-gray-200/50"
          >
            {/* Job Type Icon */}
            <div className="flex-shrink-0">
              {getJobTypeIcon(job.job_type)}
            </div>
            
            {/* Job Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-0.5 ${getStatusColor(job.status)}`}
                >
                  {getStatusIcon(job.status)}
                  <span className="ml-1 capitalize">
                    {job.status === 'processing' ? 'Generating...' : 'In Queue'}
                  </span>
                </Badge>
              </div>
              
              <p className="text-sm text-gray-900 font-medium truncate">
                {job.job_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              
              <p className="text-xs text-gray-600 truncate" title={job.prompt}>
                {job.prompt}
              </p>
              
              {job.created_at && (
                <p className="text-xs text-gray-500 mt-1">
                  Created {new Date(job.created_at).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {activeJobs.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No active generations
          </div>
        )}
      </CardContent>
      
      <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/gallery'}
          className="w-full text-xs text-black border-cyan-400/50 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-black"
        >
          View Gallery
        </Button>
      </div>
    </Card>
  );
}

export default GenerationQueue; 