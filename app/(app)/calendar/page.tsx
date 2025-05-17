import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import CalendarClientPage from "./CalendarClientPage"

export const dynamic = "force-dynamic"

export default async function CalendarPage() {
  try {
    const supabase = createServerClient()

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
