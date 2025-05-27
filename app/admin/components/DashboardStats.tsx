'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, Calendar, TrendingUp, Crown, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface StatsData {
  totalUsers: number
  usersToday: number
  usersThisWeek: number
  usersThisMonth: number
  premiumUsers: number
  monthlyGrowth: number
  loading: boolean
  error: string | null
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    usersToday: 0,
    usersThisWeek: 0,
    usersThisMonth: 0,
    premiumUsers: 0,
    monthlyGrowth: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    fetchStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await fetch('/api/admin/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      
      const data = await response.json()
      
      setStats({
        totalUsers: data.totalUsers || 0,
        usersToday: data.usersToday || 0,
        usersThisWeek: data.usersThisWeek || 0,
        usersThisMonth: data.usersThisMonth || 0,
        premiumUsers: data.premiumUsers || 0,
        monthlyGrowth: data.monthlyGrowth || 0,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to load statistics' 
      }))
    }
  }

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : ''
    return `${sign}${growth.toFixed(1)}%`
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      bgColor: 'bg-blue-500',
      change: formatGrowth(stats.monthlyGrowth),
      changeType: stats.monthlyGrowth >= 0 ? 'positive' : 'negative' as const,
      description: 'All registered users'
    },
    {
      title: 'New Today',
      value: stats.usersToday,
      icon: UserPlus,
      bgColor: 'bg-green-500',
      change: `${stats.usersToday} new`,
      changeType: 'neutral' as const,
      description: 'Users registered today'
    },
    {
      title: 'This Week',
      value: stats.usersThisWeek,
      icon: Calendar,
      bgColor: 'bg-orange-500',
      change: 'Weekly total',
      changeType: 'neutral' as const,
      description: 'Users this week'
    },
    {
      title: 'Premium Users',
      value: stats.premiumUsers,
      icon: Crown,
      bgColor: 'bg-purple-500',
      change: `${((stats.premiumUsers / Math.max(stats.totalUsers, 1)) * 100).toFixed(1)}%`,
      changeType: 'neutral' as const,
      description: 'Active subscriptions'
    }
  ]

  if (stats.error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Activity className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 dark:text-red-400">{stats.error}</p>
              <button 
                onClick={fetchStats}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                Try again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor} shadow-sm`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value.toLocaleString()}
              </div>
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : stat.changeType === 'negative'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 