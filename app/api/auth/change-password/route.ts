import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"
import { recordAuthEvent } from "@/lib/auth-events-service"

function createSupabaseClient() {
  const cookieStorePromise = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookieStorePromise;
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookieStorePromise.then(cookieStore => {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          });
        },
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      )
    }

    // Get user email from profile or auth
    const userEmail = user.email
    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      )
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: currentPassword
    })

    if (signInError) {
      // Record failed password change attempt
      await recordAuthEvent("password_change_failed", "failed", user.id, {
        error: "Invalid current password"
      })
      
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      // Record failed password change
      await recordAuthEvent("password_change_failed", "failed", user.id, {
        error: updateError.message
      })
      
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      )
    }

    // Record successful password change
    await recordAuthEvent("password_change_success", "success", user.id)

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 