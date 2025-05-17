import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import SettingsClientPage from "./SettingsClientPage"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
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

    return <SettingsClientPage userId={user.id} />
  } catch (error) {
    console.error("Error in SettingsPage:", error)
    // In case of error, redirect to login
    redirect("/login?error=server_error")
  }
}
