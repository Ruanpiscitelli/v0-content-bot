import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Virallyzer - Assistente de Conteúdo",
  description: "Sua assistente Expert em Conteúdo para criação de conteúdo viral e engajamento nas redes sociais",
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-white">{children}</div>
}
