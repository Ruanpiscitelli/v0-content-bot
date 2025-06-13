import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Square, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  className?: string;
}

export function AudioRecorder({ onRecordingComplete, className = "" }: AudioRecorderProps) {
  const [mounted, setMounted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Set mounted on client side only
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      streamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Microphone access denied:', error);
      setHasPermission(false);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please allow microphone access to record audio.",
      });
      return null;
    }
  };

  const startTimer = () => {
    if (!mounted) return;
    startTimeRef.current = Date.now() - pausedTimeRef.current;
    intervalRef.current = setInterval(() => {
      setRecordingTime(Date.now() - startTimeRef.current);
    }, 100);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startRecording = async () => {
    const stream = streamRef.current || await requestMicrophonePermission();
    if (!stream) return;

    try {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(blob);
        
        // Convert blob to File
        const timestamp = mounted ? Date.now() : 'recording';
        const file = new File([blob], `recording-${timestamp}.wav`, { type: 'audio/wav' });
        onRecordingComplete(file);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      pausedTimeRef.current = 0;
      startTimer();

      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        variant: "destructive",
        title: "Recording failed",
        description: "Could not start recording. Please try again.",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
      pausedTimeRef.current = recordingTime;
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      toast({
        title: "Recording completed",
        description: `Duration: ${formatTime(recordingTime)}`,
      });
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    pausedTimeRef.current = 0;
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.src = '';
    }
  };

  const playRecording = () => {
    if (recordedBlob && audioRef.current) {
      const url = URL.createObjectURL(recordedBlob);
      audioRef.current.src = url;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!mounted) {
    return (
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 w-8 bg-gray-300 rounded mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${className}`}>
        <MicOff className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">Microphone access denied</p>
        <Button 
          onClick={requestMicrophonePermission}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          Request Permission
        </Button>
      </div>
    );
  }

  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4 ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Mic className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium">Audio Recorder</span>
        </div>
        
        {recordingTime > 0 && (
          <div className="text-lg font-mono text-red-600 mb-2">
            {formatTime(recordingTime)}
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-2">
        {!isRecording && !recordedBlob && (
          <Button
            onClick={startRecording}
            className="bg-red-600 hover:bg-red-700"
            size="sm"
          >
            <Mic className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        )}

        {isRecording && !isPaused && (
          <>
            <Button
              onClick={pauseRecording}
              variant="outline"
              size="sm"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button
              onClick={stopRecording}
              variant="destructive"
              size="sm"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </>
        )}

        {isRecording && isPaused && (
          <>
            <Button
              onClick={resumeRecording}
              className="bg-red-600 hover:bg-red-700"
              size="sm"
            >
              <Mic className="h-4 w-4 mr-2" />
              Resume
            </Button>
            <Button
              onClick={stopRecording}
              variant="destructive"
              size="sm"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </>
        )}

        {recordedBlob && (
          <>
            {!isPlaying ? (
              <Button
                onClick={playRecording}
                variant="outline"
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Play
              </Button>
            ) : (
              <Button
                onClick={pausePlayback}
                variant="outline"
                size="sm"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            <Button
              onClick={resetRecording}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </>
        )}
      </div>

      {recordedBlob && (
        <div className="text-center text-sm text-green-600">
          ✅ Recording ready ({formatTime(recordingTime)})
        </div>
      )}

      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
} 