import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseAdmin() {
  if (supabaseAdmin) return supabaseAdmin

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase admin credentials")
  }

  supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

  return supabaseAdmin
}
