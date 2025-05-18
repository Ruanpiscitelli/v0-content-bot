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
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} userId={userId} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 rounded-lg p-3 max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
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
