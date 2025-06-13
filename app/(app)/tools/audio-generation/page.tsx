"use client";

import React, { useState, useEffect, useRef } from 'react';
import { VolumeIcon, Upload, Play, Pause, Volume2, ArrowRight, AlertCircle, RefreshCw, Sparkles, AlertTriangle, CheckCircle, Loader2, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { GenerationQueue } from '@/components/ui/generation-queue';
import { AnimatedLoading } from '@/components/ui/animated-loading';
import { useGenerationQueue } from '@/hooks/useGenerationQueue';

// Voice options for MiniMax Speech-02-HD
const voiceOptions = [
  // English voices
  { value: "Friendly_Person", label: "🇺🇸 Friendly Person", category: "English" },
  { value: "Wise_Woman", label: "🇺🇸 Wise Woman", category: "English" },
  { value: "Inspirational_girl", label: "🇺🇸 Inspirational Girl", category: "English" },
  { value: "Deep_Voice_Man", label: "🇺🇸 Deep Voice Man", category: "English" },
  { value: "Calm_Woman", label: "🇺🇸 Calm Woman", category: "English" },
  { value: "Casual_Guy", label: "🇺🇸 Casual Guy", category: "English" },
  { value: "Lively_Girl", label: "🇺🇸 Lively Girl", category: "English" },
  { value: "Patient_Man", label: "🇺🇸 Patient Man", category: "English" },
  { value: "Young_Knight", label: "🇺🇸 Young Knight", category: "English" },
  { value: "Determined_Man", label: "🇺🇸 Determined Man", category: "English" },
  { value: "Lovely_Girl", label: "🇺🇸 Lovely Girl", category: "English" },
  { value: "Decent_Boy", label: "🇺🇸 Decent Boy", category: "English" },
  { value: "Imposing_Manner", label: "🇺🇸 Imposing Manner", category: "English" },
  { value: "Elegant_Man", label: "🇺🇸 Elegant Man", category: "English" },
  { value: "Sweet_Girl_2", label: "🇺🇸 Sweet Girl", category: "English" },
  
  // Spanish voices
  { value: "Spanish_SereneWoman", label: "🇪🇸 Serene Woman", category: "Spanish" },
  { value: "Spanish_MaturePartner", label: "🇪🇸 Mature Partner", category: "Spanish" },
  { value: "Spanish_CaptivatingStoryteller", label: "🇪🇸 Captivating Storyteller", category: "Spanish" },
  { value: "Spanish_ConfidentWoman", label: "🇪🇸 Confident Woman", category: "Spanish" },
  { value: "Spanish_ThoughtfulMan", label: "🇪🇸 Thoughtful Man", category: "Spanish" },
  
  // Portuguese voices
  { value: "Portuguese_SentimentalLady", label: "🇵🇹 Sentimental Lady", category: "Portuguese" },
  { value: "Portuguese_ConfidentWoman", label: "🇵🇹 Confident Woman", category: "Portuguese" },
  { value: "Portuguese_ThoughtfulMan", label: "🇵🇹 Thoughtful Man", category: "Portuguese" },
  { value: "Portuguese_Kind-heartedGirl", label: "🇵🇹 Kind-hearted Girl", category: "Portuguese" },
  
  // French voices
  { value: "French_Male_Speech_New", label: "🇫🇷 Male Speech", category: "French" },
  { value: "French_Female_News Anchor", label: "🇫🇷 Female News Anchor", category: "French" },
  { value: "French_CasualMan", label: "🇫🇷 Casual Man", category: "French" },
  
  // Other languages
  { value: "German_FriendlyMan", label: "🇩🇪 Friendly Man", category: "German" },
  { value: "German_SweetLady", label: "🇩🇪 Sweet Lady", category: "German" },
  { value: "Italian_BraveHeroine", label: "🇮🇹 Brave Heroine", category: "Italian" },
  { value: "Russian_HandsomeChildhoodFriend", label: "🇷🇺 Handsome Childhood Friend", category: "Russian" },
  { value: "Japanese_IntellectualSenior", label: "🇯🇵 Intellectual Senior", category: "Japanese" },
  { value: "Korean_SweetGirl", label: "🇰🇷 Sweet Girl", category: "Korean" },
];

// Emotion options
const emotionOptions = [
  { value: "happy", label: "😊 Happy" },
  { value: "sad", label: "😢 Sad" },
  { value: "angry", label: "😠 Angry" },
  { value: "excited", label: "🤩 Excited" },
  { value: "calm", label: "😌 Calm" },
  { value: "neutral", label: "😐 Neutral" },
];

// Language boost options
const languageBoostOptions = [
  { value: "English", label: "🇺🇸 English" },
  { value: "Spanish", label: "🇪🇸 Spanish" },
  { value: "Portuguese", label: "🇵🇹 Portuguese" },
  { value: "French", label: "🇫🇷 French" },
  { value: "German", label: "🇩🇪 German" },
  { value: "Italian", label: "🇮🇹 Italian" },
  { value: "Russian", label: "🇷🇺 Russian" },
  { value: "Japanese", label: "🇯🇵 Japanese" },
  { value: "Korean", label: "🇰🇷 Korean" },
  { value: "Chinese", label: "🇨🇳 Chinese" },
];

const loadingTexts = {
  steps: [
    "Initializing MiniMax Speech-02-HD...",
    "Processing text for synthesis...",
    "Applying voice characteristics...",
    "Generating high-fidelity audio...",
    "Applying emotion and tone...",
    "Finalizing your audio generation!"
  ],
  title: "AI Text-to-Speech Generation",
  subtitle: "Generate high-quality speech with MiniMax Speech-02-HD technology",
  textLabel: "Text to Synthesize",
  textDescription: "Enter the text you want to convert to speech (max 5000 characters)",
  voiceLabel: "Voice Selection",
  voiceDescription: "Choose from 300+ pre-built voices across different demographics",
  speedLabel: "Speech Speed",
  speedDescription: "Control the playback speed of generated speech",
  volumeLabel: "Speech Volume",
  volumeDescription: "Adjust the volume level of the generated audio",
  pitchLabel: "Speech Pitch",
  pitchDescription: "Modify the pitch/tone of the voice",
  emotionLabel: "Speech Emotion",
  emotionDescription: "Set the emotional tone of the speech",
  languageBoostLabel: "Language Enhancement",
  languageBoostDescription: "Enhance recognition for specific languages",
  generateButton: "🎤 Generate Speech",
  generatingButton: "✨ Creating Audio...",
  success: "Audio generated successfully!",
  error: "Failed to generate audio. Please try again.",
  processing: "Your audio is being generated...",
  activeJobWarning: "Please wait for your current audio generation to complete before starting a new one."
};

export default function AudioGenerationPage() {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Friendly_Person');
  const [speed, setSpeed] = useState([1.0]);
  const [volume, setVolume] = useState([100]);
  const [pitch, setPitch] = useState([0]);
  const [emotion, setEmotion] = useState('happy');
  const [languageBoost, setLanguageBoost] = useState('English');
  const [englishNormalization, setEnglishNormalization] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queueJobId, setQueueJobId] = useState<string | null>(null);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [checkingActiveJobs, setCheckingActiveJobs] = useState(true);
  const [completedJobResult, setCompletedJobResult] = useState<{
    audioUrl: string;
    prompt: string;
    voice: string;
    jobId: string;
  } | null>(null);

  const generatedAudioRef = useRef<HTMLAudioElement>(null);
  const [isPlayingGenerated, setIsPlayingGenerated] = useState(false);

  // Use the generation queue hook
  const {
    isCreatingJob,
    createJob,
    getJobs
  } = useGenerationQueue({
    onJobComplete: (job) => {
      // Store the completed job result to display on the page
      if (job.job_type === 'audio_generation' && job.output_url) {
        const selectedVoiceOption = voiceOptions.find(voice => voice.value === (job.input_parameters as any)?.voice_id);
        setCompletedJobResult({
          audioUrl: job.output_url,
          prompt: job.prompt,
          voice: selectedVoiceOption?.label || 'Unknown Voice',
          jobId: job.id
        });
        setQueueJobId(null);
        
        toast.success("Audio complete! Your speech is ready. Check it out below or in your gallery.");
        
        // Scroll to the result
        setTimeout(() => {
          const resultsRef = document.querySelector('#audio-results');
          resultsRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }
      checkActiveJobs();
    }
  });

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for active audio generation jobs
  const checkActiveJobs = async () => {
    try {
      setCheckingActiveJobs(true);
      const jobsResult = await getJobs({ status: 'pending', includeProcessing: true });
      // Filter for audio generation jobs
      const audioJobs = jobsResult.jobs.filter(job => 
        job.job_type === 'audio_generation' || 
        (job.job_type === 'video_generation' && 
         typeof job.input_parameters === 'object' && 
         job.input_parameters !== null && 
         !Array.isArray(job.input_parameters) &&
         (job.input_parameters as any)?.is_audio_generation === true)
      );
      setActiveJobs(audioJobs);
    } catch (error) {
      console.error('Error checking active jobs:', error);
    } finally {
      setCheckingActiveJobs(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      checkActiveJobs();
      const interval = setInterval(checkActiveJobs, 30000);
      return () => clearInterval(interval);
    }
  }, [mounted]);

  const hasActiveJobs = activeJobs.length > 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!text.trim()) {
      toast.error("Please enter the text you want to synthesize.");
      return;
    }

    if (text.length > 5000) {
      toast.error("Text must be less than 5000 characters.");
      return;
    }

    if (hasActiveJobs) {
      toast.warning(loadingTexts.activeJobWarning);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('🚀 Starting audio generation with MiniMax Speech-02-HD...');

      // Create job for MiniMax Speech-02-HD audio generation
      const jobData: { jobType: 'audio_generation'; prompt: string; inputParameters: Record<string, any> } = {
        jobType: 'audio_generation',
        prompt: text.trim(),
        inputParameters: {
          voice_id: selectedVoice,
          speed: speed[0],
          volume: volume[0] / 100,
          pitch: pitch[0],
          emotion: emotion,
          english_normalization: englishNormalization,
          sample_rate: 32000,
          bitrate: 128000,
          channel: 'mono',
          language_boost: languageBoost
        }
      };

      console.log('🎯 Creating MiniMax Speech-02-HD job:', jobData);
      
      const result = await createJob(jobData);
      if (result.success && result.job) {
        setQueueJobId(result.job.id);
        toast.success(`Audio generation started! Job #${result.job.id} - Speech synthesis with MiniMax Speech-02-HD`);
        console.log('✅ Job created successfully:', result.job.id);
        // Start polling for completion
        checkActiveJobs();
      } else {
        throw new Error(result.error || 'Failed to create job');
      }

    } catch (error) {
      console.error('❌ Audio generation failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      
      toast.error(`Generation failed: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setText('');
    setQueueJobId(null);
    setError(null);
    setIsPlayingGenerated(false);
    setCompletedJobResult(null);
    checkActiveJobs();
  };

  const toggleGeneratedAudio = () => {
    if (generatedAudioRef.current) {
      if (isPlayingGenerated) {
        generatedAudioRef.current.pause();
        setIsPlayingGenerated(false);
      } else {
        generatedAudioRef.current.play();
        setIsPlayingGenerated(true);
      }
    }
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-8 text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Loading audio generation...</span>
        </div>
      </div>
    );
  }

  const selectedVoiceOption = voiceOptions.find(voice => voice.value === selectedVoice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-2 sm:p-4 md:p-6 lg:p-8 text-white flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-3 sm:p-6 md:p-8">
        <header className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-400/30 mb-3 sm:mb-4">
            <VolumeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-purple-300 via-pink-400 to-cyan-400 bg-clip-text text-transparent pb-1 px-2">
            {loadingTexts.title}
          </h1>
          <p className="text-sm sm:text-md text-gray-400 max-w-xl mx-auto px-4">
            {loadingTexts.subtitle}
          </p>
        </header>

        {/* Active Job Warning */}
        {hasActiveJobs && !queueJobId && (
          <div className="mb-6 p-4 bg-amber-900/30 border border-amber-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <AnimatedLoading 
                  icon="volume"
                  className="scale-75"
                  showProgress={true}
                  texts={[
                    "Processing speech synthesis...",
                    "Applying voice characteristics...",
                    "Generating high-quality audio...",
                    "Almost ready!"
                  ]}
                  duration={2500}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-amber-300 font-semibold mb-1">Audio Generation in Progress</h3>
                <p className="text-amber-400 text-sm mb-3">{loadingTexts.activeJobWarning}</p>
                <div className="space-y-2">
                  {activeJobs.map((job, index) => (
                    <div key={job.id} className="bg-black/20 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-amber-300">Audio #{index + 1}</span>
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
              icon="volume"
              showProgress={true}
              className="py-8"
            />
          </div>
        )}

        {/* Audio Generation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text to Synthesize */}
          <div>
            <Label className="block text-sm font-medium text-slate-200 mb-2">
              {loadingTexts.textLabel} <span className="text-pink-400">*</span>
            </Label>
            <p className="text-xs text-gray-400 mb-3">{loadingTexts.textDescription}</p>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Hello! This is a demonstration of the MiniMax Speech-02-HD text-to-speech technology. You can generate high-quality audio with emotional expression and multilingual capabilities."
              disabled={isLoading || isCreatingJob || hasActiveJobs}
              className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20"
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Characters: {text.length}/5000
              </p>
              {text.length > 4500 && (
                <p className="text-xs text-amber-400">
                  ⚠️ Approaching character limit
                </p>
              )}
            </div>
          </div>

          {/* Voice and Basic Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voice Selection */}
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">
                {loadingTexts.voiceLabel}
              </Label>
              <p className="text-xs text-gray-400 mb-3">{loadingTexts.voiceDescription}</p>
              <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={isLoading || isCreatingJob || hasActiveJobs}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-purple-400">
                  <SelectValue>
                    {selectedVoiceOption?.label || "Select voice"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 max-h-64">
                  {Object.entries(
                    voiceOptions.reduce((acc, voice) => {
                      if (!acc[voice.category]) acc[voice.category] = [];
                      acc[voice.category].push(voice);
                      return acc;
                    }, {} as Record<string, typeof voiceOptions>)
                  ).map(([category, voices]) => (
                    <div key={category}>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-800">
                        {category}
                      </div>
                      {voices.map((voice) => (
                        <SelectItem key={voice.value} value={voice.value} className="text-white hover:bg-gray-700">
                          {voice.label}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Emotion Selection */}
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">
                {loadingTexts.emotionLabel}
              </Label>
              <p className="text-xs text-gray-400 mb-3">{loadingTexts.emotionDescription}</p>
              <Select value={emotion} onValueChange={setEmotion} disabled={isLoading || isCreatingJob || hasActiveJobs}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-purple-400">
                  <SelectValue>
                    {emotionOptions.find(e => e.value === emotion)?.label || "Select emotion"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {emotionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Speed Control */}
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">
                {loadingTexts.speedLabel}
              </Label>
              <p className="text-xs text-gray-400 mb-3">{loadingTexts.speedDescription}</p>
              <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Speed</span>
                  <span className="text-sm text-purple-300 font-mono">{speed[0]}x</span>
                </div>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  disabled={isLoading || isCreatingJob || hasActiveJobs}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0.5x</span>
                  <span>2.0x</span>
                </div>
              </div>
            </div>

            {/* Volume Control */}
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">
                {loadingTexts.volumeLabel}
              </Label>
              <p className="text-xs text-gray-400 mb-3">{loadingTexts.volumeDescription}</p>
              <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Volume</span>
                  <span className="text-sm text-purple-300 font-mono">{volume[0]}%</span>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  min={10}
                  max={200}
                  step={5}
                  disabled={isLoading || isCreatingJob || hasActiveJobs}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10%</span>
                  <span>200%</span>
                </div>
              </div>
            </div>

            {/* Pitch Control */}
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">
                {loadingTexts.pitchLabel}
              </Label>
              <p className="text-xs text-gray-400 mb-3">{loadingTexts.pitchDescription}</p>
              <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">Pitch</span>
                  <span className="text-sm text-purple-300 font-mono">{pitch[0] > 0 ? '+' : ''}{pitch[0]}</span>
                </div>
                <Slider
                  value={pitch}
                  onValueChange={setPitch}
                  min={-20}
                  max={20}
                  step={1}
                  disabled={isLoading || isCreatingJob || hasActiveJobs}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>-20</span>
                  <span>+20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Language and Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Language Boost */}
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">
                {loadingTexts.languageBoostLabel}
              </Label>
              <p className="text-xs text-gray-400 mb-3">{loadingTexts.languageBoostDescription}</p>
              <Select value={languageBoost} onValueChange={setLanguageBoost} disabled={isLoading || isCreatingJob || hasActiveJobs}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-purple-400">
                  <SelectValue>
                    {languageBoostOptions.find(lang => lang.value === languageBoost)?.label || "Select language"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {languageBoostOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* English Normalization */}
            <div>
              <Label className="block text-sm font-medium text-slate-200 mb-2">
                English Text Normalization
              </Label>
              <p className="text-xs text-gray-400 mb-3">Enable better number reading (slightly increases latency)</p>
              <div className="flex items-center space-x-3 bg-white/5 border border-white/20 rounded-lg p-3">
                <Switch
                  checked={englishNormalization}
                  onCheckedChange={setEnglishNormalization}
                  disabled={isLoading || isCreatingJob || hasActiveJobs}
                  className="data-[state=checked]:bg-purple-600"
                />
                <div className="flex-1">
                  <p className="text-sm text-white">
                    {englishNormalization ? "Enabled" : "Disabled"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {englishNormalization ? "Better number pronunciation" : "Standard text processing"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!text.trim() || isLoading || isCreatingJob || hasActiveJobs}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {isLoading || isCreatingJob ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {loadingTexts.generatingButton}
                </>
              ) : hasActiveJobs ? (
                <>
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Generation in Progress
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  {loadingTexts.generateButton}
                </>
              )}
            </Button>
            
            {error && (
              <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-300 font-medium">Generation Failed</p>
                </div>
                <p className="text-red-400 text-sm mt-1">{error}</p>
              </div>
            )}
          </div>
        </form>

        {/* Completed Audio Result Preview */}
        {completedJobResult && (
          <div id="audio-results" className="mt-8 space-y-4">
            <div className="p-6 bg-green-900/30 border border-green-700 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-green-300">Speech Generated Successfully!</h3>
              </div>
              
              {/* Audio Player */}
              <div className="bg-black/20 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center gap-4">
                    <audio 
                      ref={generatedAudioRef}
                      src={completedJobResult.audioUrl}
                      onEnded={() => setIsPlayingGenerated(false)}
                      className="hidden"
                    />
                    <Button
                      onClick={toggleGeneratedAudio}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
                    >
                      {isPlayingGenerated ? (
                        <>
                          <Pause className="w-6 h-6 mr-2" />
                          Pause Audio
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6 mr-2" />
                          Play Generated Speech
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = completedJobResult.audioUrl;
                        a.download = `speech-${Date.now()}.mp3`;
                        a.click();
                        toast.success("Download started! Your audio file is being downloaded.");
                      }}
                      variant="outline"
                      size="lg"
                      className="text-purple-300 border-purple-600 hover:bg-purple-600/20 px-6 py-3"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                {/* Audio Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Text:</span>
                    <span className="text-gray-300 text-right max-w-md truncate" title={completedJobResult.prompt}>
                      "{completedJobResult.prompt}"
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Voice:</span>
                    <span className="text-gray-300">{completedJobResult.voice}</span>
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
                  View Gallery
                </Button>
                <Button 
                  onClick={resetForm}
                  variant="outline"
                  className="text-purple-300 border-purple-400/50 hover:bg-purple-500/20 hover:border-purple-400 hover:text-purple-200 px-6 py-2"
                >
                  Generate Another Speech
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Queue Status */}
        {queueJobId && (
          <div className="mt-8">
            <GenerationQueue 
              onJobComplete={() => {
                setQueueJobId(null);
                checkActiveJobs();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
} 