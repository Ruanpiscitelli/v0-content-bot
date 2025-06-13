"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { toast } from "sonner"
import { Rocket, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const [userEmail, setUserEmail] = useState<string>("")
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session || !session.user) {
          console.log("No valid session found for password reset")
          setIsValidSession(false)
          return
        }

        setUserEmail(session.user.email || "")
        setIsValidSession(true)
        console.log("Valid password reset session found for:", session.user.email)
      } catch (error) {
        console.error("Error checking session:", error)
        setIsValidSession(false)
      }
    }

    checkSession()

    // Listen for auth state changes to ensure user stays authenticated during reset
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change in reset-password:", event)
      
      if (event === "PASSWORD_RECOVERY" && session) {
        setIsValidSession(true)
        setUserEmail(session.user?.email || "")
      } else if (event === "SIGNED_OUT") {
        setIsValidSession(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const validatePassword = (password: string): string[] => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number")
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate session again before proceeding
    if (!isValidSession) {
      toast.error("Invalid session. Please request a new password reset link.")
      router.push("/forgot-password")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password strength
    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      toast.error(passwordErrors[0])
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      console.log("Password updated successfully for user:", data.user?.email)
      toast.success("Password updated successfully!")
      
      // Clear form
      setPassword("")
      setConfirmPassword("")
      
      // Redirect to login with success message
      router.push("/login?message=Password updated successfully. Please sign in with your new password.")
    } catch (error: any) {
      console.error("Password update error:", error)
      
      if (error.message?.includes("session")) {
        toast.error("Your session has expired. Please request a new password reset link.")
        router.push("/forgot-password")
      } else {
        toast.error(error.message || "Failed to update password. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="text-white">Verifying session...</div>
      </div>
    )
  }

  // Show error state if session is invalid
  if (isValidSession === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
              <h2 className="text-xl font-bold text-white mb-4">Invalid Session</h2>
              <p className="text-gray-300 mb-6">
                Your password reset session has expired or is invalid. Please request a new password reset link.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/forgot-password")}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2"
                >
                  Request New Reset Link
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50"></div>
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Reset Your Password</h1>
          <p className="text-gray-300">Enter your new password for: {userEmail}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-white">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="Enter your new password"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-300 mt-1">
                Password must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="Confirm your new password"
                required
                minLength={8}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2"
                disabled={isLoading || !password || !confirmPassword}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 