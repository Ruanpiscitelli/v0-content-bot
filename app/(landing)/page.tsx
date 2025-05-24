import { LandingPage } from "@/components/landing/landing-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Virallyzer - Crie conteúdo viral",
  description:
    "Virallyzer é sua plataforma de criação de conteúdo com IA para aumentar seu engajamento nas redes sociais",
}

export default function Home() {
  return <LandingPage />
}
