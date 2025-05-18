"use client"

import { useState, useEffect, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import ChatHeader from "./chat-header"
import ChatWindow from "./chat-window"
import InputBar from "./input-bar"
import { sendImage } from "@/lib/api-service"
import { collectDeviceData } from "@/lib/device-data"
import { trackEvent } from "@/lib/analytics"
import type { Message } from "@/lib/types"
import { Instagram, Facebook, Twitter, Linkedin, Youtube, FileText, Mail, MessageSquare, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function ChatInterface({ userId }: { userId: string }) {
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
  const [currentPromptText, setCurrentPromptText] = useState("")
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

    const textToSend = text || currentPromptText;
    if (!textToSend.trim()) return;

    // Create a new message from the user
    const userMessage: Message = {
      id: uuidv4(),
      content: textToSend,
      sender: "user",
      timestamp: new Date(),
    }

    // Add the user message to the chat
    setMessages((prev) => [...prev, userMessage])
    setCurrentPromptText("")

    // Track the event
    trackEvent("message_sent", { 
      message_length: textToSend.length
    })

    // Set loading state
    setIsLoading(true)

    try {
      // Collect device data
      let deviceDataResult = {};
      try {
        const deviceDataPromise = collectDeviceData();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Device data collection timeout")), 3000); // 3s timeout
        });
        deviceDataResult = await Promise.race([deviceDataPromise, timeoutPromise]);
      } catch (error) {
        console.warn("Device data collection failed or timed out:", error);
        // Minimal fallback for deviceData
        deviceDataResult = {
          deviceData: {
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
            timestamp: new Date().toISOString(),
            error: `Collection failed: ${error instanceof Error ? error.message : String(error)}`,
          },
          fingerprint: { // fingerprint.js might provide this structure
            visitorId: "fallback_id_client_timeout",
          },
        };
      }

      // Prepare history for the API call
      const historyToSend = messages.map(msg => ({
        ...msg,
        sender: msg.sender === "user" ? "user" : "bot" 
      }));

      // Send the message to the new API route
      const response = await fetch("/api/chat/n8n", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: textToSend,
          history: historyToSend,
          deviceData: deviceDataResult,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error fetching response from server" }))
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }

      const responseData = await response.json();

      // Create a new message from the bot
      const botMessage: Message = {
        id: uuidv4(),
        content: responseData.message,
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

    // Collect device data (também para envio de imagem, se relevante para o endpoint)
    let deviceDataResult = {};
    try {
      const deviceDataPromise = collectDeviceData();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Device data collection timeout")), 3000);
      });
      deviceDataResult = await Promise.race([deviceDataPromise, timeoutPromise]);
    } catch (error) {
      console.warn("Device data collection for image failed or timed out:", error);
      deviceDataResult = { // Fallback
        deviceData: { userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A', timestamp: new Date().toISOString(), error: "Collection failed" },
        fingerprint: { visitorId: "fallback_id_client_timeout_img" },
      };
    }

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
      // Send the image to the API - Se este endpoint também for para n8n e precisar de deviceData,
      // a função sendImage em api-service.ts precisaria ser ajustada ou uma nova rota criada.
      // Por agora, sendImage continua como estava, mas adicionamos a coleta de deviceData acima
      // caso você decida integrá-lo.
      const response = await sendImage(file) // Esta chamada não envia deviceData por padrão

      // Se você quiser que sendImage também envie deviceData no novo formato para um endpoint n8n:
      // const formData = new FormData();
      // formData.append("image", file);
      // const n8nImagePayload = [{
      //   image_name: file.name, // ou outros metadados da imagem
      //   deviceData: deviceDataResult,
      //   // history: historyToSend, // se relevante
      // }];
      // formData.append("payload", JSON.stringify(n8nImagePayload));
      // const response = await fetch("/api/chat/n8n/image", { // Exemplo de nova rota
      //   method: "POST",
      //   body: formData,
      // });
      // const responseData = await response.json();
      // content: responseData.message,


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

  const handlePromptSuggestionClick = (promptText: string) => {
    setCurrentPromptText(promptText);
    // Opcional: focar no input bar. Isso pode exigir uma ref para o input no InputBar e passá-la para cá.
    // Por enquanto, vamos apenas popular o texto.
  };

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
                  <Button variant="ghost" size="sm" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                    PROMPTS
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    <h4 className="font-medium">Prompt Suggestions</h4>
                    <div className="space-y-2 text-sm">
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handlePromptSuggestionClick("Create a post about the benefits of daily meditation")}
                      >
                        Create a post about the benefits of daily meditation
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handlePromptSuggestionClick("Generate 5 content ideas for my natural products brand")}
                      >
                        Generate 5 content ideas for my natural products brand
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handlePromptSuggestionClick("Write a caption for a product launch photo")}
                      >
                        Write a caption for a product launch photo
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handlePromptSuggestionClick("Create a complete sales funnel for [product/niche], including viral content ideas to attract leads (Reels, Twitter), nurturing content (emails, YouTube), and high-converting copy for the sales page. For each stage, provide ready-to-use examples.")}
                      >
                        Create a complete sales funnel for [product/niche]...
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handlePromptSuggestionClick("Give me 5 viral content ideas for Instagram Reels, Twitter, and YouTube Shorts about [topic]. For each idea, provide a hook, a script outline, and a strong call to action.")}
                      >
                        Give me 5 viral content ideas for Instagram Reels, Twitter, and YouTube Shorts...
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handlePromptSuggestionClick("Analyze and optimize this text to boost conversion and virality, adapting it for Reels, Sales Page, and Twitter. For each format, suggest an A/B variation. Keep your response focused on digital marketing and copywriting best practices.")}
                      >
                        Analyze and optimize this text to boost conversion and virality...
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handlePromptSuggestionClick("Develop a launch campaign for [product/service] using Instagram Reels, Twitter threads, and a YouTube video. For each channel, provide an engaging hook, an outline for the main content, and a persuasive CTA designed to drive early sales or sign-ups.")}
                      >
                        Develop a launch campaign for [product/service]...
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handlePromptSuggestionClick("Suggest an irresistible lead magnet idea for [target audience/niche], and create a 3-step email nurturing sequence to warm up new leads. For each email, include a subject line, opening, value-driven body, and CTA.")}
                      >
                        Suggest an irresistible lead magnet idea for [target audience/niche]...
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handlePromptSuggestionClick("Write a high-engagement Twitter/X thread for [topic] that is designed to go viral and generate discussion. Begin with an attention-grabbing statement, build curiosity, and finish with a CTA that drives replies, retweets, or clicks.")}
                      >
                        Write a high-engagement Twitter/X thread for [topic]...
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handlePromptSuggestionClick("Create a storytelling campaign about [brand story/product transformation], adapting the narrative for Instagram Reels, YouTube Shorts, and an email broadcast. For each format, deliver a unique angle, opening line, and ending CTA to encourage shares or responses.")}
                      >
                        Create a storytelling campaign about [brand story/product transformation]...
                      </p>
                      <p
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handlePromptSuggestionClick("Write a compelling offer announcement for [special deal/product launch], adapting the copy for a Sales Page headline, a Reels script, and a Twitter post. Make sure each version uses a powerful hook, clear value proposition, and urgency-driven CTA.")}
                      >
                        Write a compelling offer announcement for [special deal/product launch]...
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <ChatWindow 
            messages={messages} 
            isLoading={isLoading} 
            userId={userId}
          />
          <InputBar 
            onSendMessage={handleSendMessage} 
            onSendImage={handleSendImage} 
            isLoading={isLoading} 
            inputValue={currentPromptText}
            onInputChange={setCurrentPromptText}
          />
          {isLoading && (
            <div className="text-center mt-2 text-sm text-gray-500">Generating personalized content...</div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
