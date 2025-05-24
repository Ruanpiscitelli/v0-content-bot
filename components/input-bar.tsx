"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Send, Sparkles, Mic, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface InputBarProps {
  onSendMessage: (text: string) => void
  onSendImage: (file: File) => void
  onSendAudio: (audioBlob: Blob) => void
  isLoading: boolean
  inputValue: string
  onInputChange: (value: string) => void
}

export default function InputBar({
  onSendMessage,
  onSendImage,
  onSendAudio,
  isLoading,
  inputValue,
  onInputChange,
}: InputBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [recordingTime, setRecordingTime] = useState(0)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [micError, setMicError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((inputValue || '').trim() && !isLoading) {
      onSendMessage(inputValue)
      onInputChange("")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && !isLoading) {
      onSendImage(file)
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const contentTemplates = [
    {
      title: "Viral Hook Generator",
      prompt: "Create 5 attention-grabbing hooks for [topic/niche] that stop scrolling and make people want to read more. Include psychological triggers and curiosity gaps.",
    },
    {
      title: "Instagram Carousel Post",
      prompt: "Create a complete 10-slide Instagram carousel about [topic] with viral potential. Include: compelling cover slide, educational content, storytelling elements, and strong CTA.",
    },
    {
      title: "Twitter Thread Strategy",
      prompt: "Write a viral Twitter thread about [topic] with 8-12 tweets. Start with a controversial statement, provide value in each tweet, and end with engagement bait.",
    },
    {
      title: "Story-Driven Content",
      prompt: "Transform [product/service/lesson] into a compelling story format for social media. Include: conflict, transformation, and emotional connection to drive engagement.",
    },
    {
      title: "Sales-Converting Caption",
      prompt: "Write a high-converting Instagram/LinkedIn caption for [product/service] using the AIDA framework. Include social proof, urgency, and clear call-to-action.",
    },
    {
      title: "YouTube Short Script",
      prompt: "Create a 60-second YouTube Short script about [topic] designed to go viral. Include: hook in first 3 seconds, value-packed content, and retention strategies.",
    },
    {
      title: "Email Newsletter",
      prompt: "Write an engaging email newsletter about [topic] with: compelling subject line, personal story opening, valuable insights, and clear next steps.",
    },
    {
      title: "LinkedIn Thought Leadership",
      prompt: "Create a professional LinkedIn post about [industry insight/trend] that positions you as a thought leader. Include data, personal perspective, and discussion starter.",
    },
  ]

  const handleUseTemplate = (prompt: string) => {
    onInputChange(prompt)
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        setMicError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        setRecordingTime(0);

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          onSendAudio(audioBlob);
          audioChunksRef.current = [];
          stream.getTracks().forEach(track => track.stop());
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          setRecordingTime(0);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        timerIntervalRef.current = setInterval(() => {
          setRecordingTime(prevTime => prevTime + 1);
        }, 1000);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        let errorMessage = "Could not access microphone.";
        if (err instanceof Error) {
          if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            errorMessage = "No microphone found. Please connect a microphone.";
          } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            errorMessage = "Microphone access denied. Please allow access in your browser settings.";
          }
        }
        setMicError(errorMessage);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        setRecordingTime(0);
        setIsRecording(false);
        setTimeout(() => setMicError(null), 5000);
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  return (
    <div className="p-4 border-t border-cyan-400/30 bg-gradient-to-r from-gray-900/90 via-purple-900/90 to-indigo-900/90 backdrop-blur-lg">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto">
        <div className="flex space-x-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full h-10 w-10 text-cyan-300 hover:text-cyan-200 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300 border border-transparent hover:border-cyan-400/30"
                disabled={isLoading}
              >
                <Sparkles className="h-5 w-5" />
                <span className="sr-only">Templates</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-96 max-h-96 overflow-y-auto bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 border border-cyan-400/30 shadow-xl shadow-cyan-500/20">
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-cyan-300 mb-3">Content Templates</h3>
                <div className="space-y-2">
                  {contentTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="p-3 text-sm bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-md hover:from-cyan-500/20 hover:to-purple-500/20 cursor-pointer text-gray-300 hover:text-cyan-300 transition-all duration-300 border border-transparent hover:border-cyan-400/30"
                      onClick={() => handleUseTemplate(template.prompt)}
                    >
                      <p className="font-medium text-cyan-400 mb-1">{template.title}</p>
                      <p className="text-gray-400 text-xs leading-relaxed">{template.prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            onClick={triggerFileInput}
            size="icon"
            variant="ghost"
            className="rounded-full h-10 w-10 text-cyan-300 hover:text-cyan-200 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300 border border-transparent hover:border-cyan-400/30"
            disabled={isLoading}
          >
            <ImageIcon className="h-5 w-5" />
            <span className="sr-only">Upload image</span>
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={isLoading}
          />

          {isRecording && (
            <div className="flex items-center justify-center w-16 text-sm text-red-400 font-mono">
              {formatTime(recordingTime)}
            </div>
          )}

          <Button
            type="button"
            onClick={toggleRecording}
            size="icon"
            variant={isRecording ? "default" : "ghost"}
            className={`rounded-full h-10 w-10 transition-all duration-300 ${
              isRecording 
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/30" 
                : "text-cyan-300 hover:text-cyan-200 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 border border-transparent hover:border-cyan-400/30"
            }`}
            disabled={isLoading}
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice input</span>
          </Button>
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue || ''}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message or describe the content you want to create..."
            className="w-full border border-cyan-400/30 rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 bg-gradient-to-r from-gray-800/80 via-purple-800/80 to-indigo-800/80 backdrop-blur-lg text-white placeholder-gray-400 shadow-lg shadow-cyan-500/10"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!(inputValue || '').trim() || isLoading}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </div>
      </form>

      {micError && (
        <div className="text-center mt-2 text-sm text-red-400 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-400/30 p-2 rounded-md max-w-3xl mx-auto backdrop-blur-lg">
          {micError}
        </div>
      )}
    </div>
  )
}
