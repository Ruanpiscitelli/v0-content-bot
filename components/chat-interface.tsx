"use client"

import { useState, useEffect, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import ChatHeader from "./chat-header"
import ChatWindow from "./chat-window"
import InputBar from "./input-bar"
import { sendMessage, sendImage } from "@/lib/api-service"
import { trackEvent } from "@/lib/analytics"
import type { Message } from "@/lib/types"
import { Instagram, Facebook, Twitter, Linkedin, Youtube, FileText, Mail, MessageSquare, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Welcome to Virallyzer! 👋 I'm your AI-powered content creation assistant, designed to help you create engaging, high-converting content in seconds. Whether you need Instagram posts, LinkedIn articles, email newsletters, or blog content, I can help you save hours of work. Try asking me to 'Create a carousel post about productivity tips' or 'Generate 5 content ideas for my fitness brand' to get started!",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [contentType, setContentType] = useState<string>("instagram")
  const [contentStyle, setContentStyle] = useState<string>("casual")
  const [contentLength, setContentLength] = useState<number>(2) // 1-short, 2-medium, 3-long
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true)
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (isLoading) return

    // Create a new message from the user
    const userMessage: Message = {
      id: uuidv4(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    }

    // Add the user message to the chat
    setMessages((prev) => [...prev, userMessage])

    // Track the event
    trackEvent("message_sent", { content_type: contentType, content_style: contentStyle })

    // Set loading state
    setIsLoading(true)

    try {
      // Enhance the prompt with content preferences
      const enhancedPrompt = `[Type: ${contentType}, Style: ${contentStyle}, Length: ${
        contentLength === 1 ? "short" : contentLength === 2 ? "medium" : "long"
      }${includeHashtags ? ", include hashtags" : ""}${includeEmojis ? ", include emojis" : ""}] ${text}`

      // Send the message to the API
      const response = await sendMessage(enhancedPrompt)

      // Create a new message from the bot
      const botMessage: Message = {
        id: uuidv4(),
        content: response.message,
        sender: "bot",
        timestamp: new Date(),
      }

      // Add the bot message to the chat
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      // Add an error message
      const errorMessage: Message = {
        id: uuidv4(),
        content: "Sorry, an error occurred while processing your message. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])

      // Track the error
      trackEvent("message_error", { error: String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendImage = async (file: File) => {
    if (isLoading) return

    // Create a temporary URL for the image
    const imageUrl = URL.createObjectURL(file)

    // Create a new message from the user with the image
    const userMessage: Message = {
      id: uuidv4(),
      content: "Image sent",
      sender: "user",
      timestamp: new Date(),
      image: imageUrl,
    }

    // Add the user message to the chat
    setMessages((prev) => [...prev, userMessage])

    // Track the event
    trackEvent("image_sent", { file_type: file.type, file_size: file.size })

    // Set loading state
    setIsLoading(true)

    try {
      // Send the image to the API
      const response = await sendImage(file)

      // Create a new message from the bot
      const botMessage: Message = {
        id: uuidv4(),
        content: response.message,
        sender: "bot",
        timestamp: new Date(),
      }

      // Add the bot message to the chat
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending image:", error)

      // Add an error message
      const errorMessage: Message = {
        id: uuidv4(),
        content: "Sorry, an error occurred while processing your image. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])

      // Track the error
      trackEvent("image_error", { error: String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  const contentTypeIcons = {
    instagram: <Instagram className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    blog: <FileText className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    general: <MessageSquare className="w-4 h-4" />,
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader title="Assistente de Criação de Conteúdo" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium">Creating: </span>
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize flex items-center">
                  {contentTypeIcons[contentType as keyof typeof contentTypeIcons]}
                  <span className="ml-1">{contentType}</span>
                </span>
                <span className="ml-2 text-sm bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full capitalize">
                  {contentStyle}
                </span>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                    <span className="sr-only">Configurações</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Prompt Suggestions</h4>
                    <div className="space-y-2 text-sm">
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSendMessage("Create a post about the benefits of daily meditation")}
                      >
                        Create a post about the benefits of daily meditation
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSendMessage("Generate 5 content ideas for my natural products brand")}
                      >
                        Generate 5 content ideas for my natural products brand
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSendMessage("Write a caption for a product launch photo")}
                      >
                        Write a caption for a product launch photo
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <ChatWindow messages={messages} isLoading={isLoading} />
          <InputBar onSendMessage={handleSendMessage} onSendImage={handleSendImage} isLoading={isLoading} />
          {isLoading && (
            <div className="text-center mt-2 text-sm text-gray-500">Generating personalized content...</div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
