"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { toast } from "sonner"
import { Rocket } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validação de email básica
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      console.log('🔄 Attempting password reset for email:', email);
      console.log('🔗 Reset URL will be:', `${window.location.origin}/reset-password`);
      console.log('🏗️ Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/confirm`,
      })

      console.log('📧 Password reset response:', { data, error });

      if (error) {
        console.error('❌ Password reset error:', error);
        
        // Tratamento específico de erros comuns
        if (error.message.includes('rate limit')) {
          throw new Error('Too many attempts. Please wait a few minutes and try again.');
        } else if (error.message.includes('email not found')) {
          // Mesmo assim vamos mostrar sucesso por segurança
          console.log('📧 Email not found, but showing success for security');
        } else {
          throw error;
        }
      }

      console.log('✅ Password reset email sent successfully');
      setIsSent(true)
      toast.success("Password reset instructions sent to your email!")
    } catch (error: any) {
      console.error('💥 Caught error:', error);
      toast.error(error.message || "Failed to send reset instructions. Please try again.")
    } finally {
      setIsLoading(false)
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
          <h1 className="text-3xl font-black text-white mb-2">Reset Password</h1>
          <p className="text-gray-300">Enter your email to receive reset instructions</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center text-white">
              <p className="mb-4">Check your email for password reset instructions.</p>
              <p className="text-sm text-gray-300">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setIsSent(false)}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  try again
                </button>
              </p>
            </div>
          )}

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