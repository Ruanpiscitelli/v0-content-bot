"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { ArrowRight, Mail, Lock, User, Phone, Eye, EyeOff, Check, X } from "lucide-react"

// Function to calculate password strength
const calculatePasswordStrength = (
  password: string,
): {
  score: number
  feedback: string
  color: string
  requirements: { met: boolean; text: string }[]
} => {
  // Initialize score as 0
  let score = 0

  // Define requirements and check if they are met
  const requirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(password), text: "At least one uppercase letter" },
    { met: /[a-z]/.test(password), text: "At least one lowercase letter" },
    { met: /[0-9]/.test(password), text: "At least one number" },
    { met: /[^A-Za-z0-9]/.test(password), text: "At least one special character" },
  ]

  // Calculate score based on requirements met
  requirements.forEach((req) => {
    if (req.met) score += 1
  })

  // Define feedback and color based on score
  let feedback = ""
  let color = ""

  if (score === 0) {
    feedback = "Enter your password"
    color = "bg-gray-200"
  } else if (score === 1) {
    feedback = "Very weak"
    color = "bg-red-500"
  } else if (score === 2) {
    feedback = "Weak"
    color = "bg-orange-500"
  } else if (score === 3) {
    feedback = "Medium"
    color = "bg-yellow-500"
  } else if (score === 4) {
    feedback = "Strong"
    color = "bg-green-500"
  } else {
    feedback = "Very strong"
    color = "bg-green-600"
  }

  return { score, feedback, color, requirements }
}

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "Enter your password",
    color: "bg-gray-200",
    requirements: [] as { met: boolean; text: string }[],
  })
  const [showRequirements, setShowRequirements] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  // Check password strength when it changes
  useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password))
    } else {
      setPasswordStrength({
        score: 0,
        feedback: "Enter your password",
        color: "bg-gray-200",
        requirements: [],
      })
    }
  }, [password])

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    } else {
      setPasswordsMatch(true)
    }
  }, [password, confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    // Validate minimum password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    // Recommend a stronger password
    if (passwordStrength.score < 3) {
      if (
        !confirm("Your password is considered weak. We recommend a stronger password. Do you want to continue anyway?")
      ) {
        return
      }
    }

    setLoading(true)

    try {
      const { success, error } = await signUp(email, password, fullName, phone)

      if (!success && error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // Redirect to confirmation page instead of login page
      router.push(`/signup/confirmation?email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-white to-[#5281EE]/10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#5281EE]/20 blur-3xl"></div>
        <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-[#5281EE]/30 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <div className="overflow-hidden rounded-2xl bg-white/80 shadow-xl backdrop-blur-sm">
          {/* Card header */}
          <div className="bg-gradient-to-r from-[#5281EE] to-[#5281EE]/80 px-6 py-8 text-white">
            <h1 className="text-center text-3xl font-bold tracking-tight">
              Join{" "}
              <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">Virallyzer</span>
            </h1>
            <p className="mt-2 text-center text-sm text-white/80">
              Create your account and supercharge your content creation
            </p>
          </div>

          {/* Card body */}
          <div className="p-6">
            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                <div className="flex">
                  <div>{error}</div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      className="block w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:border-[#5281EE] focus:outline-none focus:ring-2 focus:ring-[#5281EE]/30 sm:text-sm"
                      placeholder="John Smith"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      className="block w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:border-[#5281EE] focus:outline-none focus:ring-2 focus:ring-[#5281EE]/30 sm:text-sm"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:border-[#5281EE] focus:outline-none focus:ring-2 focus:ring-[#5281EE]/30 sm:text-sm"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      className="block w-full rounded-lg border border-gray-300 bg-white/70 px-4 py-3 pl-10 pr-10 text-gray-900 placeholder:text-gray-400 focus:border-[#5281EE] focus:outline-none focus:ring-2 focus:ring-[#5281EE]/30 sm:text-sm"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setShowRequirements(true)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">
                          Password strength: {passwordStrength.feedback}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Password requirements list */}
                  {showRequirements && (
                    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <p className="mb-2 text-xs font-medium text-gray-700">For a strong password, include:</p>
                      <ul className="space-y-1">
                        {passwordStrength.requirements.map((req, index) => (
                          <li key={index} className="flex items-center text-xs">
                            {req.met ? (
                              <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                            ) : (
                              <X className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                            )}
                            <span className={req.met ? "text-gray-700" : "text-gray-500"}>{req.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      className={`block w-full rounded-lg border ${
                        !passwordsMatch && confirmPassword ? "border-red-500" : "border-gray-300"
                      } bg-white/70 px-4 py-3 pl-10 pr-10 text-gray-900 placeholder:text-gray-400 focus:border-[#5281EE] focus:outline-none focus:ring-2 focus:ring-[#5281EE]/30 sm:text-sm`}
                      placeholder="Type password again"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {!passwordsMatch && confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">Passwords don't match</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !passwordsMatch}
                  className="group relative flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#5281EE] to-[#5281EE]/90 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-[#5281EE]/90 hover:to-[#5281EE] focus:outline-none focus:ring-2 focus:ring-[#5281EE]/50 focus:ring-offset-2 disabled:opacity-70"
                >
                  {loading ? (
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card footer */}
          <div className="border-t border-gray-200 bg-gray-50/80 px-6 py-4">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#5281EE] hover:text-[#5281EE]/80">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          By signing up, you agree to our{" "}
          <a href="#" className="text-[#5281EE] hover:text-[#5281EE]/80">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#5281EE] hover:text-[#5281EE]/80">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
