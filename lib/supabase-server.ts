import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export const createServerClient = () => {
  const cookieStore = cookies(); // Get the cookie store
  return createServerComponentClient<Database>({
    cookies: () => cookieStore, // Pass it as a function
  })
}
