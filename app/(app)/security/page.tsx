import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import SecurityClientPage from "./SecurityClientPage"

export const dynamic = "force-dynamic"

export default async function SecurityPage() {
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

    return <SecurityClientPage userId={user.id} />
  } catch (error) {
    console.error("Error in SecurityPage:", error)
    // In case of error, redirect to login
    redirect("/login?error=server_error")
  }
}
