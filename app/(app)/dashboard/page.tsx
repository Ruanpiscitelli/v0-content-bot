import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import DashboardClient from "./DashboardClient"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const supabase = createServerClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session, redirect to login
    if (!session) {
      redirect("/login")
    }

    return <DashboardClient userId={session.user.id} />
  } catch (error) {
    console.error("Error in DashboardPage:", error)
    // In case of error, redirect to login
    redirect("/login?error=server_error")
  }
}
