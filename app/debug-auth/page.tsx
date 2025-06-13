"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

export default function DebugAuthPage() {
  const [email, setEmail] = useState("")
  const [results, setResults] = useState<any[]>([])
  const supabase = createClientComponentClient()

  const addResult = (test: string, result: any) => {
    const timestamp = new Date().toLocaleTimeString()
    setResults(prev => [...prev, { test, result, timestamp }])
  }

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      addResult("Supabase Connection", { 
        success: !error, 
        data: data?.session ? "Session exists" : "No session",
        error: error?.message 
      })
    } catch (err: any) {
      addResult("Supabase Connection", { success: false, error: err.message })
    }
  }

  const testPasswordReset = async () => {
    if (!email) {
      toast.error("Please enter an email first")
      return
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      addResult("Password Reset", { 
        success: !error, 
        data,
        error: error?.message,
        email 
      })
    } catch (err: any) {
      addResult("Password Reset", { success: false, error: err.message, email })
    }
  }

  const testSignUp = async () => {
    if (!email) {
      toast.error("Please enter an email first")
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'temp123456',
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      })
      
      addResult("Sign Up Test", { 
        success: !error, 
        data: data?.user ? "User created" : "No user",
        error: error?.message,
        email 
      })
    } catch (err: any) {
      addResult("Sign Up Test", { success: false, error: err.message, email })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🔍 Supabase Auth Diagnostics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Controls */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="test-email" className="text-white">Test Email</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="your-email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={testSupabaseConnection}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Test Supabase Connection
                </Button>
                
                <Button 
                  onClick={testPasswordReset}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={!email}
                >
                  Test Password Reset
                </Button>
                
                <Button 
                  onClick={testSignUp}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!email}
                >
                  Test Sign Up (with temp password)
                </Button>
              </div>

              <Button 
                onClick={() => setResults([])}
                variant="outline"
                className="w-full"
              >
                Clear Results
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Test Results</h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-gray-400">No tests run yet</p>
              ) : (
                results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${
                      result.result.success 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">{result.test}</h3>
                      <span className="text-xs text-gray-400">{result.timestamp}</span>
                    </div>
                    
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Environment Info */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Environment Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-white">Supabase URL:</strong>
              <p className="text-gray-300 font-mono break-all">
                {process.env.NEXT_PUBLIC_SUPABASE_URL}
              </p>
            </div>
            <div>
              <strong className="text-white">Current Origin:</strong>
              <p className="text-gray-300 font-mono">
                {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 