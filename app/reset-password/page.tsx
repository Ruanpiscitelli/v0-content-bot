"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Loader2, Lock, CheckCircle, ArrowLeft, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { recordAuthEvent } from "@/lib/auth-events-service"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const router = useRouter()

  // Check if we have a session with a recovery token
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking session:", error.message)
          setError("Unable to verify your session. Please try the reset password process again.")
          setSessionChecked(true)
          return
        }

        // If no session or no access token, show error
        if (!data.session) {
          setError("Your password reset link has expired or is invalid. Please request a new one.")
          setSessionChecked(true)
          return
        }

        setHasSession(true)
        setSessionChecked(true)
      } catch (err) {
        console.error("Unexpected error checking session:", err)
        setError("An unexpected error occurred. Please try again.")
        setSessionChecked(true)
      }
    }

    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id

      // Record password reset attempt
      recordAuthEvent("password_reset_success", "pending", userId)

      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        // Record failed password reset
        recordAuthEvent("password_reset_failed", "failed", userId, {
          error: error.message,
        })
        return
      }

      // Record successful password reset
      recordAuthEvent("password_reset_success", "success", userId)

      setSuccess(true)
      setLoading(false)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
      setLoading(false)
      // Record failed password reset
      recordAuthEvent("password_reset_failed", "failed", null, {
        error: "Unexpected error",
      })
    }
  }

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#5281EE]/10 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#5281EE]" />
          <p className="mt-4 text-gray-600">Verifying your reset link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#5281EE]/10 to-gray-100">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5281EE]/20 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-64 h-64 bg-[#5281EE]/30 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-32 right-1/3 w-80 h-80 bg-[#5281EE]/20 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Brand header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5281EE] to-[#5281EE]/80">
                Virallyzer
              </span>
            </h1>
            <p className="text-gray-600">Your AI-powered content creation platform</p>
          </div>

          {/* Card container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Card header */}
            <div className="px-6 py-5 bg-gradient-to-r from-[#5281EE] to-[#5281EE]/80 text-white">
              <h2 className="text-xl font-semibold">Create new password</h2>
              <p className="text-white/90 text-sm mt-1">Enter a new password for your account</p>
            </div>

            {/* Invalid session state */}
            {!hasSession && (
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Invalid or expired link</h3>
                <p className="text-gray-600 mb-6">
                  Your password reset link has expired or is invalid. Please request a new one.
                </p>
                <Link href="/forgot-password" className="text-[#5281EE] hover:text-[#5281EE]/80 text-sm font-medium">
                  Request a new password reset link
                </Link>
              </div>
            )}

            {/* Success state */}
            {hasSession && success && (
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Password updated!</h3>
                <p className="text-gray-600 mb-6">
                  Your password has been successfully updated. You'll be redirected to the login page in a moment.
                </p>
                <Link href="/login" className="text-[#5281EE] hover:text-[#5281EE]/80 text-sm font-medium">
                  Go to login now
                </Link>
              </div>
            )}

            {/* Form state */}
            {hasSession && !success && (
              <>
                {/* Error message */}
                {error && (
                  <div className="mx-6 mt-6 px-4 py-3 bg-red-50 border-l-4 border-red-500 rounded-md animate-fade-in">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      New password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-10 w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-[#5281EE] focus:ring-2 focus:ring-[#5281EE]/30 transition-all duration-200"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Password must be at least 6 characters</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm new password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="pl-10 w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-[#5281EE] focus:ring-2 focus:ring-[#5281EE]/30 transition-all duration-200"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative flex w-full justify-center items-center rounded-lg bg-gradient-to-r from-[#5281EE] to-[#5281EE]/90 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-[#5281EE]/90 hover:to-[#5281EE] focus:outline-none focus:ring-2 focus:ring-[#5281EE] focus:ring-offset-2 disabled:opacity-70 transition-all duration-200"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating password...
                        </>
                      ) : (
                        <>Update password</>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <Link
                href="/login"
                className="flex items-center justify-center text-sm text-[#5281EE] hover:text-[#5281EE]/80 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
