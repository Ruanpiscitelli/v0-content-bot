"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { ArrowRight, Mail, Lock, User, Phone, Eye, EyeOff, Check, X, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    color = "bg-gray-400"
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
    color: "bg-gray-400",
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
        color: "bg-gray-400",
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
          <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
          <p className="text-gray-300">Join us and start creating amazing content</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="text-red-200 text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-white">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowRequirements(true)}
                  onBlur={() => setShowRequirements(false)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-300">Password strength:</span>
                    <span className="text-xs text-gray-300">{passwordStrength.feedback}</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password requirements */}
              {showRequirements && password && (
                <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-300 mb-2">Password requirements:</p>
                  <div className="space-y-1">
                    {passwordStrength.requirements.map((req, index) => (
                      <div key={index} className="flex items-center text-xs">
                        {req.met ? (
                          <Check className="h-3 w-3 text-green-400 mr-2" />
                        ) : (
                          <X className="h-3 w-3 text-gray-400 mr-2" />
                        )}
                        <span className={req.met ? "text-green-400" : "text-gray-400"}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10 ${
                    confirmPassword && !passwordsMatch ? "border-red-500" : ""
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-xs text-red-400">Passwords don't match</p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2"
                disabled={loading || !passwordsMatch}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-300">Already have an account? </span>
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
