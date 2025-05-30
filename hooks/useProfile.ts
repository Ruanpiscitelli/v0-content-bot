"use client"

import { useState, useEffect } from "react"
import { getSupabase } from "@/lib/supabase"
import { useAuth } from "./useAuth"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabaseClient = getSupabase()

  useEffect(() => {
    if (!user?.id || !supabaseClient) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        if (error) {
          // Se for erro de "Row not found", não é um erro crítico
          if (error.code === 'PGRST116') {
            console.log("Profile not found, creating one...")
            // Tentar criar um perfil automaticamente
            const { data: newProfile, error: createError } = await supabaseClient
              .from("profiles")
              .insert({
                id: user.id,
                full_name: null,
                username: null,
                bio: null,
                avatar_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select()
              .maybeSingle()

            if (createError) {
              console.error("Error creating profile:", createError)
              setError(null) // Não definir erro crítico
              setProfile(null)
            } else {
              console.log("Profile created successfully:", newProfile)
              setProfile(newProfile)
            }
          } else {
            console.error("Error fetching profile:", error)
            setError(error.message)
            setProfile(null)
          }
        } else {
          setProfile(data)
        }
      } catch (err) {
        console.error("Error in fetchProfile:", err)
        // Não definir erro crítico para não quebrar a aplicação
        setError(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user?.id, supabaseClient])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id || !supabaseClient) {
      return { success: false, error: "User not authenticated" }
    }

    try {
      const { data, error } = await supabaseClient
        .from("profiles")
        .upsert({ 
          id: user.id,
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .select()
        .maybeSingle()

      if (error) {
        console.error("Error updating profile:", error)
        return { success: false, error: error.message }
      }

      setProfile(data)
      return { success: true, data }
    } catch (err) {
      console.error("Error in updateProfile:", err)
      return { success: false, error: "Failed to update profile" }
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: () => {
      if (user?.id && supabaseClient) {
        const fetchProfile = async () => {
          try {
            setLoading(true)
            setError(null)

            const { data, error } = await supabaseClient
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .maybeSingle()

            if (error) {
              if (error.code === 'PGRST116') {
                // Tentar criar um perfil automaticamente
                const { data: newProfile, error: createError } = await supabaseClient
                  .from("profiles")
                  .insert({
                    id: user.id,
                    full_name: null,
                    username: null,
                    bio: null,
                    avatar_url: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })
                  .select()
                  .maybeSingle()

                if (createError) {
                  console.error("Error creating profile:", createError)
                  setError(null)
                  setProfile(null)
                } else {
                  setProfile(newProfile)
                }
              } else {
                console.error("Error fetching profile:", error)
                setError(error.message)
                setProfile(null)
              }
            } else {
              setProfile(data)
            }
          } catch (err) {
            console.error("Error in fetchProfile:", err)
            setError("Failed to fetch profile")
            setProfile(null)
          } finally {
            setLoading(false)
          }
        }

        fetchProfile()
      }
    },
  }
} 