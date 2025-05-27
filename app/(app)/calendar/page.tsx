import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import CalendarClientPage from "./CalendarClientPage"
import type { Database } from "@/types/supabase"

export const dynamic = "force-dynamic"

function createSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export default async function CalendarPage() {
  try {
    const supabase = createSupabaseClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If no user, redirect to login
    if (!user) {
      redirect("/login")
    }

    return <CalendarClientPage userId={user.id} />
  } catch (error) {
    console.error("Error in CalendarPage:", error)
    // In case of error, redirect to login
    redirect("/login?error=server_error")
  }
}
