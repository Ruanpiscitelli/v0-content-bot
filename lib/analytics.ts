/**
 * Analytics utility functions for tracking page views and events
 */

// Track a virtual page view in Google Analytics
export function trackPageView(path: string, title?: string) {
  if (typeof window !== "undefined" && window.gtag) {
    // Construct the full path with leading slash if not present
    const fullPath = path.startsWith("/") ? path : `/${path}`

    window.gtag("config", "G-WRNPENZXXG", {
      page_path: fullPath,
      page_title: title || document.title,
    })

    console.log(`📊 Page view tracked: ${fullPath}`)
  }
}

// Track a custom event in Google Analytics
export function trackEvent(eventName: string, eventParams: Record<string, any> = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams)
    console.log(`📊 Event tracked: ${eventName}`, eventParams)
  }
}

// Define types for window with gtag
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void
    dataLayer: any[]
  }
}
