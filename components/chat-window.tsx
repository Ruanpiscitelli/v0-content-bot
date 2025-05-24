import { type RefObject, useRef } from "react"
import MessageBubble from "./message-bubble"
import type { Message } from "@/lib/types"

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
  userId: string
}

export default function ChatWindow({ messages, isLoading, userId }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-900/50 via-purple-900/50 to-indigo-900/50 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} userId={userId} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gradient-to-br from-gray-800/80 via-purple-800/80 to-indigo-800/80 backdrop-blur-lg border border-cyan-400/30 rounded-lg p-3 max-w-[80%] shadow-lg shadow-cyan-500/20">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
