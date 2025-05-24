import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Database } from "@/types/supabase"
import { ComingSoonPlaceholder } from '@/components/ui/ComingSoonPlaceholder'

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  return <ComingSoonPlaceholder />;
}
