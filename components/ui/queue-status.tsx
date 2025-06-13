'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface QueueStatus {
  activeJobs: number;
  maxAllowed: number;
  available: number;
}

interface QueueStatusProps {
  className?: string;
  showProgress?: boolean;
}

export function QueueStatus({ className = '', showProgress = true }: QueueStatusProps) {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQueueStatus = async () => {
    try {
      const response = await fetch('/api/jobs?limit=1');
      if (response.ok) {
        const data = await response.json();
        setQueueStatus(data.queueStatus);
      }
    } catch (error) {
      console.error('Error fetching queue status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueStatus();
    
    // Poll every 5 seconds to keep status updated
    const interval = setInterval(fetchQueueStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading || !queueStatus) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading queue status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { activeJobs, maxAllowed, available } = queueStatus;
  const usagePercentage = (activeJobs / maxAllowed) * 100;

  const getStatusColor = () => {
    if (activeJobs === 0) return 'text-green-600';
    if (activeJobs >= maxAllowed) return 'text-red-600';
    if (activeJobs >= maxAllowed * 0.8) return 'text-orange-600';
    return 'text-blue-600';
  };

  const getStatusIcon = () => {
    if (activeJobs === 0) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (activeJobs >= maxAllowed) return <AlertCircle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-blue-600" />;
  };

  const getStatusText = () => {
    if (activeJobs === 0) return 'Queue empty';
    if (activeJobs >= maxAllowed) return 'Queue full';
    return `${activeJobs} active`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Generation Queue</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            <Badge variant={activeJobs >= maxAllowed ? 'destructive' : 'secondary'}>
              {activeJobs}/{maxAllowed}
            </Badge>
          </div>

          {showProgress && (
            <div className="space-y-1">
              <Progress 
                value={usagePercentage} 
                className="h-2"
                color={activeJobs >= maxAllowed ? 'bg-red-500' : 'bg-blue-500'}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{available} slots available</span>
                <span>{Math.round(usagePercentage)}% used</span>
              </div>
            </div>
          )}

          {activeJobs >= maxAllowed && (
            <div className="text-xs text-muted-foreground">
              Wait for generations to complete before adding more to queue
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default QueueStatus; 