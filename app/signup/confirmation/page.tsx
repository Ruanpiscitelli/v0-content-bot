"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Rocket, Mail, RefreshCw, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

function SignupConfirmationContent() {
  const [email, setEmail] = useState("")
  const [isResending, setIsResending] = useState(false)
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error("Email not found. Please try signing up again.")
      return
    }

    setIsResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      })

      if (error) {
        throw error
      }

      toast.success("Confirmation email sent again!")
    } catch (error: any) {
      console.error('Error resending confirmation:', error)
      toast.error(error.message || "Failed to resend confirmation email")
    } finally {
      setIsResending(false)
    }
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
          <h1 className="text-3xl font-black text-white mb-2">Check Your Email</h1>
          <p className="text-gray-300">We've sent you a confirmation link</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-400" />
            </div>

            <h2 className="text-xl font-bold text-white mb-4">
              Almost there!
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <p>
                We sent a confirmation email to:
              </p>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="font-mono text-cyan-400 break-all">
                  {email || "your email address"}
                </p>
              </div>
              
              <p className="text-sm">
                Click the link in the email to activate your account and start creating amazing content!
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <CheckCircle className="w-4 h-4" />
                <span>Check your inbox and spam folder</span>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-gray-400 mb-3">
                  Didn't receive the email?
                </p>
                <Button
                  onClick={handleResendConfirmation}
                  disabled={isResending || !email}
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend confirmation email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm border-t border-white/10 pt-4">
            <span className="text-gray-300">Want to try a different email? </span>
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign up again
            </Link>
          </div>

          <div className="mt-3 text-center text-sm">
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SignupConfirmationContent />
    </Suspense>
  )
}