import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Database } from "@/types/supabase"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient<Database>({
      cookies: () => cookieStore,
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Se o usuário está logado, mostramos a tela "Coming Soon"
    // ... restante do código da tela "Coming Soon" ...
  } catch (error) {
    console.error("Error in DashboardPage:", error)
    // In case of error, redirect to login
    redirect("/login?error=server_error")
  }
}
