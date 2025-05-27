import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    
    // Get current date references
    const now = new Date()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    // Get last month for comparison
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setDate(1)
    lastMonth.setHours(0, 0, 0, 0)

    // Execute all queries in parallel
    const [
      totalUsersResult,
      usersTodayResult,
      usersThisWeekResult,
      usersThisMonthResult,
      usersLastMonthResult
    ] = await Promise.all([
      // Total users
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true }),
      
      // Users today
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString()),
      
      // Users this week
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekStart.toISOString()),
      
      // Users this month
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString()),
      
      // Users last month (for comparison)
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', monthStart.toISOString())
    ])

    // Check for errors
    if (totalUsersResult.error) throw totalUsersResult.error
    if (usersTodayResult.error) throw usersTodayResult.error
    if (usersThisWeekResult.error) throw usersThisWeekResult.error
    if (usersThisMonthResult.error) throw usersThisMonthResult.error
    if (usersLastMonthResult.error) throw usersLastMonthResult.error

    // Calculate growth percentages
    const usersThisMonth = usersThisMonthResult.count || 0
    const usersLastMonth = usersLastMonthResult.count || 0
    const monthlyGrowth = usersLastMonth > 0 
      ? ((usersThisMonth - usersLastMonth) / usersLastMonth * 100).toFixed(1)
      : '0'

    // Get additional stats
    const { data: premiumUsers, error: premiumError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('has_subscription', true)

    if (premiumError) throw premiumError

    const { data: recentContent, error: contentError } = await supabase
      .from('content')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    if (contentError) throw contentError

    return NextResponse.json({
      totalUsers: totalUsersResult.count || 0,
      usersToday: usersTodayResult.count || 0,
      usersThisWeek: usersThisWeekResult.count || 0,
      usersThisMonth: usersThisMonth,
      usersLastMonth: usersLastMonth,
      monthlyGrowth: parseFloat(monthlyGrowth),
      premiumUsers: premiumUsers?.length || 0,
      contentToday: recentContent?.length || 0,
      timestamp: now.toISOString()
    })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
} 