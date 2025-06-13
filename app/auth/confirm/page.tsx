"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

function EmailConfirmationContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your email...")
  const [confirmationType, setConfirmationType] = useState<"email" | "recovery" | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get token hash and type from URL parameters
        const tokenHash = searchParams.get("token_hash")
        const type = searchParams.get("type") as "email" | "recovery" | null
        
        console.log("Confirmation parameters:", { tokenHash, type })
        
        if (tokenHash && type) {
          setConfirmationType(type)
          
          if (type === "recovery") {
            setMessage("Verifying password reset link...")
          } else {
            setMessage("Verifying your email...")
          }

          // Use verifyOtp with token_hash for PKCE flow
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type,
          })

          if (error) {
            console.error("Verification error:", error)
            setStatus("error")
            if (type === "recovery") {
              setMessage("Invalid or expired password reset link. Please request a new one.")
            } else {
              setMessage("There was an error confirming your email. The link may have expired.")
            }
          } else {
            setStatus("success")
            if (type === "recovery") {
              setMessage("Password reset link verified! You can now set your new password.")
            } else {
              setMessage("Your email has been confirmed successfully!")
            }
          }
        } else {
          // Check if we already have a session (for backwards compatibility)
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession()

          if (sessionError) {
            console.error("Session error:", sessionError)
            setStatus("error")
            setMessage("There was an error confirming your email. Please try again.")
            return
          }

          if (session) {
            setStatus("success")
            setMessage("Your email has been confirmed successfully!")
            setConfirmationType("email")
          } else {
            setStatus("error")
            setMessage("No confirmation token found. Please check your email for the confirmation link.")
          }
        }
      } catch (error) {
        console.error("Error in email confirmation process:", error)
        setStatus("error")
        setMessage("An unexpected error occurred. Please try again or contact support.")
      }
    }

    confirmEmail()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session?.user?.email)
      
      if (event === "PASSWORD_RECOVERY") {
        setConfirmationType("recovery")
        setStatus("success")
        setMessage("Password reset link verified! You can now set your new password.")
      } else if (event === "SIGNED_IN" && confirmationType !== "recovery") {
        setStatus("success")
        setMessage("Your email has been confirmed successfully!")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, searchParams, router, confirmationType])

  const handleContinue = () => {
    if (confirmationType === "recovery") {
      router.push("/reset-password")
    } else {
      router.push("/chat")
    }
  }

  const handleRetry = () => {
    if (confirmationType === "recovery") {
      router.push("/forgot-password")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {confirmationType === "recovery" ? "Password Reset" : "Email Confirmation"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && confirmationType === "recovery" && "Please wait while we verify your password reset link."}
            {status === "loading" && confirmationType !== "recovery" && "Please wait while we verify your email address."}
            {status === "success" && confirmationType === "recovery" && "Your password reset link is valid."}
            {status === "success" && confirmationType !== "recovery" && "Your account is now active."}
            {status === "error" && "We encountered an issue with your confirmation."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
          {status === "loading" && <Loader2 className="h-16 w-16 animate-spin text-[#5281EE]" />}
          {status === "success" && <CheckCircle2 className="h-16 w-16 text-green-500" />}
          {status === "error" && <XCircle className="h-16 w-16 text-red-500" />}
          <p className="text-gray-600">{message}</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "success" && (
            <Button onClick={handleContinue} className="bg-[#5281EE] hover:bg-[#3a6eea]">
              {confirmationType === "recovery" ? "Set New Password" : "Continue to Dashboard"}
            </Button>
          )}
          {status === "error" && (
            <div className="flex flex-col space-y-2">
              <Button onClick={handleRetry} className="bg-[#5281EE] hover:bg-[#3a6eea]">
                {confirmationType === "recovery" ? "Request New Reset Link" : "Return to Login"}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Need help?{" "}
                <Link href="/contact" className="text-[#5281EE] hover:underline">
                  Contact support
                </Link>
              </p>
            </div>
          )}
          {status === "loading" && <p className="text-sm text-gray-500">This may take a few moments...</p>}
        </CardFooter>
      </Card>
    </div>
  )
}

export default function EmailConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#5281EE]" />
      </div>
    }>
      <EmailConfirmationContent />
    </Suspense>
  )
}
