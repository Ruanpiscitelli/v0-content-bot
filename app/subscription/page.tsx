"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navigation from "@/components/Navigation"

export default function SubscriptionPage() {
  const { user } = useAuth()
  const { hasSubscription, setSubscriptionStatus } = useStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    if (!user) return

    setLoading(true)

    try {
      // In a real app, this would connect to a payment processor
      // For this demo, we'll just update the subscription status directly

      const { error } = await supabase.from("profiles").update({ has_subscription: true } as any).eq("id", user.id)

      if (error) throw error

      setSubscriptionStatus(true)
      router.push("/chat")
    } catch (error) {
      console.error("Error updating subscription:", error)
      alert("Failed to update subscription status")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!user) return

    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from("profiles").update({ has_subscription: false } as any).eq("id", user.id)

      if (error) throw error

      setSubscriptionStatus(false)
    } catch (error) {
      console.error("Error canceling subscription:", error)
      alert("Failed to cancel subscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription</h1>
          <p className="mt-2 text-gray-600">Manage your subscription to access premium features.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {hasSubscription ? "Current Plan" : "Free Plan"}
            </h2>
            <ul className="space-y-2 mb-6">
              {hasSubscription ? (
                <>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited ideas</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Access to chat feature</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Priority support</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Up to 10 ideas</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    <span>No access to chat feature</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    <span>Standard support</span>
                  </li>
                </>
              )}
            </ul>
            {hasSubscription ? (
              <button onClick={handleCancelSubscription} disabled={loading} className="btn btn-danger w-full">
                {loading ? "Processing..." : "Cancel Subscription"}
              </button>
            ) : (
              <p className="text-sm text-gray-500">Upgrade to Pro to access all features.</p>
            )}
          </div>

          {!hasSubscription && (
            <div className="card bg-blue-50 border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pro Plan</h2>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Unlimited ideas</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Access to chat feature</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
              <div className="mb-6">
                <p className="text-2xl font-bold">
                  $9.99<span className="text-sm font-normal">/month</span>
                </p>
              </div>
              <button onClick={handleSubscribe} disabled={loading} className="btn btn-primary w-full">
                {loading ? "Processing..." : "Upgrade to Pro"}
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
