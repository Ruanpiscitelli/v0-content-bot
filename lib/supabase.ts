import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const getSupabase = () => {
  if (!supabaseInstance && typeof window !== "undefined") {
    try {
      supabaseInstance = createClientComponentClient<Database>({
        options: {
          auth: {
            flowType: "pkce",
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
          },
        },
      })
    } catch (error) {
      console.error("Error creating Supabase client:", error)
      return null
    }
  }
  return supabaseInstance
}

// For backward compatibility
export const supabase = () => getSupabase()
