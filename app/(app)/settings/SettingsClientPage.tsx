"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, CreditCard, Key, Lock, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsClientPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPasswordError("")
    setPasswordSuccess(false)

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required")
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters")
      setLoading(false)
      return
    }

    // Simulating API call
    setTimeout(() => {
      setLoading(false)
      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }, 1500)
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-foreground">Settings</h1>

      <Tabs defaultValue="account" className="space-y-4 md:space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="account" className="text-xs md:text-sm">
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs md:text-sm">
            Security
          </TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs md:text-sm">
            Subscription
          </TabsTrigger>
        </TabsList>

        {/* Account Section */}
        <TabsContent value="account">
          <div className="grid gap-4 md:gap-6">
            <Card>
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg">Personal Information</CardTitle>
                <CardDescription className="text-xs md:text-sm">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="name" className="text-xs md:text-sm">
                      Name
                    </Label>
                    <Input id="name" defaultValue="John Smith" className="text-sm h-9 md:h-10" />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="email" className="text-xs md:text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john@contentmaster.ai"
                      className="text-sm h-9 md:h-10"
                    />
                  </div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="bio" className="text-xs md:text-sm">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[80px] md:min-h-[100px] p-2 md:p-3 border rounded-md text-sm"
                    defaultValue="Content creator and digital marketing specialist."
                  ></textarea>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="text-xs md:text-sm h-9 md:h-10">
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg">Preferences</CardTitle>
                <CardDescription className="text-xs md:text-sm">Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-xs md:text-sm">
                      Email notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">Receive updates about your account</p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing" className="text-xs md:text-sm">
                      Marketing emails
                    </Label>
                    <p className="text-xs text-muted-foreground">Receive offers and news</p>
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
            <Card>
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Key className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Change Password</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-3 md:space-y-4">
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="current-password" className="text-xs md:text-sm">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="text-sm h-9 md:h-10"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="new-password" className="text-xs md:text-sm">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="text-sm h-9 md:h-10"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="confirm-password" className="text-xs md:text-sm">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="text-sm h-9 md:h-10"
                    />
                  </div>

                  {passwordError && (
                    <Alert variant="destructive" className="py-2 text-xs md:text-sm">
                      <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                      <AlertTitle className="text-xs md:text-sm">Error</AlertTitle>
                      <AlertDescription className="text-xs md:text-sm">{passwordError}</AlertDescription>
                    </Alert>
                  )}

                  {passwordSuccess && (
                    <Alert
                      variant="default"
                      className="bg-green-50 text-green-800 border-green-200 py-2 text-xs md:text-sm"
                    >
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                      <AlertTitle className="text-xs md:text-sm">Success</AlertTitle>
                      <AlertDescription className="text-xs md:text-sm">
                        Your password has been changed successfully!
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full text-xs md:text-sm h-9 md:h-10" disabled={loading}>
                    {loading ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Lock className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Account Security</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs md:text-sm">Two-factor authentication</Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm h-8 md:h-9">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs md:text-sm">Active sessions</Label>
                    <p className="text-xs text-muted-foreground">Manage connected devices</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm h-8 md:h-9">
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
            <Card>
              <CardHeader className="pb-2 md:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Current Plan</span>
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-red-600 to-red-400 text-xs">Pro</Badge>
                </div>
                <CardDescription className="text-xs md:text-sm">
                  Details of your current plan and billing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="bg-red-50 p-3 md:p-4 rounded-lg border border-red-100">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <h3 className="font-medium text-red-800 text-sm md:text-base">Virallyzer Pro</h3>
                    <span className="text-base md:text-lg font-bold text-red-800">$97.00/month</span>
                  </div>
                  <p className="text-xs md:text-sm text-red-700 mb-2 md:mb-3">Auto-renewal on June 15, 2023</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                      <span>Unlimited chat access</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                      <span>Content generation</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                      <span>Content calendar</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                      <span>Trend analysis</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <h3 className="font-medium text-sm md:text-base">Payment method</h3>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 border rounded-md">
                    <div className="bg-gradient-to-r from-red-600 to-red-400 text-white p-1.5 md:p-2 rounded-md">
                      <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-xs md:text-sm">Credit card</p>
                      <p className="text-xs text-muted-foreground">Mastercard •••• 4832</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto text-xs h-7 md:h-8">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <h3 className="font-medium text-sm md:text-base">Invoice history</h3>
                  <div className="border rounded-md divide-y text-xs md:text-sm">
                    <div className="flex items-center justify-between p-2 md:p-3">
                      <div>
                        <p className="font-medium">May 2023</p>
                        <p className="text-xs text-muted-foreground">Virallyzer Pro - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$97.00</p>
                        <p className="text-xs text-green-600">Paid</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 md:p-3">
                      <div>
                        <p className="font-medium">April 2023</p>
                        <p className="text-xs text-muted-foreground">Virallyzer Pro - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$97.00</p>
                        <p className="text-xs text-green-600">Paid</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 md:p-3">
                      <div>
                        <p className="font-medium">March 2023</p>
                        <p className="text-xs text-muted-foreground">Virallyzer Pro - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$97.00</p>
                        <p className="text-xs text-green-600">Paid</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 md:gap-4">
                <Button variant="outline" className="w-full sm:w-auto text-xs md:text-sm h-9 md:h-10">
                  Change Plan
                </Button>
                <Button variant="destructive" className="w-full sm:w-auto text-xs md:text-sm h-9 md:h-10">
                  Cancel Subscription
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Users className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Invite Friends</span>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Invite friends and get 1 month free for each friend who signs up
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <Input
                    value="https://virallyzer.ai/invite/john123"
                    readOnly
                    className="text-xs md:text-sm h-9 md:h-10"
                  />
                  <Button className="whitespace-nowrap text-xs md:text-sm h-9 md:h-10">Copy Link</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
