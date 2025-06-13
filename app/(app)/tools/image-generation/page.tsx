"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon, Sparkles, AlertTriangle, Loader2, CheckCircle, Download, Clock, ArrowRight, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { ImageSkeleton } from '@/components/ui/image-skeleton';
import { GenerationQueue } from '@/components/ui/generation-queue';
import { useGenerationQueue } from '@/hooks/useGenerationQueue';

// Updated texts for the new queue system
const loadingTexts = {
  steps: [
    "Preparing your magic canvas...",
    "Consulting the AI oracles...",
    "Optimizing your creative prompt...",
    "Painting pixels with pure creativity...",
    "Adding final touches to your masterpiece...",
    "Wow! Almost there, your art is coming!"
  ],
  generatingButton: "✨ Creating Magic...",
  generateButton: "🎨 Generate Image",
  promptPlaceholder: "Describe the image you want to create...",
  aspectRatioLabel: "Aspect Ratio",
  aspectRatios: {
    "1:1": "Square (1:1)",
    "16:9": "Landscape (16:9)", 
    "9:16": "Portrait (9:16)",
    "4:3": "Classic (4:3)",
    "3:4": "Portrait Classic (3:4)"
  },
  generating: "Generating your masterpiece...",
  success: "Image generated successfully!",
  error: "Failed to generate image. Please try again.",
  title: "AI Image Generator",
  subtitle: "Transform your ideas into stunning visuals with artificial intelligence",
  viewImage: "View",
  queueSuccess: "Your image has been added to the generation queue!",
  queueMessage: "Your image is being generated in the background. You can safely navigate away and we'll notify you when it's ready!",
  viewGallery: "View Gallery",
  stayHere: "Stay Here",
  newGeneration: "Generate Another Image"
};

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImages, setShowImages] = useState(false);
  const [jobQueued, setJobQueued] = useState(false);
  const [queueJobId, setQueueJobId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [completedJobResult, setCompletedJobResult] = useState<{
    imageUrl: string;
    prompt: string;
    aspectRatio: string;
    jobId: string;
  } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Use the generation queue hook
  const {
    isCreatingJob,
    createImageGenerationJob
  } = useGenerationQueue({
    onJobComplete: (job) => {
      // Store the completed job result to display on the page
      if (job.job_type === 'image_generation' && job.output_url) {
        setCompletedJobResult({
          imageUrl: job.output_url,
          prompt: job.prompt,
          aspectRatio: (job.input_parameters as any)?.aspectRatio || '1:1',
          jobId: job.id
        });
        setJobQueued(false);
        setQueueJobId(null);
        
        toast.success("Your image is ready!", {
          description: "Check it out below or visit your gallery",
          duration: 5000,
          action: {
            label: "View Gallery",
            onClick: () => window.location.href = "/gallery"
          }
        });
        
        // Scroll to the result
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }
    }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let step = 0;
      setLoadingMessage(loadingTexts.steps[step]);
      setLoadingProgress(0);

      const totalSteps = loadingTexts.steps.length;
      const stepDuration = 3000;
      const progressIncrement = 100 / totalSteps;

      interval = setInterval(() => {
        step++;
        if (step < totalSteps) {
          setLoadingMessage(loadingTexts.steps[step]);
          setLoadingProgress(prev => Math.min(prev + progressIncrement, 100));
        } else {
          setLoadingProgress(100);
          clearInterval(interval);
        }
      }, stepDuration);

      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } else {
      setLoadingProgress(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (generatedImages.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        setShowImages(true);
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowImages(false);
    }
  }, [generatedImages, isLoading]);

  const handleDownload = async (imageUrl: string, index: number = 0) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `virallyzer-image-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded successfully!", { id: `download-toast-${index}` });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Failed to download image. Please try again.", { id: `download-toast-${index}` });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setShowImages(false);
    setJobQueued(false);
    setQueueJobId(null);

    try {
      // Use the new queue system
      const result = await createImageGenerationJob(prompt, {
        aspectRatio,
        numOutputs: 1,
        outputFormat: 'png',
        outputQuality: 90
      });

      if (result.success) {
        setJobQueued(true);
        setQueueJobId(result.job?.id || null);
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
      toast.error(errorMessage, { id: 'image-gen-toast', duration: 8000 });
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setPrompt('');
    setJobQueued(false);
    setQueueJobId(null);
    setError(null);
    setGeneratedImages([]);
    setShowImages(false);
    setCompletedJobResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-2 sm:p-4 md:p-6 lg:p-8 text-white flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-3 sm:p-6 md:p-8">
        <header className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 mb-3 sm:mb-4">
            <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent pb-1 px-2">
            {loadingTexts.title}
          </h1>
          <p className="text-sm sm:text-md text-gray-400 max-w-xl mx-auto px-4">
            {loadingTexts.subtitle}
          </p>
        </header>

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
                disabled={isLoading || isCreatingJob}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="aspect-ratio" className="block text-sm font-medium text-slate-200 mb-1.5">
                  {loadingTexts.aspectRatioLabel}
                </Label>
                <select
                  id="aspect-ratio"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  disabled={isLoading || isCreatingJob}
                  className="w-full p-3 text-sm sm:text-base rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-slate-100 transition-all duration-300 shadow-sm focus:shadow-cyan-500/30 disabled:opacity-50 touch-manipulation"
                >
                  {Object.entries(loadingTexts.aspectRatios).map(([value, label]) => (
                    <option key={value} value={value} className="bg-gray-800 text-white">{label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button 
                  type="submit" 
                  disabled={isLoading || isCreatingJob || !prompt.trim()}
                  className="w-full font-semibold py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-600 hover:via-purple-700 hover:to-pink-700 text-white transition-all duration-300 shadow-lg hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px] touch-manipulation"
                >
                  {(isLoading || isCreatingJob) ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" /> 
                      <span className="hidden sm:inline">Adding to Queue...</span>
                      <span className="sm:hidden">Queueing...</span>
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
                <p className="text-gray-500 text-xs mt-1">
                  Aspect Ratio: {loadingTexts.aspectRatios[aspectRatio as keyof typeof loadingTexts.aspectRatios]}
                </p>
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

        {/* Completed Job Result Preview */}
        {completedJobResult && (
          <div ref={resultsRef} className="mt-6 space-y-4">
            <div className="p-6 bg-green-900/30 border border-green-700 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-green-300">Image Generated Successfully!</h3>
              </div>
              
              {/* Image Preview */}
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <div className="relative group">
                  <img 
                    src={completedJobResult.imageUrl} 
                    alt={`Generated: ${completedJobResult.prompt}`}
                    className="w-full h-auto rounded-lg shadow-lg max-h-96 object-contain mx-auto"
                    onLoad={() => {
                      // Scroll to image when it loads
                      setTimeout(() => {
                        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                  />
                  
                  {/* Image overlay with actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center gap-3">
                    <Button
                      onClick={() => handleDownload(completedJobResult.imageUrl)}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => window.open(completedJobResult.imageUrl, '_blank')}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full
                    </Button>
                  </div>
                </div>
                
                {/* Image Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Prompt:</span>
                    <span className="text-gray-300 text-right max-w-xs truncate" title={completedJobResult.prompt}>
                      "{completedJobResult.prompt}"
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Aspect Ratio:</span>
                    <span className="text-gray-300">
                      {loadingTexts.aspectRatios[completedJobResult.aspectRatio as keyof typeof loadingTexts.aspectRatios] || completedJobResult.aspectRatio}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Job ID:</span>
                    <span className="text-gray-300 font-mono text-xs">{completedJobResult.jobId}</span>
                  </div>
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
      </div>

      {/* Generation Queue Component */}
      <GenerationQueue />
    </div>
  );
} 