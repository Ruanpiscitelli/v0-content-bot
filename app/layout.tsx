import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Virallyzer",
  description: "Sua assistente Expert em Conteúdo para criação de conteúdo viral e engajamento nas redes sociais",
    generator: 'v0.dev',
    icons: {
      icon: '/images/favicon.png',
    },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
