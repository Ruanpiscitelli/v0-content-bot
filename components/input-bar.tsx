"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Send, Sparkles, Mic, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface InputBarProps {
  onSendMessage: (text: string) => void
  onSendImage: (file: File) => void
  isLoading: boolean
}

export default function InputBar({ onSendMessage, onSendImage, isLoading }: InputBarProps) {
  const [message, setMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isRecording, setIsRecording] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage("")
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
      title: "Informative Post",
      prompt: "Create an informative post about [topic] with 3 main points and a call to action.",
    },
    {
      title: "Engaging Question",
      prompt: "Create an engaging question about [topic] to increase interaction with my followers.",
    },
    {
      title: "Quick Tip",
      prompt: "Share a quick and practical tip about [topic] that my followers can implement today.",
    },
    {
      title: "Personal Story",
      prompt: "Create an outline of a personal story about [experience] and how it relates to my audience.",
    },
    {
      title: "Product Promotion",
      prompt:
        "Write a post to promote [product/service] highlighting its main benefits without seeming too promotional.",
    },
  ]

  const handleUseTemplate = (prompt: string) => {
    setMessage(prompt)
  }

  const toggleRecording = () => {
    // This would be implemented with actual speech recognition
    setIsRecording(!isRecording)
  }

  return (
    <div className="p-4 border-t bg-white">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto">
        <div className="flex space-x-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full h-10 w-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                disabled={isLoading}
              >
                <Sparkles className="h-5 w-5" />
                <span className="sr-only">Templates</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-80">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Content Templates</h3>
                <div className="space-y-2">
                  {contentTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="p-2 text-sm bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleUseTemplate(template.prompt)}
                    >
                      <p className="font-medium">{template.title}</p>
                      <p className="text-gray-500 text-xs mt-1">{template.prompt}</p>
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
            className="rounded-full h-10 w-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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

          <Button
            type="button"
            onClick={toggleRecording}
            size="icon"
            variant={isRecording ? "default" : "ghost"}
            className={`rounded-full h-10 w-10 ${isRecording ? "bg-red-500 text-white hover:bg-red-600" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
            disabled={isLoading}
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice input</span>
          </Button>
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message or describe the content you want to create..."
            className="w-full border rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#01aef0] hover:bg-[#0099d6] text-white"
            disabled={!message.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </div>
      </form>

      {isLoading && <div className="text-center mt-2 text-sm text-gray-500">Gerando conteúdo personalizado...</div>}
    </div>
  )
}
