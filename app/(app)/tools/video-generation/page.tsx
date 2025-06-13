"use client";

import React, { useState, useEffect, useRef } from 'react';
import { VideoIcon, Sparkles, AlertTriangle, Loader2, CheckCircle, Download, ImageIcon, Clock, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { GenerationQueue } from '@/components/ui/generation-queue';
import { AnimatedLoading } from '@/components/ui/animated-loading';
import { useGenerationQueue } from '@/hooks/useGenerationQueue';

// Updated texts for the new queue system
const loadingTexts = {
  steps: [
    "Preparing your video canvas...",
    "Consulting the AI oracles...",
    "Optimizing your creative prompt...",
    "Generating frames with pure creativity...",
    "Adding motion and magic...",
    "Wow! Almost there, your video is coming!"
  ],
  generatingButton: "✨ Creating Magic...",
  generateButton: "🎥 Generate Video",
  promptPlaceholder: "Describe the video you want to create...",
  aspectRatioLabel: "Aspect Ratio",
  aspectRatios: {
    "16:9": "Landscape (16:9)", 
    "9:16": "Portrait (9:16)",
    "1:1": "Square (1:1)",
  },
  durationLabel: "Duration (seconds)",
  startImageLabel: "Initial Frame",
  startImageDescription: "Upload an image to be used as the first frame of your video - this will determine the style and composition of the entire video.",
  referenceImagesLabel: "Style Reference Images",
  referenceImagesDescription: "Add up to 4 images that will influence the visual style, colors, and composition of your generated video.",
  generating: "Generating your masterpiece...",
  success: "Video generated successfully!",
  error: "Failed to generate video. Please try again.",
  title: "AI Video Generator",
  subtitle: "Transform your ideas into stunning videos with artificial intelligence",
  viewVideo: "View",
  downloadVideo: "Download",
  queueSuccess: "Your video has been added to the generation queue!",
  queueMessage: "Your video is being generated in the background. You can safely navigate away and we'll notify you when it's ready!",
  viewGallery: "View Gallery",
  stayHere: "Stay Here",
  newGeneration: "Generate Another Video",
  videoInProgress: "Video Generation in Progress",
  waitForCompletion: "Please wait for your current video to complete before generating a new one.",
  refreshing: "Checking for active jobs..."
};

export default function VideoGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState(5); // 5 or 10 seconds
  const [startImage, setStartImage] = useState<string | null>(null);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVideos, setShowVideos] = useState(false);
  const [jobQueued, setJobQueued] = useState(false);
  const [queueJobId, setQueueJobId] = useState<string | null>(null);
  const [activeVideoJobs, setActiveVideoJobs] = useState<any[]>([]);
  const [checkingActiveJobs, setCheckingActiveJobs] = useState(true);

  const resultsRef = useRef<HTMLDivElement>(null);
  const startImageInputRef = useRef<HTMLInputElement>(null);
  const referenceImagesInputRef = useRef<HTMLInputElement>(null);

  // Use the generation queue hook
  const {
    isCreatingJob,
    createVideoGenerationJob,
    getJobs
  } = useGenerationQueue({
    onJobComplete: (job) => {
      // Handle job completion - could show notification or refresh gallery
      toast.success("Your video generation is complete! Check your gallery.", {
        action: {
          label: "View Gallery",
          onClick: () => window.location.href = "/gallery"
        }
      });
      // Refresh active jobs
      checkActiveVideoJobs();
    }
  });

  // Check for active video generation jobs
  const checkActiveVideoJobs = async () => {
    try {
      setCheckingActiveJobs(true);
      const jobsResult = await getJobs({ status: 'pending', includeProcessing: true });
      const videoJobs = jobsResult.jobs.filter(job => job.job_type === 'video_generation');
      setActiveVideoJobs(videoJobs);
    } catch (error) {
      console.error('Error checking active jobs:', error);
    } finally {
      setCheckingActiveJobs(false);
    }
  };

  // Check for active jobs on component mount and periodically
  useEffect(() => {
    checkActiveVideoJobs();
    
    // Check every 30 seconds for job updates
    const interval = setInterval(checkActiveVideoJobs, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Check if user has active video generation
  const hasActiveVideoGeneration = activeVideoJobs.length > 0;

  useEffect(() => {
    if (generatedVideos.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        setShowVideos(true);
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowVideos(false);
    }
  }, [generatedVideos, isLoading]);

  const handleImageUpload = async (file: File, isStartImage: boolean = true) => {
    if (!file) return;

    try {
      // Convert the file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isStartImage) {
          setStartImage(base64String);
        } else {
          setReferenceImages(prev => {
            if (prev.length >= 4) {
              toast.error("Maximum of 4 reference images allowed");
              return prev;
            }
            return [...prev, base64String];
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleDownload = async (videoUrl: string, index: number) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `virallyzer-video-${index + 1}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Video downloaded successfully!", { id: `download-toast-${index}` });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Failed to download video. Please try again.", { id: `download-toast-${index}` });
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Check if there's already an active video generation
    if (hasActiveVideoGeneration) {
      toast.error("You already have a video being generated. Please wait for it to complete.", {
        description: "Only one video can be generated at a time to ensure optimal quality.",
        duration: 5000,
        action: {
          label: "Check Gallery",
          onClick: () => window.location.href = "/gallery"
        }
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedVideos([]);
    setShowVideos(false);
    setJobQueued(false);
    setQueueJobId(null);

    try {
      // Prepare input parameters com tipagem flexível
      const inputParameters: Record<string, any> = {
        aspectRatio,
        duration,
      };

      // Add start image if provided
      if (startImage) {
        inputParameters.startImage = startImage; // base64 string
      }

      // Add reference images if provided
      if (referenceImages.length > 0) {
        inputParameters.referenceImages = referenceImages; // array of base64 strings
      }

      // Use the new queue system
      const result = await createVideoGenerationJob(prompt, inputParameters);

      if (result.success) {
        setJobQueued(true);
        setQueueJobId(result.job?.id || null);
        // Refresh active jobs to include the new one
        checkActiveVideoJobs();
        toast.success(loadingTexts.queueSuccess, { 
          description: "You'll be notified when it's ready!",
          duration: 5000,
          action: {
            label: "View Gallery",
            onClick: () => window.location.href = "/gallery"
          }
        });
      } else {
        throw new Error(result.error || "Failed to create generation job");
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || loadingTexts.error;
      setError(errorMessage);
      toast.error(errorMessage, { id: 'video-gen-toast', duration: 8000 });
    }
    setIsLoading(false);
  };

  const removeReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setPrompt('');
    setJobQueued(false);
    setQueueJobId(null);
    setError(null);
    setGeneratedVideos([]);
    setShowVideos(false);
    setStartImage(null);
    setReferenceImages([]);
    checkActiveVideoJobs(); // Refresh active jobs when resetting
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-2 sm:p-4 md:p-6 lg:p-8 text-white flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-3 sm:p-6 md:p-8">
        <header className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 mb-3 sm:mb-4">
            <VideoIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-1 px-2">
            {loadingTexts.title}
          </h1>
          <p className="text-sm sm:text-md text-gray-400 max-w-xl mx-auto px-4">
            {loadingTexts.subtitle}
          </p>
        </header>

        {/* Active Job Warning */}
        {hasActiveVideoGeneration && !jobQueued && (
          <div className="mb-6 p-4 bg-amber-900/30 border border-amber-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AnimatedLoading 
                  icon="video"
                  className="scale-75"
                  showProgress={true}
                  texts={[
                    "Your video is being crafted...",
                    "AI is painting each frame...",
                    "Adding motion and style...",
                    "Almost ready for you!"
                  ]}
                  duration={2500}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-amber-300 font-semibold mb-1">{loadingTexts.videoInProgress}</h3>
                <p className="text-amber-400 text-sm mb-3">{loadingTexts.waitForCompletion}</p>
                <div className="space-y-2">
                  {activeVideoJobs.map((job, index) => (
                    <div key={job.id} className="bg-black/20 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-amber-300">Video #{index + 1}</span>
                        <span className="text-xs text-amber-400 capitalize">{job.status}</span>
                      </div>
                      <p className="text-xs text-gray-300 truncate" title={job.prompt}>
                        "{job.prompt}"
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        {job.input_parameters?.aspectRatio} • {job.input_parameters?.duration}s
                      </div>
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
                    onClick={checkActiveVideoJobs}
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

        {/* Loading State for Job Creation */}
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
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="prompt" className="block text-sm font-medium text-slate-200 mb-1.5">
                {loadingTexts.promptPlaceholder} <span className="text-pink-400">*</span>
              </Label>
              <textarea
                id="prompt"
                name="prompt"
                rows={3}
                className="w-full p-3 text-sm sm:text-base rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 placeholder-gray-500 text-slate-100 transition-all duration-300 shadow-sm focus:shadow-cyan-500/30 disabled:opacity-50 resize-none touch-manipulation"
                placeholder={loadingTexts.promptPlaceholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                disabled={isLoading || isCreatingJob || hasActiveVideoGeneration}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="aspect-ratio" className="block text-sm font-medium text-slate-200 mb-1.5">
                  {loadingTexts.aspectRatioLabel}
                </Label>
                <select
                  id="aspect-ratio"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  disabled={isLoading || isCreatingJob || hasActiveVideoGeneration}
                  className="w-full p-3 text-sm sm:text-base rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-slate-100 transition-all duration-300 shadow-sm focus:shadow-cyan-500/30 disabled:opacity-50 touch-manipulation"
                >
                  {Object.entries(loadingTexts.aspectRatios).map(([value, label]) => (
                    <option key={value} value={value} className="bg-gray-800 text-white">{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="duration" className="block text-sm font-medium text-slate-200 mb-1.5">
                  {loadingTexts.durationLabel}
                </Label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  disabled={isLoading || isCreatingJob || hasActiveVideoGeneration}
                  className="w-full p-3 text-sm sm:text-base rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-slate-100 transition-all duration-300 shadow-sm focus:shadow-cyan-500/30 disabled:opacity-50 touch-manipulation"
                >
                  <option value={5} className="bg-gray-800 text-white">5 seconds</option>
                  <option value={10} className="bg-gray-800 text-white">10 seconds</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button 
                  type="submit" 
                  disabled={isLoading || isCreatingJob || !prompt.trim() || hasActiveVideoGeneration}
                  className="w-full font-semibold py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-600 hover:via-purple-700 hover:to-pink-700 text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px] touch-manipulation"
                >
                  {(isLoading || isCreatingJob) ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" /> 
                      <span className="hidden sm:inline">Adding to Queue...</span>
                      <span className="sm:hidden">Queueing...</span>
                    </>
                  ) : hasActiveVideoGeneration ? (
                    <>
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> 
                      <span className="hidden sm:inline">Video In Progress</span>
                      <span className="sm:hidden">In Progress</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> 
                      <span className="hidden sm:inline">{loadingTexts.generateButton}</span>
                      <span className="sm:hidden">Generate</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Start Image Section */}
            <div className="space-y-3">
              <div>
                <Label className="block text-sm font-medium text-slate-200 mb-1">
                  {loadingTexts.startImageLabel} <span className="text-gray-400">(Optional)</span>
                </Label>
                <p className="text-xs text-gray-400 mb-3">
                  {loadingTexts.startImageDescription}
                </p>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
                  {startImage ? (
                    <div className="relative">
                      <img 
                        src={startImage} 
                        alt="Start frame" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        onClick={() => setStartImage(null)}
                        disabled={hasActiveVideoGeneration}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 p-0 rounded-full"
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Input
                        ref={startImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, true);
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => startImageInputRef.current?.click()}
                        disabled={isLoading || isCreatingJob || hasActiveVideoGeneration}
                        className="text-black border-cyan-400/50 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-black"
                      >
                        Upload Initial Frame
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Reference Images Section */}
              <div>
                <Label className="block text-sm font-medium text-slate-200 mb-1">
                  {loadingTexts.referenceImagesLabel} <span className="text-gray-400">(Optional)</span>
                </Label>
                <p className="text-xs text-gray-400 mb-3">
                  {loadingTexts.referenceImagesDescription}
                </p>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-4 hover:border-cyan-400/50 transition-colors">
                  {referenceImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      {referenceImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Reference ${index + 1}`} 
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            onClick={() => removeReferenceImage(index)}
                            disabled={hasActiveVideoGeneration}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white w-5 h-5 p-0 rounded-full text-xs"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  
                  {referenceImages.length < 4 && (
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Input
                        ref={referenceImagesInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, false);
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => referenceImagesInputRef.current?.click()}
                        disabled={isLoading || isCreatingJob || hasActiveVideoGeneration}
                        className="text-black border-cyan-400/50 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-black"
                      >
                        Add Reference Image ({referenceImages.length}/4)
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div ref={resultsRef} className="text-center space-y-6">
            {/* Success message */}
            <div className="p-6 bg-green-900/30 border border-green-700 rounded-lg">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-300 mb-2">{loadingTexts.queueSuccess}</h3>
              <p className="text-green-400 mb-4">{loadingTexts.queueMessage}</p>
              
              {/* Job details */}
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Added to queue</span>
                </div>
                <p className="text-gray-400 text-sm truncate" title={prompt}>
                  "{prompt}"
                </p>
                <div className="text-gray-500 text-xs mt-1 space-x-4">
                  <span>Aspect Ratio: {loadingTexts.aspectRatios[aspectRatio as keyof typeof loadingTexts.aspectRatios]}</span>
                  <span>Duration: {duration}s</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => window.location.href = '/gallery'}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {loadingTexts.viewGallery}
                </Button>
                <Button 
                  onClick={resetForm}
                  variant="outline"
                  className="text-black border-cyan-400/50 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-black px-6 py-2"
                >
                  {loadingTexts.newGeneration}
                </Button>
              </div>
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div ref={resultsRef} className="mt-6 text-center p-4 sm:p-6 bg-red-900/30 border border-red-700 rounded-lg mx-2 sm:mx-0">
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg sm:text-xl font-semibold text-red-300 mb-2">{loadingTexts.error}</h3>
            <p className="text-sm sm:text-base text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => {setError(null); setPrompt(''); setJobQueued(false);}}
              variant="outline"
              className="text-black border-white/50 hover:bg-white/10 hover:text-white touch-manipulation min-h-[44px]"
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