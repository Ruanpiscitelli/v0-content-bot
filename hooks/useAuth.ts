"use client"

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { User, AuthError } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

interface AuthResponse {
  success: boolean
  error?: AuthError | null
  user?: User | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string, rememberMe?: boolean): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // If rememberMe is true, use a longer session duration
          ...(rememberMe && {
            data: {
              remember_me: true
            }
          })
        }
      })

      if (error) {
        return { success: false, error }
      }

      return { success: true, user: data.user }
    } catch (error) {
      return { 
        success: false, 
        error: error as AuthError 
      }
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    fullName?: string, 
    phone?: string
  ): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        return { success: false, error }
      }

      return { success: true, user: data.user }
    } catch (error) {
      return { 
        success: false, 
        error: error as AuthError 
      }
    }
  }

  const signOut = async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error }
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error as AuthError 
      }
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
