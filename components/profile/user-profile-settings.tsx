"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileInformation from "./profile-information"
import ProfilePicture from "./profile-picture"
import SecuritySettings from "./security-settings"
import AccountSettings from "./account-settings"

export default function UserProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-gray-200">
            <TabsList className="flex h-auto p-0 bg-transparent">
              <TabsTrigger
                value="profile"
                className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Profile Information
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                Account
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="p-6">
            <TabsContent value="profile" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <ProfilePicture />
                </div>
                <div className="md:col-span-2">
                  <ProfileInformation />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="security" className="mt-0">
              <SecuritySettings />
            </TabsContent>
            <TabsContent value="account" className="mt-0">
              <AccountSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
