import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// Define public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth/confirm",
  "/auth/callback",
  "/", // Landing page
]

// Define routes that should redirect to dashboard if user is already logged in
// Note: reset-password is removed from this list because we need to allow logged in users to reset their password
const authRoutes = ["/login", "/signup", "/forgot-password"]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // Create a Supabase client for the middleware
    const supabase = createMiddlewareClient({
      req,
      res,
    })

    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const path = req.nextUrl.pathname

    // Check if the path is a public route
    const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))

    // Check if the path is an auth route (login, signup, etc.)
    const isAuthRoute = authRoutes.some((route) => path === route || path.startsWith(`${route}/`))

    // Handle API routes separately - we'll let them handle their own auth
    if (path.startsWith("/api/")) {
      return res
    }

    // If user is not logged in and trying to access a protected route
    if (!session && !isPublicRoute) {
      // Create a URL to redirect to after login
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirectUrl", req.url)

      return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in and trying to access an auth route
    if (session && isAuthRoute) {
      // Redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of error, allow the request to continue
    // This prevents the middleware from blocking access in case of errors
    return res
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files like robots.txt, sitemap.xml, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|images/|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}
