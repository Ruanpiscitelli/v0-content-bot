import type { Metadata } from "next"
import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { ComingSoonPlaceholder } from '@/components/ui/ComingSoonPlaceholder'

export const metadata: Metadata = {
  title: "Content Trends | Virallyzer",
  description: "Descubra as tendências de conteúdo mais recentes com o Virallyzer",
}

export const dynamic = "force-dynamic"

export default function TrendsPage() {
  return <ComingSoonPlaceholder />;
}
