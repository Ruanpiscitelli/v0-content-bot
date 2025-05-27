'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { TrendingUp, BarChart3, Activity } from 'lucide-react'

interface ChartData {
  name: string
  usuarios: number
  date: string
  formattedDate: string
}

export function UserRegistrationChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<'7days' | '30days' | '3months' | '1year'>('30days')
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('area')

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const supabase = getSupabaseAdmin()
      
      const now = new Date()
      let startDate = new Date()
      let dateFormat: Intl.DateTimeFormatOptions
      let groupBy: string

      switch (period) {
        case '7days':
          startDate.setDate(now.getDate() - 7)
          dateFormat = { month: 'short', day: 'numeric' }
          groupBy = 'day'
          break
        case '30days':
          startDate.setDate(now.getDate() - 30)
          dateFormat = { month: 'short', day: 'numeric' }
          groupBy = 'day'
          break
        case '3months':
          startDate.setMonth(now.getMonth() - 3)
          dateFormat = { month: 'short', day: 'numeric' }
          groupBy = 'week'
          break
        case '1year':
          startDate.setFullYear(now.getFullYear() - 1)
          dateFormat = { month: 'short', year: 'numeric' }
          groupBy = 'month'
          break
      }

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group data by period
      const groupedData = new Map<string, number>()
      
      profiles?.forEach(profile => {
        const date = new Date(profile.created_at)
        let key: string

        switch (groupBy) {
          case 'day':
            key = date.toISOString().split('T')[0]
            break
          case 'week':
            const weekStart = new Date(date)
            weekStart.setDate(date.getDate() - date.getDay())
            key = weekStart.toISOString().split('T')[0]
            break
          case 'month':
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
            break
          default:
            key = date.toISOString().split('T')[0]
        }

        groupedData.set(key, (groupedData.get(key) || 0) + 1)
      })

      // Fill missing dates with 0
      const chartData: ChartData[] = []
      const current = new Date(startDate)
      
      while (current <= now) {
        let key: string
        let increment: number

        switch (groupBy) {
          case 'day':
            key = current.toISOString().split('T')[0]
            increment = 1
            break
          case 'week':
            const weekStart = new Date(current)
            weekStart.setDate(current.getDate() - current.getDay())
            key = weekStart.toISOString().split('T')[0]
            increment = 7
            break
          case 'month':
            key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-01`
            increment = 30
            break
          default:
            key = current.toISOString().split('T')[0]
            increment = 1
        }

        const count = groupedData.get(key) || 0
        const displayDate = new Date(key)
        
        chartData.push({
          name: displayDate.toLocaleDateString('en-US', dateFormat),
          usuarios: count,
          date: key,
          formattedDate: displayDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })
        })

        current.setDate(current.getDate() + increment)
      }

      setData(chartData)
    } catch (error) {
      console.error('Error fetching chart data:', error)
      setError('Failed to load chart data')
    } finally {
      setLoading(false)
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {data.formattedDate}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            <span className="font-medium">{payload[0].value}</span> new users
          </p>
        </div>
      )
    }
    return null
  }

  const totalUsers = data.reduce((sum, item) => sum + item.usuarios, 0)
  const averagePerDay = totalUsers / Math.max(data.length, 1)

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-red-500" />
            <span>User Registration Chart</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <button 
              onClick={fetchData}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>User Registrations</span>
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {totalUsers} total • {averagePerDay.toFixed(1)} avg/period
            </p>
          </div>
          <div className="flex space-x-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 days</SelectItem>
                <SelectItem value="30days">30 days</SelectItem>
                <SelectItem value="3months">3 months</SelectItem>
                <SelectItem value="1year">1 year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={chartType} onValueChange={(value: 'line' | 'bar' | 'area') => setChartType(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4 w-full">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="usuarios" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80"
                  />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="usuarios" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="usuarios" 
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 