import type { Metadata } from "next"
import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Content Trends | Virallyzer",
  description: "Descubra as tendências de conteúdo mais recentes com o Virallyzer",
}

export const dynamic = "force-dynamic"

export default async function TrendsPage() {
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

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Trends & Insights</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-500">Trends and insights feature coming soon!</p>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in TrendsPage:", error)
    // In case of error, redirect to login
    redirect("/login?error=server_error")
  }
}
