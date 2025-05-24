"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Loader2, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    const messageParam = searchParams.get('message');
    const errorParam = searchParams.get('error');
    const typeParam = searchParams.get('type') as 'success' | 'error' | null;
    const registeredParam = searchParams.get("registered");

    // Clear previous messages
    setSuccessMessage(null);
    setError(null);

    if (typeParam === 'success' && messageParam) {
      setSuccessMessage(messageParam);
    } else if (typeParam === 'error' && errorParam) {
      setError(errorParam);
    } else if (registeredParam === "true") {
      // Only show registration success if no other message (e.g. email confirmation) is present
      setSuccessMessage("Registration successful! Please sign in with your credentials.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { success, error } = await signIn(email, password, rememberMe)

      if (!success && error) {
        setError(error.message)
        setLoading(false)
        return
      }

      router.push("/dashboard")
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
              <h2 className="text-xl font-semibold">Sign in to your account</h2>
              <p className="text-[#5281EE]/90 text-sm mt-1">Access your content dashboard</p>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="mx-6 mt-6 px-4 py-3 bg-green-50 border-l-4 border-green-500 rounded-md animate-fade-in">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="mx-6 mt-6 px-4 py-3 bg-red-50 border-l-4 border-red-500 rounded-md animate-fade-in">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form className="p-6 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="pl-10 pr-10 w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-[#5281EE] focus:ring-2 focus:ring-[#5281EE]/30 transition-all duration-200"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#5281EE] focus:ring-[#5281EE] transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-[#5281EE] hover:text-[#5281EE]/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="font-medium text-[#5281EE] hover:text-[#5281EE]/80 transition-colors">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>

          {/* Additional info */}
          <p className="mt-6 text-center text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-gray-700 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-gray-700 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
