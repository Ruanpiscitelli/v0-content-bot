"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export type AuthEventType =
  | "sign_in"
  | "sign_up"
  | "sign_out"
  | "password_reset"
  | "email_change"
  | "phone_change"
  | "login_attempt"
  | "login_success"
  | "login_failed"
  | "password_reset_request"
  | "password_reset_success"
  | "password_reset_failed"
  | "password_change_success"
  | "password_change_failed"
  | "signup_attempt"
  | "signup_success"
  | "signup_failed"
  | "logout"

export type AuthEvent = Database["public"]["Tables"]["auth_events"]["Row"]

async function createSupabaseClient() {
  const cookieStore = await cookies();
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

export async function getUserAuthEvents(
  userId: string,
  limit: number,
  page: number,
  eventTypes?: AuthEventType[],
): Promise<{ events: AuthEvent[]; error: string | null }> {
  try {
    const supabase = await createSupabaseClient();

    let query = supabase
      .from("auth_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1)

    if (eventTypes && eventTypes.length > 0) {
      query = query.in("event_type", eventTypes)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching auth events:", error)
      return { events: [], error: "Failed to fetch auth events" }
    }

    return { events: data || [], error: null }
  } catch (error) {
    console.error("Unexpected error fetching auth events:", error)
    return { events: [], error: "An unexpected error occurred" }
  }
}

export async function recordAuthEvent(
  eventType: AuthEventType,
  status = "success",
  userId?: string,
  metadata: Record<string, any> = {},
  ipAddress?: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createSupabaseClient();

    // Se userId não foi fornecido, tente obter da sessão atual
    let userIdToUse = userId

    if (!userIdToUse) {
      // Obter o usuário atual da sessão
      const {
        data: { user },
      } = await supabase.auth.getUser()
      userIdToUse = user?.id
    }

    const { error } = await supabase.from("auth_events").insert({
      user_id: userIdToUse || null,
      event_type: eventType,
      status,
      metadata,
      ip_address: ipAddress || null,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error recording auth event:", error)
      return { success: false, error: "Failed to record auth event" }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error("Unexpected error recording auth event:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
