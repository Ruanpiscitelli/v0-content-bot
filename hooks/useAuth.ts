"use client"

import { useState, useEffect } from "react"
import { getSupabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { recordAuthEvent } from "@/lib/auth-events-service"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabaseClient = getSupabase()

  useEffect(() => {
    // Get the current session
    const getSession = async () => {
      if (!supabaseClient) return

      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession()

      if (error) {
        console.error("Error getting session:", error)
      }

      setUser(session?.user || null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    if (!supabaseClient) return () => {}

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setLoading(false)
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabaseClient])

  const signIn = async (email, password, rememberMe = false) => {
    if (!supabaseClient) return { success: false, error: new Error("Supabase client not initialized") }

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: rememberMe,
        },
      })

      if (error) {
        // Registrar tentativa de login com falha
        try {
          await recordAuthEvent("login_failed", "failed", null, {
            email,
            error: error.message,
          })
        } catch (recordError) {
          console.error("Error recording login failure:", recordError)
        }

        return { success: false, error }
      }

      // Registrar login bem-sucedido
      try {
        await recordAuthEvent("login_success", "success", data.user?.id, {
          email,
        })
      } catch (recordError) {
        console.error("Error recording successful login:", recordError)
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error }
    }
  }

  const signUp = async (email, password, fullName, phone = "") => {
    if (!supabaseClient) return { success: false, error: new Error("Supabase client not initialized") }

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      })

      if (error) {
        // Registrar tentativa de registro com falha
        try {
          await recordAuthEvent("signup_failed", "failed", null, {
            email,
            error: error.message,
          })
        } catch (recordError) {
          console.error("Error recording signup failure:", recordError)
        }

        return { success: false, error }
      }

      // Registrar registro bem-sucedido
      try {
        await recordAuthEvent("signup_success", "success", data.user?.id, {
          email,
        })
      } catch (recordError) {
        console.error("Error recording successful signup:", recordError)
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error }
    }
  }

  const signOut = async () => {
    if (!supabaseClient) return { success: false, error: new Error("Supabase client not initialized") }

    try {
      // Get user ID before signing out
      const { data: sessionData } = await supabaseClient.auth.getSession()
      const userId = sessionData?.session?.user?.id

      // Record logout event before signing out
      if (userId) {
        try {
          await recordAuthEvent("logout", "success", userId)
        } catch (recordError) {
          console.error("Error recording logout event:", recordError)
        }
      }

      const { error } = await supabaseClient.auth.signOut()

      if (error) {
        return { success: false, error }
      }

      router.push("/login")
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
