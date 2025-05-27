"use client"

import type React from "react"
import Script from "next/script"
import AppSidebar from "@/components/app-sidebar"
import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Listen for custom event from sidebar
  useEffect(() => {
    const handleSidebarCollapse = (e: CustomEvent) => {
      setIsSidebarCollapsed(e.detail.collapsed)
    }

    window.addEventListener("sidebar-collapsed" as any, handleSidebarCollapse)

    return () => {
      window.removeEventListener("sidebar-collapsed" as any, handleSidebarCollapse)
    }
  }, [])

  return (
    <div className={inter.className}>
      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-WRNPENZXXG" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WRNPENZXXG', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <AppSidebar />
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "md:ml-16" : "md:ml-64"} relative overflow-hidden`}>
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </main>
      </div>
      <Toaster richColors />
    </div>
  )
}
