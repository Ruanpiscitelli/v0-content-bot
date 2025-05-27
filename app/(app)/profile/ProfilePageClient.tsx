"use client"

import UserProfileSettings from "@/components/profile/user-profile-settings"

export default function ProfilePageClient() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <nav className="flex mt-3 sm:mt-0" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <a href="/ideas" className="hover:text-primary">
                                      Ideas
                </a>
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="ml-2 font-medium text-gray-900">Profile</span>
              </li>
            </ol>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <UserProfileSettings />
        </div>
      </main>
    </div>
  )
}
