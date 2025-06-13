"use client"

import { useState, useEffect } from "react"
import { getSupabase } from "@/lib/supabase"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

export type Idea = {
  id: string
  user_id: string
  title: string
  description: string | null
  category: string | null
  status: string | null
  tags?: string[]
  created_at: string | null
  updated_at: string | null
}

export type NewIdea = Omit<Idea, "id" | "user_id" | "created_at" | "updated_at">

export function useIdeas(userId: string | undefined) {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = getSupabase()

  useEffect(() => {
    if (!userId || !supabase) {
      setLoading(false)
      return
    }

    const fetchIdeas = async () => {
      try {
        setLoading(true)

        // Get ideas from Supabase
        const { data, error } = await supabase
          .from("ideas")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        // Transform the data to match our expected format
        const formattedIdeas = data.map((idea) => {
          return {
            ...idea,
            tags: idea.tags || [],
            // Convert dates to Date objects for easier handling
            created_at: idea.created_at,
            updated_at: idea.updated_at,
          }
        })

        setIdeas(formattedIdeas)
      } catch (err) {
        console.error("Error fetching ideas:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch ideas"))
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()

    // Set up real-time subscription
    let channel: any = null

    if (supabase) {
      try {
        channel = supabase
          .channel("ideas_changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "ideas",
              filter: `user_id=eq.${userId}`,
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                // Fetch the complete idea with tags
                fetchIdeaWithTags(payload.new.id).then((completeIdea) => {
                  if (completeIdea) {
                    setIdeas((prev) => [completeIdea, ...prev])
                  }
                })
              } else if (payload.eventType === "UPDATE") {
                console.log("[Real-time UPDATE] Payload new ID:", payload.new.id);
                // Fetch the complete idea with tags
                fetchIdeaWithTags(payload.new.id).then((completeIdea) => {
                  console.log("[Real-time UPDATE] Complete idea fetched for update:", completeIdea);
                  if (completeIdea) {
                    setIdeas((prev) => prev.map((idea) => (idea.id === completeIdea.id ? completeIdea : idea)))
                  }
                })
              } else if (payload.eventType === "DELETE") {
                setIdeas((prev) => prev.filter((idea) => idea.id !== payload.old.id))
              }
            },
          )
          .subscribe()
      } catch (err) {
        console.error("Error setting up real-time subscription:", err)
      }
    }

    // Cleanup function
    return () => {
      if (channel && supabase) {
        try {
          supabase.removeChannel(channel)
        } catch (err) {
          console.error("Error removing channel:", err)
        }
      }
    }
  }, [userId, supabase])

  // Helper function to fetch a single idea with its tags
  const fetchIdeaWithTags = async (ideaId: string): Promise<Idea | null> => {
    if (!supabase) return null

    try {
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", ideaId)
        .single()

      if (error) {
        throw error
      }

      // Return the formatted idea
      return {
        ...data,
        tags: data.tags || [],
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    } catch (err) {
      console.error("Error fetching idea with tags:", err)
      return null
    }
  }

  // Create a new idea
  const createIdea = async (newIdea: NewIdea) => {
    if (!userId || !supabase)
      return { success: false, error: new Error("User not authenticated or Supabase not initialized") }

    try {
      const ideaId = uuidv4()
      const ideaToInsert = {
        id: ideaId,
        user_id: userId,
        title: newIdea.title,
        description: newIdea.description,
        status: newIdea.status || "draft",
        tags: newIdea.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: ideaError } = await supabase.from("ideas").insert([ideaToInsert])

      if (ideaError) {
        throw ideaError
      }

      const completeIdea = await fetchIdeaWithTags(ideaId)

      toast.success("Idea created")

      return { success: true, data: completeIdea }
    } catch (err) {
      console.error("Error creating idea:", err)
      toast.error("Error creating idea")
      return {
        success: false,
        error: err instanceof Error ? err : new Error("Failed to create idea"),
      }
    }
  }

  // Update an existing idea
  const updateIdea = async (id: string, updates: Partial<NewIdea>) => {
    if (!userId || !supabase)
      return { success: false, error: new Error("User not authenticated or Supabase not initialized") }

    try {
      // Ensure that if description is part of updates, it's correctly structured
      const updatesToApply: { [key: string]: any } = { ...updates };
      if ('description' in updates) {
        updatesToApply.description = updates.description;
      }
      updatesToApply.updated_at = new Date().toISOString();

      const { error: ideaError } = await supabase
        .from("ideas")
        .update(updatesToApply)
        .eq("id", id)
        .eq("user_id", userId)

      if (ideaError) {
        throw ideaError
      }

      // If tags are included in the updates, handle them
      if (updates.tags !== undefined) {
        await handleIdeaTags(id, updates.tags)
      }

      // Fetch the complete idea with tags
      const completeIdea = await fetchIdeaWithTags(id)

      toast.success("Idea updated")

      return { success: true, data: completeIdea }
    } catch (err) {
      console.error("Error updating idea:", err)
      toast.error("Error updating idea")
      return {
        success: false,
        error: err instanceof Error ? err : new Error("Failed to update idea"),
      }
    }
  }

  // Delete an idea
  const deleteIdea = async (id: string) => {
    if (!userId || !supabase)
      return { success: false, error: new Error("User not authenticated or Supabase not initialized") }

    try {
      // Delete the idea
      const { error } = await supabase.from("ideas").delete().eq("id", id).eq("user_id", userId) // Ensure user can only delete their own ideas

      if (error) {
        throw error
      }

      toast.success("Idea deleted")

      return { success: true }
    } catch (err) {
      console.error("Error deleting idea:", err)
      toast.error("Error deleting idea")
      return {
        success: false,
        error: err instanceof Error ? err : new Error("Failed to delete idea"),
      }
    }
  }

  // Helper function to handle idea tags
  const handleIdeaTags = async (ideaId: string, tags: string[]) => {
    if (!supabase || !userId) return

    try {
      // Update the idea directly with the tags array
      const { error } = await supabase
        .from("ideas")
        .update({
          tags: tags,
          updated_at: new Date().toISOString()
        })
        .eq("id", ideaId)
        .eq("user_id", userId)

      if (error) {
        throw error
      }
    } catch (err) {
      console.error("Error handling idea tags:", err)
      throw err
    }
  }

  // Schedule an idea
  const scheduleIdea = async (id: string, date: Date | null) => {
    console.log("[scheduleIdea] Scheduling idea ID:", id, "to date:", date ? date.toISOString() : null);
    return updateIdea(id, {
      status: date ? "scheduled" : "draft",
    })
  }

  // Get all unique tags from ideas
  const getAllTags = () => {
    const tagSet = new Set<string>()
    ideas.forEach((idea) => {
      idea.tags?.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet)
  }

  return {
    ideas,
    loading,
    error,
    createIdea,
    updateIdea,
    deleteIdea,
    scheduleIdea,
    getAllTags,
  }
}
