import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const headers = new Headers(request.headers)

  // Try to get IP from various headers
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0] ||
    headers.get("x-real-ip") ||
    request.headers.get("x-client-ip") ||
    "0.0.0.0" // Fallback

  return NextResponse.json({ ip })
}
