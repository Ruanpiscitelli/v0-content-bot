import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import type { Database } from "@/types/supabase"

export const createServerClient = () => {
  const cookieStore = (cookies() as unknown as UnsafeUnwrappedCookies); // Get the cookie store
  return createServerComponentClient<Database>({
    cookies: () => cookieStore, // Pass it as a function
  })
}
