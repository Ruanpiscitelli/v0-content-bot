"use client";

import React, { useState, useRef } from 'react';
import { Upload, Users, Sparkles, Loader2, Download, Eye, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { ImageSkeleton } from '@/components/ui/image-skeleton';
import { GenerationQueue } from '@/components/ui/generation-queue';
import { useGenerationQueue } from '@/hooks/useGenerationQueue';

const loadingTexts = {
  steps: [
    "Analyzing facial features...",
    "Preparing face swap magic...",
    "Mapping facial geometry...",
    "Blending faces seamlessly...",
    "Applying final touches...",
    "Almost done! Creating your swap!"
  ],
  generatingButton: "✨ Swapping Faces...",
  generateButton: "🎭 Swap Faces",
  title: "AI Face Swap",
  subtitle: "Seamlessly swap faces between images with advanced AI technology",
  success: "Face swap completed successfully!",
  error: "Failed to swap faces. Please try again.",
  queueSuccess: "Your face swap has been added to the generation queue!",
  queueMessage: "Your face swap is being processed in the background. You can safely navigate away and we'll notify you when it's ready!",
  viewGallery: "View Gallery",
  stayHere: "Stay Here",
  newGeneration: "Create Another Swap"
};

export default function FaceSwapPage() {
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [swapImage, setSwapImage] = useState<File | null>(null);
  const [swapImageB, setSwapImageB] = useState<File | null>(null);
  const [targetImagePreview, setTargetImagePreview] = useState<string | null>(null);
  const [swapImagePreview, setSwapImagePreview] = useState<string | null>(null);
  const [swapImageBPreview, setSwapImageBPreview] = useState<string | null>(null);
  const [userGender, setUserGender] = useState<string>('default');
  const [userBGender, setUserBGender] = useState<string>('default');
  const [hairSource, setHairSource] = useState<string>('target');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobQueued, setJobQueued] = useState(false);
  const [queueJobId, setQueueJobId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [completedJobResult, setCompletedJobResult] = useState<{
    imageUrl: string;
    jobId: string;
  } | null>(null);

  const targetImageRef = useRef<HTMLInputElement>(null);
  const swapImageRef = useRef<HTMLInputElement>(null);
  const swapImageBRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Use the generation queue hook
  const {
    isCreatingJob,
    createJob
  } = useGenerationQueue({
    onJobComplete: (job) => {
      // Store the completed job result to display on the page
      if (job.job_type === 'face_swap' && job.output_url) {
        setCompletedJobResult({
          imageUrl: job.output_url,
          jobId: job.id
        });
        setJobQueued(false);
        setQueueJobId(null);
        
        toast.success("Your face swap is ready!", {
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

  const handleImageUpload = (
    file: File, 
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload a valid image file.");
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB.");
        return;
      }

      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const resetForm = () => {
    setTargetImage(null);
    setSwapImage(null);
    setSwapImageB(null);
    setTargetImagePreview(null);
    setSwapImagePreview(null);
    setSwapImageBPreview(null);
    setUserGender('default');
    setUserBGender('default');
    setHairSource('target');
    setError(null);
    setJobQueued(false);
    setQueueJobId(null);
    setCompletedJobResult(null);
    
    // Reset file inputs
    if (targetImageRef.current) targetImageRef.current.value = '';
    if (swapImageRef.current) swapImageRef.current.value = '';
    if (swapImageBRef.current) swapImageBRef.current.value = '';
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'face-swap-result.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Failed to download image. Please try again.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!targetImage || !swapImage) {
      toast.error("Please upload both target image and face image to swap.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setJobQueued(false);
    setQueueJobId(null);
    setCompletedJobResult(null);

    try {
      // Convert images to base64
      const targetImageBase64 = await convertFileToBase64(targetImage);
      const swapImageBase64 = await convertFileToBase64(swapImage);
      let swapImageBBase64 = null;
      
      if (swapImageB) {
        swapImageBBase64 = await convertFileToBase64(swapImageB);
      }

      // Use the new queue system
      const result = await createJob({
        jobType: 'face_swap' as any, // We'll handle this in the backend
        prompt: `Face swap: ${swapImage.name} onto ${targetImage.name}`,
        inputParameters: {
          target_image: targetImageBase64,
          swap_image: swapImageBase64,
          swap_image_b: swapImageBBase64,
          user_gender: userGender !== 'default' ? userGender : undefined,
          user_b_gender: userBGender !== 'default' ? userBGender : undefined,
          hair_source: hairSource
        }
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
        throw new Error(result.error || "Failed to create face swap job");
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || loadingTexts.error;
      setError(errorMessage);
      toast.error(errorMessage, { id: 'face-swap-toast', duration: 8000 });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{loadingTexts.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{loadingTexts.subtitle}</p>
        </div>

        {/* Generation Queue Status */}
        <GenerationQueue />

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Target Image */}
              <div className="space-y-4">
                <Label htmlFor="target-image" className="text-lg font-semibold text-gray-900">
                  Target Image (The scene/background)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors">
                  {targetImagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={targetImagePreview} 
                        alt="Target preview" 
                        className="max-w-full h-48 object-contain mx-auto rounded-lg"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setTargetImage(null);
                          setTargetImagePreview(null);
                          if (targetImageRef.current) targetImageRef.current.value = '';
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-600">Upload the image where you want to place the face</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                      <Button type="button" variant="outline" onClick={() => targetImageRef.current?.click()}>
                        Choose Target Image
                      </Button>
                    </div>
                  )}
                </div>
                <input
                  ref={targetImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, setTargetImage, setTargetImagePreview);
                  }}
                />
              </div>

              {/* Swap Image */}
              <div className="space-y-4">
                <Label htmlFor="swap-image" className="text-lg font-semibold text-gray-900">
                  Face Image (The face to swap in)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors">
                  {swapImagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={swapImagePreview} 
                        alt="Swap preview" 
                        className="max-w-full h-48 object-contain mx-auto rounded-lg"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setSwapImage(null);
                          setSwapImagePreview(null);
                          if (swapImageRef.current) swapImageRef.current.value = '';
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-600">Upload the face you want to swap in</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                      <Button type="button" variant="outline" onClick={() => swapImageRef.current?.click()}>
                        Choose Face Image
                      </Button>
                    </div>
                  )}
                </div>
                <input
                  ref={swapImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, setSwapImage, setSwapImagePreview);
                  }}
                />
              </div>
            </div>

            {/* Optional Second Face */}
            <div className="space-y-4">
              <Label htmlFor="swap-image-b" className="text-lg font-semibold text-gray-900">
                Second Face Image (Optional - for multi-person swaps)
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors">
                {swapImageBPreview ? (
                  <div className="space-y-4">
                    <img 
                      src={swapImageBPreview} 
                      alt="Second swap preview" 
                      className="max-w-full h-48 object-contain mx-auto rounded-lg"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setSwapImageB(null);
                        setSwapImageBPreview(null);
                        if (swapImageBRef.current) swapImageBRef.current.value = '';
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-gray-600">Upload a second face for multi-person swaps</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                    <Button type="button" variant="outline" onClick={() => swapImageBRef.current?.click()}>
                      Choose Second Face
                    </Button>
                  </div>
                )}
              </div>
              <input
                ref={swapImageBRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, setSwapImageB, setSwapImageBPreview);
                }}
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="user-gender">First Person Gender</Label>
                <Select value={userGender} onValueChange={setUserGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Auto-detect</SelectItem>
                    <SelectItem value="a man">A man</SelectItem>
                    <SelectItem value="a woman">A woman</SelectItem>
                    <SelectItem value="nonbinary person">Nonbinary person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-b-gender">Second Person Gender</Label>
                <Select value={userBGender} onValueChange={setUserBGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Auto-detect</SelectItem>
                    <SelectItem value="a man">A man</SelectItem>
                    <SelectItem value="a woman">A woman</SelectItem>
                    <SelectItem value="nonbinary person">Nonbinary person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hair-source">Hair Style</Label>
                <Select value={hairSource} onValueChange={setHairSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose hair source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="target">Keep target hair</SelectItem>
                    <SelectItem value="user">Use face image hair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="submit"
                disabled={isLoading || isCreatingJob || !targetImage || !swapImage}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50"
              >
                {isLoading || isCreatingJob ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {loadingTexts.generatingButton}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    {loadingTexts.generateButton}
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="px-8 py-3 text-lg font-semibold"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>
          </form>
        </div>

        {/* Queue Status */}
        {jobQueued && queueJobId && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <h3 className="text-lg font-semibold text-blue-900">Face Swap in Progress</h3>
            </div>
            <p className="text-blue-800 mb-4">{loadingTexts.queueMessage}</p>
            <div className="flex space-x-3">
              <Button 
                onClick={() => window.location.href = "/gallery"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loadingTexts.viewGallery}
              </Button>
              <Button variant="outline" onClick={() => setJobQueued(false)}>
                {loadingTexts.stayHere}
              </Button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {completedJobResult && (
          <div ref={resultsRef} className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Face Swap Complete!</h2>
              <p className="text-gray-600">Your face swap has been generated successfully</p>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <img
                  src={completedJobResult.imageUrl}
                  alt="Face swap result"
                  className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => handleDownload(completedJobResult.imageUrl)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Image
                </Button>
                
                <Button
                  onClick={() => window.location.href = "/gallery"}
                  variant="outline"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View in Gallery
                </Button>
                
                <Button
                  onClick={resetForm}
                  variant="outline"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {loadingTexts.newGeneration}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 