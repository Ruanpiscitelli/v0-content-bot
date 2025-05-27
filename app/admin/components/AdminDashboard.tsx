'use client'

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { DashboardStats } from './DashboardStats'
import { UserSearchPanel } from './UserSearchPanel'
import { RecentUsersTable } from './RecentUsersTable'
import { UserRegistrationChart } from './UserRegistrationChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Construction, Settings, BarChart3 } from 'lucide-react'

export function AdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-600 dark:text-gray-400">Monitor your platform's key metrics and user activity</p>
              </div>
            </div>
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserRegistrationChart />
              <RecentUsersTable />
            </div>
          </div>
        )
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Search, filter, and manage platform users</p>
              </div>
            </div>
            <UserSearchPanel />
          </div>
        )
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
                <p className="text-gray-600 dark:text-gray-400">Detailed insights and analytics reports</p>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Advanced Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Construction className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Advanced reporting features including user behavior analytics, content performance metrics, 
                    and custom report generation are currently in development.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Configure platform settings and preferences</p>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Platform Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Construction className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    System configuration options including user permissions, platform settings, 
                    notification preferences, and security configurations are being developed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-600 dark:text-gray-400">Monitor your platform's key metrics and user activity</p>
              </div>
            </div>
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserRegistrationChart />
              <RecentUsersTable />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
} 