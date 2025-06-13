"use client"

import * as React from "react"
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek } from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface FullScreenCalendarEvent {
  id: string | number
  name: string
  time: string
  datetime: string
  description?: string
}

export interface DayWithEvents {
  day: Date
  events: FullScreenCalendarEvent[]
}

interface FullScreenCalendarProps {
  data: DayWithEvents[]
  onEventClick?: (event: FullScreenCalendarEvent) => void
  className?: string
}

export function FullScreenCalendar({ data, onEventClick, className }: FullScreenCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [view, setView] = React.useState<"month" | "week">("month")

  // Get events for a specific day
  const getEventsForDay = (day: Date): FullScreenCalendarEvent[] => {
    const dayWithEvents = data.find(item => isSameDay(item.day, day))
    return dayWithEvents ? dayWithEvents.events : []
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    if (view === "month") {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      const calendarStart = startOfWeek(monthStart)
      const calendarEnd = endOfWeek(monthEnd)
      
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    } else {
      const weekStart = startOfWeek(currentDate)
      const weekEnd = endOfWeek(currentDate)
      
      return eachDayOfInterval({ start: weekStart, end: weekEnd })
    }
  }

  const calendarDays = generateCalendarDays()

  const navigateDate = (direction: "prev" | "next") => {
    if (view === "month") {
      setCurrentDate(prev => direction === "next" ? addDays(prev, 30) : subDays(prev, 30))
    } else {
      setCurrentDate(prev => direction === "next" ? addDays(prev, 7) : subDays(prev, 7))
    }
  }

  const isCurrentMonth = (day: Date) => isSameMonth(day, currentDate)
  const isToday = (day: Date) => isSameDay(day, new Date())

  return (
    <div className={cn("h-full flex flex-col bg-white", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("prev")}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("next")}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("week")}
          >
            Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4">
        {view === "month" ? (
          <div className="h-full">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-px mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-px h-full">
              {calendarDays.map((day, index) => {
                const events = getEventsForDay(day)
                const isCurrentMonthDay = isCurrentMonth(day)
                const isTodayDay = isToday(day)
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "border border-gray-200 p-2 min-h-[120px] bg-white",
                      !isCurrentMonthDay && "bg-gray-50 text-gray-400",
                      isTodayDay && "bg-blue-50 border-blue-200"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium",
                      isTodayDay && "text-blue-600"
                    )}>
                      {format(day, "d")}
                    </div>
                    
                    <div className="mt-1 space-y-1">
                      {events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          onClick={() => onEventClick?.(event)}
                          className="text-xs p-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200 transition-colors truncate"
                        >
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                          <div className="font-medium truncate">{event.name}</div>
                        </div>
                      ))}
                      {events.length > 3 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{events.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="h-full">
            {/* Week view */}
            <div className="grid grid-cols-7 gap-4 h-full">
              {calendarDays.map((day, index) => {
                const events = getEventsForDay(day)
                const isTodayDay = isToday(day)
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className={cn(
                      "text-center mb-3",
                      isTodayDay && "text-blue-600"
                    )}>
                      <div className="text-sm font-medium">
                        {format(day, "EEE")}
                      </div>
                      <div className={cn(
                        "text-lg font-bold",
                        isTodayDay && "bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                      )}>
                        {format(day, "d")}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => onEventClick?.(event)}
                          className="text-xs p-2 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                        >
                          <div className="flex items-center space-x-1 mb-1">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">{event.time}</span>
                          </div>
                          <div className="font-medium">{event.name}</div>
                          {event.description && (
                            <div className="text-gray-600 mt-1 line-clamp-2">
                              {event.description.replace(/<[^>]*>/g, '').substring(0, 50)}...
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 