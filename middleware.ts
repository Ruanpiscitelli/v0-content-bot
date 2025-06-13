import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

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

// Define protected routes that require authentication
const protectedRoutes = [
  "/chat",
  "/profile",
  "/gallery",
  "/ideas",
  "/calendar",
  "/settings",
  "/security",
  "/create",
  "/trends",
  "/tools",
  "/notifications",
]

// Define admin routes that require special authentication
const adminRoutes = ["/admin"]

// Define routes that should redirect to chat page if user is already logged in
// Note: reset-password is removed from this list because we need to allow logged in users to reset their password
const authRoutes = ["/login", "/signup", "/forgot-password"]

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  try {
    // Create a Supabase client for the middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            req.cookies.set({
              name,
              value,
              ...options,
            })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            req.cookies.set({
              name,
              value: '',
              ...options,
            })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Check if we have a session - using getUser() as recommended by Supabase docs
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const path = req.nextUrl.pathname

    // Check if the path is a public route
    const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))

    // Check if the path is a protected route
    const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`))

    // Check if the path is an auth route (login, signup, etc.)
    const isAuthRoute = authRoutes.some((route) => path === route || path.startsWith(`${route}/`))

    // Check if the path is an admin route
    const isAdminRoute = adminRoutes.some((route) => path === route || path.startsWith(`${route}/`))

    // Handle API routes separately - we'll let them handle their own auth
    if (path.startsWith("/api/")) {
      return res
    }

    // If trying to access admin routes
    if (isAdminRoute) {
      // Admin routes require authentication
      if (!user) {
        const redirectUrl = new URL("/login", req.url)
        redirectUrl.searchParams.set("redirectUrl", req.url)
        return NextResponse.redirect(redirectUrl)
      }
      
      // For now, all authenticated users can access admin panel
      // In the future, you could add role-based checks here
      return res
    }

    // If user is not logged in and trying to access a protected route
    if (!user && isProtectedRoute) {
      // Create a URL to redirect to after login
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirectUrl", req.url)

      return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in and trying to access an auth route
    if (user && isAuthRoute) {
      // Redirect to chat page
      return NextResponse.redirect(new URL("/chat", req.url))
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
