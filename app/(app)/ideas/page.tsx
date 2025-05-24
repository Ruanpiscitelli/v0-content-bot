import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import IdeasPageClient from "./IdeasPageClient"

export const dynamic = "force-dynamic"

export default async function IdeasPage() {
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

    return <IdeasPageClient userId={user.id} />
  } catch (error) {
    console.error("Error in IdeasPage:", error)
    // In case of error, redirect to login
    redirect("/login?error=server_error")
  }
}
