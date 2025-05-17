"use client"

import type React from "react"
import "../globals.css"
import Script from "next/script"
import AppSidebar from "@/components/app-sidebar"
import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

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
      <div className="flex min-h-screen bg-gray-50">
        <AppSidebar />
        <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "md:ml-16" : "md:ml-64"}`}>
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}
