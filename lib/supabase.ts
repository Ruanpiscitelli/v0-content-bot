import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

export const getSupabase = () => {
  if (!supabaseInstance && typeof window !== "undefined") {
    try {
      supabaseInstance = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    } catch (error) {
      console.error("Error creating Supabase client:", error)
      return null
    }
  }
  return supabaseInstance
}

// For backward compatibility
export const supabase = () => getSupabase()
