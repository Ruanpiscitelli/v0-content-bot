"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { useStore } from "@/lib/store"

type ChatMessage = {
  id: string
  user_id: string
  content: string
  is_user_message: boolean
  created_at: string
}

export function useChat(userId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { hasSubscription } = useStore()

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    // TODO: Implement when chat_messages table is created
    // const fetchMessages = async () => {
    //   try {
    //     setLoading(true)
    //     const { data, error } = await supabase
    //       .from("chat_messages")
    //       .select("*")
    //       .eq("user_id", userId)
    //       .order("created_at", { ascending: true })

    //     if (error) {
    //       throw error
    //     }

    //     setMessages(data || [])
    //   } catch (err) {
    //     console.error("Error fetching messages:", err)
    //     setError(err instanceof Error ? err : new Error("Failed to fetch messages"))
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    // fetchMessages()

    // Set up real-time subscription - commented out until table exists
    // const subscription = supabase
    //   .channel("chat_messages_changes")
    //   .on(
    //     "postgres_changes",
    //     {
    //       event: "INSERT",
    //       schema: "public",
    //       table: "chat_messages",
    //       filter: `user_id=eq.${userId}`,
    //     },
    //     (payload) => {
    //       setMessages((prev) => [...prev, payload.new as ChatMessage])
    //     },
    //   )
    //   .subscribe()

    // return () => {
    //   supabase.removeChannel(subscription)
    // }
  }, [userId])

  const sendMessage = async (content: string) => {
    if (!userId) return { success: false, error: new Error("User not authenticated") }
    if (!hasSubscription) return { success: false, error: new Error("Subscription required") }

    try {
      // TODO: Implement when chat_messages table is created
      // const newMessage = {
      //   user_id: userId,
      //   content,
      //   is_user_message: true,
      //   created_at: new Date().toISOString(),
      // }

      // const { data, error } = await supabase.from("chat_messages").insert([newMessage]).select().single()

      // if (error) {
      //   throw error
      // }

      // Simulate a response from the system
      // setTimeout(async () => {
      //   const responseMessage = {
      //     user_id: userId,
      //     content: `Response to: ${content}`,
      //     is_user_message: false,
      //     created_at: new Date().toISOString(),
      //   }

      //   await supabase.from("chat_messages").insert([responseMessage])
      // }, 1000)

      // Return mock success for now
      return { success: true, data: null }
    } catch (err) {
      console.error("Error sending message:", err)
      return {
        success: false,
        error: err instanceof Error ? err : new Error("Failed to send message"),
      }
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
  }
}
