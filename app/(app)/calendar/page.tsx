import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import CalendarClientPage from "./CalendarClientPage"
import type { Database } from "@/types/supabase"

export const dynamic = "force-dynamic"

export default async function CalendarPage() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient<Database>({
      cookies: () => cookieStore,
    })

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
