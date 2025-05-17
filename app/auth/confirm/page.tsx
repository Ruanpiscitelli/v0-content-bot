"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export default function EmailConfirmationPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your email...")
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Check if we have a session
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
          // User is signed in, email is confirmed
          setStatus("success")
          setMessage("Your email has been confirmed successfully!")
          return
        }

        // If we don't have a session yet, check for a token in the URL
        const token = searchParams.get("token")

        if (token) {
          // If we have a token, try to verify it
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email",
          })

          if (error) {
            console.error("Verification error:", error)
            setStatus("error")
            setMessage("There was an error confirming your email. The link may have expired.")
          } else {
            setStatus("success")
            setMessage("Your email has been confirmed successfully!")
          }
        } else {
          // No token and no session, something is wrong
          setStatus("error")
          setMessage("No confirmation token found. Please check your email for the confirmation link.")
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
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setStatus("success")
        setMessage("Your email has been confirmed successfully!")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, searchParams, router])

  const handleContinue = () => {
    router.push("/dashboard")
  }

  const handleRetry = () => {
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Confirmation</CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your email address."}
            {status === "success" && "Your account is now active."}
            {status === "error" && "We encountered an issue with your email confirmation."}
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
              Continue to Dashboard
            </Button>
          )}
          {status === "error" && (
            <div className="flex flex-col space-y-2">
              <Button onClick={handleRetry} className="bg-[#5281EE] hover:bg-[#3a6eea]">
                Return to Login
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
