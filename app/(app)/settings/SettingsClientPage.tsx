"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, CreditCard, Key, Lock, Users, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  is_admin: boolean
  current_plan: string
  daily_chat_usage: number
  last_usage_reset_at: string
  funnel_freedom_subscription_id: string | null
  subscription_status: string | null
}

export default function SettingsClientPage({ userId }: { userId?: string }) {
  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState("")
  
  // Profile form state
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const { user } = useAuth()

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true)
        setProfileError("")
        
        const response = await fetch("/api/profile/update")
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile")
        }
        
        setProfile(data.profile)
        setFullName(data.profile.full_name || "")
        setUsername(data.profile.username || "")
      } catch (error) {
        console.error("Error fetching profile:", error)
        setProfileError(error instanceof Error ? error.message : "Failed to load profile")
      } finally {
        setProfileLoading(false)
      }
    }

    if (userId) {
      fetchProfile()
    }
  }, [userId])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileUpdateLoading(true)
    setProfileError("")
    setProfileSuccess(false)

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          username: username,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile")
      }

      setProfile(data.profile)
      setProfileSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setProfileError(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setProfileUpdateLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError("")
    setPasswordSuccess(false)

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required")
      setPasswordLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      setPasswordLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters")
      setPasswordLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password")
      }

      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      // Clear success message after 5 seconds
      setTimeout(() => setPasswordSuccess(false), 5000)
    } catch (error) {
      console.error("Error changing password:", error)
      setPasswordError(error instanceof Error ? error.message : "Failed to change password")
    } finally {
      setPasswordLoading(false)
    }
  }

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case "free":
        return "Free Plan"
      case "premium":
        return "Premium Plan"
      case "pro":
        return "Pro Plan"
      default:
        return "Free Plan"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-gradient-to-r from-gray-600 to-gray-400"
      case "premium":
        return "bg-gradient-to-r from-blue-600 to-blue-400"
      case "pro":
        return "bg-gradient-to-r from-purple-600 to-purple-400"
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-400"
    }
  }

  if (profileLoading) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900">
        Settings
      </h1>

      <Tabs defaultValue="account" className="space-y-4 md:space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md bg-white border border-gray-200 shadow-sm">
          <TabsTrigger value="account" className="text-xs md:text-sm text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium">
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs md:text-sm text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium">
            Security
          </TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs md:text-sm text-gray-600 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 font-medium">
            Subscription
          </TabsTrigger>
        </TabsList>

        {/* Account Section */}
        <TabsContent value="account">
          <div className="grid gap-4 md:gap-6">
            <Card className="bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg text-gray-900">Personal Information</CardTitle>
                <CardDescription className="text-xs md:text-sm text-gray-600">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {profileError && (
                  <Alert variant="destructive" className="py-2 text-xs md:text-sm bg-red-50 border-red-200">
                    <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                    <AlertTitle className="text-xs md:text-sm text-red-800">Error</AlertTitle>
                    <AlertDescription className="text-xs md:text-sm text-red-700">{profileError}</AlertDescription>
                  </Alert>
                )}

                {profileSuccess && (
                  <Alert className="py-2 text-xs md:text-sm bg-green-50 border-green-200">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                    <AlertTitle className="text-xs md:text-sm text-green-800">Success</AlertTitle>
                    <AlertDescription className="text-xs md:text-sm text-green-700">
                      Your profile has been updated successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleProfileUpdate} className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1 md:space-y-2">
                      <Label htmlFor="name" className="text-xs md:text-sm text-gray-700 font-medium">
                        Full Name
                      </Label>
                      <Input 
                        id="name" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="text-sm h-9 md:h-10 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/30" 
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <Label htmlFor="username" className="text-xs md:text-sm text-gray-700 font-medium">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="text-sm h-9 md:h-10 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/30"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="email" className="text-xs md:text-sm text-gray-700 font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="text-sm h-9 md:h-10 bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed from this page</p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="text-xs md:text-sm h-9 md:h-10 bg-blue-600 hover:bg-blue-700 text-white border-0 font-medium"
                    disabled={profileUpdateLoading}
                  >
                    {profileUpdateLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg text-gray-900">Preferences</CardTitle>
                <CardDescription className="text-xs md:text-sm text-gray-600">Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-xs md:text-sm text-gray-700 font-medium">
                      Email notifications
                    </Label>
                    <p className="text-xs text-gray-500">Receive updates about your account</p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing" className="text-xs md:text-sm text-gray-700 font-medium">
                      Marketing emails
                    </Label>
                    <p className="text-xs text-gray-500">Receive offers and news</p>
                  </div>
                  <Switch id="marketing" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Section */}
        <TabsContent value="security">
          <div className="grid gap-4 md:gap-6">
            <Card className="bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg text-gray-900">
                  <Key className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Change Password</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm text-gray-600">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-3 md:space-y-4">
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="current-password" className="text-xs md:text-sm text-gray-700 font-medium">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="text-sm h-9 md:h-10 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/30"
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="new-password" className="text-xs md:text-sm text-gray-700 font-medium">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="text-sm h-9 md:h-10 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/30"
                      placeholder="Enter your new password"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="confirm-password" className="text-xs md:text-sm text-gray-700 font-medium">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="text-sm h-9 md:h-10 bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/30"
                      placeholder="Confirm your new password"
                    />
                  </div>

                  {passwordError && (
                    <Alert variant="destructive" className="py-2 text-xs md:text-sm bg-red-50 border-red-200">
                      <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                      <AlertTitle className="text-xs md:text-sm text-red-800">Error</AlertTitle>
                      <AlertDescription className="text-xs md:text-sm text-red-700">{passwordError}</AlertDescription>
                    </Alert>
                  )}

                  {passwordSuccess && (
                    <Alert className="py-2 text-xs md:text-sm bg-green-50 border-green-200">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                      <AlertTitle className="text-xs md:text-sm text-green-800">Success</AlertTitle>
                      <AlertDescription className="text-xs md:text-sm text-green-700">
                        Your password has been changed successfully!
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full text-xs md:text-sm h-9 md:h-10 bg-blue-600 hover:bg-blue-700 text-white border-0 font-medium" 
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg text-gray-900">
                  <Lock className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Account Security</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm text-gray-600">Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs md:text-sm text-gray-700 font-medium">Two-factor authentication</Label>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm h-8 md:h-9 border-blue-300 text-blue-600 hover:bg-blue-50">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs md:text-sm text-gray-700 font-medium">Active sessions</Label>
                    <p className="text-xs text-gray-500">Manage connected devices</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm h-8 md:h-9 border-blue-300 text-blue-600 hover:bg-blue-50">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscription Section */}
        <TabsContent value="subscription">
          <div className="grid gap-4 md:gap-6">
            <Card className="bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl">
              <CardHeader className="pb-2 md:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg text-gray-900">
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Current Plan</span>
                  </CardTitle>
                  <Badge className={`${getPlanColor(profile?.current_plan || "free")} text-xs text-white font-medium`}>
                    {getPlanDisplayName(profile?.current_plan || "free")}
                  </Badge>
                </div>
                <CardDescription className="text-xs md:text-sm text-gray-600">
                  Details of your current plan and usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      {getPlanDisplayName(profile?.current_plan || "free")}
                    </h3>
                    <span className="text-base md:text-lg font-bold text-gray-900">
                      {profile?.current_plan === "free" ? "Free" : "$97.00/month"}
                    </span>
                  </div>
                  
                  {profile?.current_plan === "free" && (
                    <div className="space-y-2">
                      <p className="text-xs md:text-sm text-gray-600 font-medium">
                        Daily chat usage: {profile?.daily_chat_usage || 0} / 10
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(((profile?.daily_chat_usage || 0) / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {profile?.subscription_status && (
                    <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
                      Status: <span className="text-gray-900 font-medium capitalize">{profile.subscription_status}</span>
                    </p>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                      <span className="text-gray-700">
                        {profile?.current_plan === "free" ? "Limited chat access" : "Unlimited chat access"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                      <span className="text-gray-700">Content generation</span>
                    </div>
                    {profile?.current_plan !== "free" && (
                      <>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                          <span className="text-gray-700">Content calendar</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                          <span className="text-gray-700">Trend analysis</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {profile?.current_plan === "free" && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Upgrade to Premium</h4>
                    <p className="text-xs text-blue-700 mb-3">
                      Get unlimited access to all features and remove daily limits
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 font-medium">
                      Upgrade Now
                    </Button>
                  </div>
                )}
              </CardContent>
              
              {profile?.current_plan !== "free" && (
                <CardFooter className="flex flex-col sm:flex-row gap-2 md:gap-4">
                  <Button variant="outline" className="w-full sm:w-auto text-xs md:text-sm h-9 md:h-10 border-blue-300 text-blue-600 hover:bg-blue-50">
                    Change Plan
                  </Button>
                  <Button variant="destructive" className="w-full sm:w-auto text-xs md:text-sm h-9 md:h-10">
                    Cancel Subscription
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card className="bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg text-gray-900">
                  <Users className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Invite Friends</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm text-gray-600">
                  Invite friends and get 1 month free for each friend who signs up
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Input
                    value={`https://virallyzer.ai/invite/${profile?.username || userId}`}
                    readOnly
                    className="text-xs md:text-sm h-9 md:h-10 bg-gray-50 border-gray-300 text-gray-700"
                  />
                  <Button className="whitespace-nowrap text-xs md:text-sm h-9 md:h-10 bg-blue-600 hover:bg-blue-700 text-white border-0 font-medium">
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
