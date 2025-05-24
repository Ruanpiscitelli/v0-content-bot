"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"

export default function SignupConfirmation() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-white to-[#5281EE]/10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#5281EE]/20 blur-3xl"></div>
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-[#5281EE]/30 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white/80 shadow-xl backdrop-blur-sm">
          <div className="bg-gradient-to-r from-[#5281EE] to-[#5281EE]/80 px-6 py-8 text-white">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-4 text-center text-2xl font-bold tracking-tight">Check your email</h1>
            <p className="mt-2 text-center text-sm text-white/80">
              We've sent a confirmation link to your email address
            </p>
          </div>

          <div className="p-6">
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <p>
                We've sent a confirmation email to: <span className="font-medium">{email || "your email address"}</span>
              </p>
            </div>

            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-gray-900">Next steps:</h2>
                <ol className="ml-5 list-decimal space-y-2 text-sm text-gray-600">
                  <li>Check your email inbox for the confirmation message</li>
                  <li>Click on the confirmation link in the email</li>
                  <li>Once confirmed, you can log in to your account</li>
                </ol>
              </div>

              <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                <p>
                  <strong>Didn't receive the email?</strong> Check your spam folder or click the button below to resend
                  the confirmation email.
                </p>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5281EE]/50 focus:ring-offset-2"
                >
                  Resend confirmation email
                </button>

                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#5281EE] to-[#5281EE]/90 px-4 py-2.5 text-sm font-medium text-white hover:from-[#5281EE]/90 hover:to-[#5281EE] focus:outline-none focus:ring-2 focus:ring-[#5281EE]/50 focus:ring-offset-2"
                >
                  Go to login
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          Need help?{" "}
          <a href="#" className="text-[#5281EE] hover:text-[#5281EE]/80">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  )
}
