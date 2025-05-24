"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return
    }

    const media = window.matchMedia(query)

    // Update the state initially
    setMatches(media.matches)

    // Define a callback function to handle changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add the listener to handle changes
    media.addEventListener("change", listener)

    // Clean up the listener when the component unmounts
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}
