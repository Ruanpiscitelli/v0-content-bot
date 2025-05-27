import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import ProfilePageClient from "./ProfilePageClient"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  try {
    const supabase = await createServerClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // If no user, redirect to login
    if (!user) {
      redirect("/login")
    }

    return <ProfilePageClient userId={user.id} />
  } catch (error) {
    console.error("Error in ProfilePage:", error)
    // In case of error, redirect to login
    redirect("/login?error=server_error")
  }
}
