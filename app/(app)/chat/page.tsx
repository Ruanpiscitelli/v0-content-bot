import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ChatInterface from "@/components/chat-interface"
import type { Database } from "@/types/supabase"

export const dynamic = "force-dynamic"

export default async function ChatPage() {
  try {
    const supabase = createServerComponentClient<Database>({
      cookies: cookies,
    })

    // Get the current user securely
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If no user, redirect to login
    if (!user) {
      redirect("/login")
    }

    return <ChatInterface userId={user.id} />
  } catch (error) {
    console.error("Error in ChatPage:", error)
    // In case of error, redirect to login
    redirect("/login?error=server_error")
  }
}
