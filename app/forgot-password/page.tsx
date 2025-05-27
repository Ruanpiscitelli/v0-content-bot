"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { recordAuthEvent } from "@/lib/auth-events-service"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Record password reset request
    await recordAuthEvent("password_reset_request", "pending", null, { email })

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        // Record failed password reset request
        await recordAuthEvent("password_reset_request", "failed", null, {
          email,
          error: error.message,
        })
        return
      }

      // Record successful password reset request
      await recordAuthEvent("password_reset_request", "success", null, { email })

      setSuccess(true)
      setLoading(false)
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
      setLoading(false)
      // Record failed password reset request
      recordAuthEvent("password_reset_request", "failed", null, {
        email,
        error: "Unexpected error",
      })
    }
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
              <h2 className="text-xl font-semibold">Reset your password</h2>
              <p className="text-white/90 text-sm mt-1">We'll send you a link to reset your password</p>
            </div>

            {/* Success state */}
            {success ? (
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h3>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your
                  inbox and follow the instructions.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-[#5281EE] hover:text-[#5281EE]/80 text-sm font-medium"
                >
                  Try again with a different email
                </button>
              </div>
            ) : (
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="pl-10 w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-[#5281EE] focus:ring-2 focus:ring-[#5281EE]/30 transition-all duration-200"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Enter the email address associated with your account</p>
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
                          Sending reset link...
                        </>
                      ) : (
                        <>Send reset link</>
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
