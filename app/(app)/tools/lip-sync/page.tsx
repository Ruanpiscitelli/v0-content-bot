"use client";

import React, { useState, useEffect, useRef } from 'react';
import { VideoIcon, MicIcon, FileAudioIcon, TypeIcon, Sparkles, AlertTriangle, Loader2, CheckCircle, Download, Upload, Play, Pause, Volume2, Clock, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { GenerationQueue } from '@/components/ui/generation-queue';
import { AnimatedLoading } from '@/components/ui/animated-loading';
import { useGenerationQueue } from '@/hooks/useGenerationQueue';

// Voice options for different languages
const voiceOptions = {
  english: [
    { value: "en_AOT", label: "AOT (Default)" },
    { value: "en_oversea_male1", label: "Overseas Male 1" },
    { value: "en_girlfriend_4_speech02", label: "Girlfriend 4" },
    { value: "en_chat_0407_5-1", label: "Chat Voice" },
    { value: "en_uk_boy1", label: "UK Boy" },
    { value: "en_PeppaPig_platform", label: "Peppa Pig Style" },
    { value: "en_calm_story1", label: "Calm Storyteller" },
    { value: "en_uk_man2", label: "UK Man" },
    { value: "en_reader_en_m-v1", label: "Male Reader" },
    { value: "en_commercial_lady_en_f-v1", label: "Commercial Lady" }
  ],
  chinese: [
    { value: "zh_genshin_vindi2", label: "Genshin Venti" },
    { value: "zh_zhinen_xuesheng", label: "Smart Student" },
    { value: "zh_ai_shatang", label: "Sugar Voice" },
    { value: "zh_genshin_klee2", label: "Genshin Klee" },
    { value: "zh_ai_kaiya", label: "Kaiya Voice" },
    { value: "zh_girlfriend_1_speech02", label: "Girlfriend 1" },
    { value: "zh_chat1_female_new-3", label: "Female Chat" },
    { value: "zh_cartoon-boy-07", label: "Cartoon Boy" },
    { value: "zh_cartoon-girl-01", label: "Cartoon Girl" },
    { value: "zh_chengshu_jiejie", label: "Mature Sister" }
  ]
};

const loadingTexts = {
  steps: [
    "Analyzing your video content...",
    "Processing audio for lip sync...",
    "Mapping facial movements...",
    "Synchronizing lips with audio...",
    "Generating natural mouth movements...",
    "Finalizing your lip-synced video!"
  ],
  title: "AI Lip Sync Generator",
  subtitle: "Sync any video with audio or text using advanced AI technology",
  videoLabel: "Source Video",
  videoDescription: "Upload a video (MP4/MOV, 2-10 seconds, 720p-1080p, max 100MB). Videos longer than 10.9s will be automatically trimmed.",
  audioLabel: "Audio File",
  audioDescription: "Upload audio file (MP3/WAV/M4A/AAC, max 5MB)",
  textLabel: "Text to Speech",
  textDescription: "Enter text to generate speech and sync with your video",
  voiceLabel: "Voice Selection",
  speedLabel: "Voice Speed",
  generateButton: "🎬 Generate Lip Sync",
  generatingButton: "✨ Creating Sync...",
  success: "Lip sync generated successfully!",
  error: "Failed to generate lip sync. Please try again.",
  processing: "Your lip sync is being processed...",
  activeJobWarning: "Please wait for your current lip sync to complete before starting a new one."
};

export default function LipSyncPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('en_AOT');
  const [voiceSpeed, setVoiceSpeed] = useState([1]);
  const [mode, setMode] = useState<'audio' | 'text'>('audio');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobQueued, setJobQueued] = useState(false);
  const [queueJobId, setQueueJobId] = useState<string | null>(null);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [checkingActiveJobs, setCheckingActiveJobs] = useState(true);
  const [isTrimmingVideo, setIsTrimmingVideo] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);

  // Use the generation queue hook
  const {
    isCreatingJob,
    createJob,
    getJobs
  } = useGenerationQueue({
    onJobComplete: (job) => {
      toast.success("Your lip sync is complete! Check your gallery.", {
        action: {
          label: "View Gallery",
          onClick: () => window.location.href = "/gallery"
        }
      });
      checkActiveJobs();
    }
  });

  // Check for active jobs
  const checkActiveJobs = async () => {
    try {
      setCheckingActiveJobs(true);
      const jobsResult = await getJobs({ status: 'pending', includeProcessing: true });
      // Filter for lip sync jobs using the metadata since they're stored as 'video_generation'
      const lipSyncJobs = jobsResult.jobs.filter(job => 
        job.job_type === 'video_generation' && 
        typeof job.input_parameters === 'object' &&
        job.input_parameters !== null &&
        !Array.isArray(job.input_parameters) &&
        (job.input_parameters as any)?.is_lip_sync === true
      );
      setActiveJobs(lipSyncJobs);
    } catch (error) {
      console.error('Error checking active jobs:', error);
    } finally {
      setCheckingActiveJobs(false);
    }
  };

  useEffect(() => {
    checkActiveJobs();
    const interval = setInterval(checkActiveJobs, 30000);
    return () => clearInterval(interval);
  }, []);

  const hasActiveJobs = activeJobs.length > 0;

  const handleVideoUpload = (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error("Please upload a valid video file (MP4/MOV)");
      return;
    }

    // Validate file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video file must be less than 100MB");
      return;
    }

    // Create video element to check duration
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    
    video.onloadedmetadata = async () => {
      const duration = video.duration;
      console.log(`📹 Video duration detected: ${duration.toFixed(2)}s`);
      
      // Validate minimum duration (2 seconds for lip sync model)
      if (duration < 2.0) {
        toast.error("Video must be at least 2 seconds long for lip sync");
        URL.revokeObjectURL(url);
        return;
      }
      
      // If video is longer than 10.9 seconds, automatically trim it
      if (duration > 10.9) {
        console.log(`🔄 Video needs trimming: ${duration.toFixed(2)}s > 10.9s`);
        setIsTrimmingVideo(true);
        toast.info(`Video is ${duration.toFixed(1)}s long. Automatically trimming to 10.9s...`, {
          description: "Using Web APIs for precise trimming"
        });
        
        try {
          // Trim the video to 10.9 seconds using Web APIs
          const trimmedFile = await trimVideoToMaxDuration(file, 10.9);
          
          if (trimmedFile) {
            console.log(`✂️ Video trimmed, new file size: ${(trimmedFile.size / 1024 / 1024).toFixed(2)}MB`);
            
            // Validate the trimmed video duration
            const trimmedVideo = document.createElement('video');
            trimmedVideo.onloadedmetadata = () => {
              const trimmedDuration = trimmedVideo.duration;
              console.log(`✅ Trimmed video duration: ${trimmedDuration.toFixed(2)}s`);
              
              if (trimmedDuration >= 2.0 && trimmedDuration <= 10.9) {
                setVideoFile(trimmedFile);
                setVideoUrl(URL.createObjectURL(trimmedFile));
                
                toast.success(`Video trimmed successfully to ${trimmedDuration.toFixed(1)}s`, {
                  description: `Original: ${duration.toFixed(1)}s → Trimmed: ${trimmedDuration.toFixed(1)}s`
                });
              } else {
                console.error(`❌ Trimmed video duration invalid: ${trimmedDuration.toFixed(2)}s`);
                toast.error(`Trimmed video duration (${trimmedDuration.toFixed(1)}s) is still invalid`, {
                  description: "Please try with a different video file"
                });
              }
              URL.revokeObjectURL(trimmedVideo.src);
            };
            
            trimmedVideo.onerror = () => {
              console.error('❌ Failed to validate trimmed video');
              toast.error("Failed to validate trimmed video", {
                description: "Please try with a different video file"
              });
            };
            
            trimmedVideo.src = URL.createObjectURL(trimmedFile);
          } else {
            console.error('❌ Trimming returned null');
            toast.error("Failed to trim video", {
              description: "Please try with a different video file or trim manually"
            });
          }
        } catch (error) {
          console.error('❌ Trimming error:', error);
          toast.error("Video trimming failed", {
            description: "Web APIs encountered an error. Please try a different video."
          });
        } finally {
          setIsTrimmingVideo(false);
        }
        
        return;
      }
      
      // Video is valid (between 2-10.9 seconds)
      console.log(`✅ Video duration is valid: ${duration.toFixed(2)}s`);
      setVideoFile(file);
      setVideoUrl(url);
      
      toast.success(`Video uploaded successfully (${duration.toFixed(1)}s)`, {
        description: "Duration is within the required 2-10 second range"
      });
    };
    
    video.onerror = () => {
      console.error('❌ Failed to load video file');
      toast.error("Failed to load video file. Please try a different file.");
      URL.revokeObjectURL(url);
    };
    
    video.src = url;
  };

  // Function to trim video to maximum duration using Web APIs (more reliable than FFmpeg.wasm)
  const trimVideoToMaxDuration = async (file: File, maxDuration: number): Promise<File | null> => {
    try {
      console.log(`🎬 Starting video trimming to ${maxDuration}s`);
      
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          console.error('❌ Canvas context not available');
          reject(new Error('Canvas context not available'));
          return;
        }

        video.onloadedmetadata = () => {
          console.log(`📐 Video dimensions: ${video.videoWidth}x${video.videoHeight}`);
          console.log(`⏱️ Original duration: ${video.duration.toFixed(2)}s`);
          
          // Set canvas size to match video (ensure even dimensions for encoding)
          canvas.width = Math.floor(video.videoWidth / 2) * 2;
          canvas.height = Math.floor(video.videoHeight / 2) * 2;
          
          console.log(`🖼️ Canvas size: ${canvas.width}x${canvas.height}`);

          // Create audio context to handle audio
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = audioContext.createMediaElementSource(video);
          const destination = audioContext.createMediaStreamDestination();
          source.connect(destination);

          // Combine video and audio streams
          const videoStream = canvas.captureStream(30);
          const audioStream = destination.stream;
          
          // Create combined stream
          const combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
          ]);

          const chunks: Blob[] = [];
          
          // Use the most compatible format
          let mimeType = 'video/webm;codecs=vp8,opus';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm;codecs=vp8';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
              mimeType = 'video/webm';
            }
          }
          
          console.log(`🎥 Using MIME type: ${mimeType}`);

          const mediaRecorder = new MediaRecorder(combinedStream, { 
            mimeType,
            videoBitsPerSecond: 2000000, // 2 Mbps
            audioBitsPerSecond: 128000   // 128 kbps
          });

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
              console.log(`📦 Chunk received: ${event.data.size} bytes`);
            }
          };

          mediaRecorder.onstop = () => {
            console.log(`🏁 Recording stopped, total chunks: ${chunks.length}`);
            
            // Clean up audio context
            audioContext.close();
            
            const trimmedBlob = new Blob(chunks, { type: 'video/mp4' });
            const trimmedFile = new File([trimmedBlob], `trimmed_${file.name}`, { 
              type: 'video/mp4',
              lastModified: Date.now()
            });
            
            console.log(`✅ Trimmed file created: ${(trimmedFile.size / 1024 / 1024).toFixed(2)}MB`);
            resolve(trimmedFile);
          };

          mediaRecorder.onerror = (event) => {
            console.error('❌ MediaRecorder error:', event);
            audioContext.close();
            reject(new Error('Recording failed'));
          };

          // Start recording
          console.log('🔴 Starting recording...');
          mediaRecorder.start(100); // Collect data every 100ms

          // Draw video frames to canvas for the specified duration
          let startTime = 0;
          let recordingStarted = false;
          let frameCount = 0;
          
          const drawFrame = () => {
            if (!recordingStarted) return;
            
            const currentTime = video.currentTime;
            const elapsed = currentTime - startTime;
            
            if (elapsed >= maxDuration) {
              console.log(`⏹️ Stopping recording at ${elapsed.toFixed(2)}s (${frameCount} frames)`);
              mediaRecorder.stop();
              video.pause();
              return;
            }

            // Draw the current frame
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            frameCount++;
            
            if (frameCount % 30 === 0) {
              console.log(`🎞️ Frame ${frameCount}, time: ${elapsed.toFixed(2)}s`);
            }
            
            if (mediaRecorder.state === 'recording') {
              requestAnimationFrame(drawFrame);
            }
          };

          video.ontimeupdate = () => {
            if (!recordingStarted && video.currentTime > 0) {
              startTime = video.currentTime;
              recordingStarted = true;
              console.log(`▶️ Recording started at ${startTime.toFixed(2)}s`);
              drawFrame();
            }
          };

          // Start playing the video
          video.currentTime = 0;
          video.muted = false; // Ensure audio is not muted
          video.play().catch(error => {
            console.error('❌ Video play error:', error);
            audioContext.close();
            reject(error);
          });
        };

        video.onerror = (error) => {
          console.error('❌ Video loading error:', error);
          reject(new Error('Failed to load video for trimming'));
        };

        // Set video properties for better compatibility
        video.crossOrigin = 'anonymous';
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error('❌ Error trimming video:', error);
      return null;
    }
  };

  const handleAudioUpload = (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/mpeg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid audio file (MP3/WAV/M4A/AAC)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Audio file must be less than 5MB");
      return;
    }

    setAudioFile(file);
  };

  const uploadFileToTemp = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (hasActiveJobs) {
      toast.error(loadingTexts.activeJobWarning, {
        description: "Only one lip sync can be processed at a time.",
        duration: 5000
      });
      return;
    }

    if (!videoFile) {
      toast.error("Please upload a video file");
      return;
    }

    if (mode === 'audio' && !audioFile) {
      toast.error("Please upload an audio file or switch to text mode");
      return;
    }

    if (mode === 'text' && !text.trim()) {
      toast.error("Please enter text for speech synthesis");
      return;
    }

    setIsLoading(true);
    setError(null);
    setJobQueued(false);
    setQueueJobId(null);

    try {
      // Upload files to temporary storage
      const videoUrl = await uploadFileToTemp(videoFile);
      let audioUrl = null;

      if (mode === 'audio' && audioFile) {
        audioUrl = await uploadFileToTemp(audioFile);
      }

      // Prepare input parameters
      const inputParameters: any = {
        video_url: videoUrl,
        mode
      };

      if (mode === 'audio') {
        inputParameters.audio_file = audioUrl;
      } else {
        inputParameters.text = text;
        inputParameters.voice_id = selectedVoice;
        inputParameters.voice_speed = voiceSpeed[0];
      }

      // Create job
      const result = await createJob({
        jobType: 'lip_sync',
        prompt: mode === 'audio' ? 'Audio lip sync' : text,
        inputParameters
      });

      if (result.success) {
        setJobQueued(true);
        setQueueJobId(result.job?.id || null);
        checkActiveJobs();
        toast.success("Lip sync added to queue!", { 
          description: "You'll be notified when it's ready!",
          duration: 5000,
          action: {
            label: "View Gallery",
            onClick: () => window.location.href = "/gallery"
          }
        });
      } else {
        throw new Error(result.error || "Failed to create lip sync job");
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || loadingTexts.error;
      setError(errorMessage);
      toast.error(errorMessage, { duration: 8000 });
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setVideoFile(null);
    setVideoUrl("");
    setAudioFile(null);
    setText('');
    setJobQueued(false);
    setQueueJobId(null);
    setError(null);
    checkActiveJobs();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-2 sm:p-4 md:p-6 lg:p-8 text-white flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-3 sm:p-6 md:p-8">
        <header className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 mb-3 sm:mb-4">
            <MicIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-1 px-2">
            {loadingTexts.title}
          </h1>
          <p className="text-sm sm:text-md text-gray-400 max-w-xl mx-auto px-4">
            {loadingTexts.subtitle}
          </p>
        </header>

        {/* Video Trimming Indicator */}
        {isTrimmingVideo && (
          <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AnimatedLoading 
                  icon="video"
                  className="scale-75"
                  showProgress={true}
                  texts={[
                    "Loading Web APIs...",
                    "Analyzing video duration...",
                    "Trimming video to 10.9 seconds...",
                    "Processing with Web APIs...",
                    "Finalizing trimmed video..."
                  ]}
                  duration={3000}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-cyan-300 mb-1">
                  🎬 Auto-Trimming Video
                </h3>
                <p className="text-slate-300 text-sm mb-2">
                  Your video is longer than 10.9 seconds. We're automatically trimming it using Web APIs for optimal lip sync processing.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>This may take a few moments depending on video size...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Job Warning */}
        {hasActiveJobs && !jobQueued && (
          <div className="mb-6 p-4 bg-amber-900/30 border border-amber-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AnimatedLoading 
                  icon="video"
                  className="scale-75"
                  showProgress={true}
                  texts={[
                    "Syncing lips with audio...",
                    "Analyzing facial movements...",
                    "Creating natural expressions...",
                    "Almost ready!"
                  ]}
                  duration={2500}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-amber-300 font-semibold mb-1">Lip Sync in Progress</h3>
                <p className="text-amber-400 text-sm mb-3">{loadingTexts.activeJobWarning}</p>
                <div className="space-y-2">
                  {activeJobs.map((job, index) => (
                    <div key={job.id} className="bg-black/20 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-amber-300">Sync #{index + 1}</span>
                        <span className="text-xs text-amber-400 capitalize">{job.status}</span>
                      </div>
                      <p className="text-xs text-gray-300 truncate" title={job.prompt}>
                        "{job.prompt}"
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button 
                    onClick={() => window.location.href = '/gallery'}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Check Gallery
                  </Button>
                  <Button 
                    onClick={checkActiveJobs}
                    size="sm"
                    variant="outline"
                    disabled={checkingActiveJobs}
                    className="text-amber-300 border-amber-600 hover:bg-amber-600/20"
                  >
                    {checkingActiveJobs ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {(isLoading || isCreatingJob) && (
          <div className="mb-6">
            <AnimatedLoading 
              texts={loadingTexts.steps}
              icon="sparkles"
              showProgress={true}
              className="py-8"
            />
          </div>
        )}

        {!jobQueued ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Upload */}
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">
                {loadingTexts.videoLabel} <span className="text-pink-400">*</span>
              </Label>
              <p className="text-xs text-gray-400 mb-3">{loadingTexts.videoDescription}</p>
              
              <div className="border-2 border-dashed border-white/20 rounded-lg p-6 hover:border-cyan-400/50 transition-colors">
                {videoFile ? (
                  <div className="space-y-4">
                    <video 
                      ref={videoPreviewRef}
                      src={videoUrl}
                      controls
                      className="w-full h-48 object-cover rounded-lg bg-black"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{videoFile.name}</span>
                      <Button
                        type="button"
                        onClick={() => {setVideoFile(null); setVideoUrl("");}}
                        variant="outline"
                        size="sm"
                        disabled={hasActiveJobs}
                        className="text-red-400 border-red-600 hover:bg-red-600/20"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <VideoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <Input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4,video/mov"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVideoUpload(file);
                      }}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={isLoading || isCreatingJob || hasActiveJobs || isTrimmingVideo}
                      className="text-cyan-300 border-cyan-400/50 hover:bg-cyan-500/20"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Video
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Audio/Text Mode Selection */}
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'audio' | 'text')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="audio" className="flex items-center gap-2">
                  <FileAudioIcon className="w-4 h-4" />
                  Audio File
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <TypeIcon className="w-4 h-4" />
                  Text to Speech
                </TabsTrigger>
              </TabsList>

              <TabsContent value="audio" className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-slate-200 mb-2">
                    {loadingTexts.audioLabel} <span className="text-pink-400">*</span>
                  </Label>
                  <p className="text-xs text-gray-400 mb-3">{loadingTexts.audioDescription}</p>
                  
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 hover:border-cyan-400/50 transition-colors">
                    {audioFile ? (
                      <div className="space-y-4">
                        <audio 
                          ref={audioPreviewRef}
                          src={URL.createObjectURL(audioFile)}
                          controls
                          className="w-full"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">{audioFile.name}</span>
                          <Button
                            type="button"
                            onClick={() => setAudioFile(null)}
                            variant="outline"
                            size="sm"
                            disabled={hasActiveJobs}
                            className="text-red-400 border-red-600 hover:bg-red-600/20"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileAudioIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <Input
                          ref={audioInputRef}
                          type="file"
                          accept="audio/mp3,audio/wav,audio/m4a,audio/aac"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAudioUpload(file);
                          }}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => audioInputRef.current?.click()}
                          disabled={isLoading || isCreatingJob || hasActiveJobs || isTrimmingVideo}
                          className="text-cyan-300 border-cyan-400/50 hover:bg-cyan-500/20"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Audio
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <div>
                  <Label htmlFor="text" className="block text-sm font-medium text-slate-200 mb-2">
                    {loadingTexts.textLabel} <span className="text-pink-400">*</span>
                  </Label>
                  <p className="text-xs text-gray-400 mb-3">{loadingTexts.textDescription}</p>
                  <Textarea
                    id="text"
                    rows={4}
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 placeholder-gray-500 text-slate-100"
                    placeholder="Enter the text you want the person to say..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isLoading || isCreatingJob || hasActiveJobs || isTrimmingVideo}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium text-slate-200 mb-2">
                      {loadingTexts.voiceLabel}
                    </Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger className="w-full bg-white/10 border-white/20 text-slate-100">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <div className="p-2 text-xs text-gray-400 font-semibold">English Voices</div>
                        {voiceOptions.english.map((voice) => (
                          <SelectItem key={voice.value} value={voice.value} className="text-white hover:bg-gray-700">
                            {voice.label}
                          </SelectItem>
                        ))}
                        <div className="p-2 text-xs text-gray-400 font-semibold border-t border-gray-700 mt-2">Chinese Voices</div>
                        {voiceOptions.chinese.map((voice) => (
                          <SelectItem key={voice.value} value={voice.value} className="text-white hover:bg-gray-700">
                            {voice.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-slate-200 mb-2">
                      {loadingTexts.speedLabel}: {voiceSpeed[0]}x
                    </Label>
                    <Slider
                      value={voiceSpeed}
                      onValueChange={setVoiceSpeed}
                      min={0.8}
                      max={2}
                      step={0.1}
                      className="w-full"
                      disabled={isLoading || isCreatingJob || hasActiveJobs || isTrimmingVideo}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Generate Button */}
            <Button 
              type="submit" 
              disabled={isLoading || isCreatingJob || !videoFile || hasActiveJobs || isTrimmingVideo || (mode === 'audio' && !audioFile) || (mode === 'text' && !text.trim())}
              className="w-full font-semibold py-3 px-6 text-lg rounded-lg bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-600 hover:via-purple-700 hover:to-pink-700 text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-h-[56px]"
            >
              {(isLoading || isCreatingJob) ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 
                  {loadingTexts.generatingButton}
                </>
              ) : isTrimmingVideo ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 
                  Trimming Video...
                </>
              ) : hasActiveJobs ? (
                <>
                  <AlertCircle className="w-5 h-5 mr-2" /> 
                  Sync In Progress
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" /> 
                  {loadingTexts.generateButton}
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            {/* Success message */}
            <div className="p-6 bg-green-900/30 border border-green-700 rounded-lg">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-300 mb-2">Lip Sync Queued Successfully!</h3>
              <p className="text-green-400 mb-4">Your video is being processed for lip sync. You'll be notified when it's ready!</p>
              
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Added to queue</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Mode: {mode === 'audio' ? 'Audio Sync' : 'Text to Speech'}
                </p>
                {mode === 'text' && (
                  <p className="text-gray-500 text-xs mt-1 truncate" title={text}>
                    "{text}"
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => window.location.href = '/gallery'}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Gallery
                </Button>
                <Button 
                  onClick={resetForm}
                  variant="outline"
                  className="text-cyan-300 border-cyan-400/50 hover:bg-cyan-500/20 px-6 py-2"
                >
                  Create Another Sync
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-6 text-center p-6 bg-red-900/30 border border-red-700 rounded-lg">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-red-300 mb-2">{loadingTexts.error}</h3>
            <p className="text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => {setError(null); setJobQueued(false);}}
              variant="outline"
              className="text-red-300 border-red-600 hover:bg-red-600/20"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Generation Queue Component */}
      <GenerationQueue />
    </div>
  );
} 