"use client"

import { useState, useRef, useEffect } from "react"
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  addWeeks,
  subWeeks,
  differenceInMinutes,
  addMinutes,
  isWithinInterval,
} from "date-fns"
import { enUS } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Plus, Instagram, Twitter, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import DraggableTimelineEvent from "./draggable-timeline-event"

// Types
interface TimelineEvent {
  id: number | string
  title: string
  start: Date
  end: Date
  desc?: string
  platform: "Instagram" | "X" | "Blog"
  status: "Draft" | "Approved" | "Published"
  allDay?: boolean
  imageUrl?: string
  recurrence?: any
}

interface TimelineViewProps {
  events: TimelineEvent[]
  currentDate: Date
  onSelectEvent: (event: TimelineEvent) => void
  onSelectSlot: (slot: { start: Date; end: Date }) => void
  onEventUpdate?: (event: TimelineEvent, newStart: Date, newEnd: Date) => void
}

export default function TimelineView({
  events,
  currentDate,
  onSelectEvent,
  onSelectSlot,
  onEventUpdate = () => {}, // Default value to avoid errors
}: TimelineViewProps) {
  // State to control current week
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 0 }))

  // State to control zoom level
  const [zoomLevel, setZoomLevel] = useState(2) // 1: day, 2: week, 3: month

  // Reference for timeline container
  const timelineRef = useRef<HTMLDivElement>(null)

  // Calculate end of current week
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 0 })

  // Generate days of current week
  const daysInWeek = eachDayOfInterval({
    start: currentWeekStart,
    end: currentWeekEnd,
  })

  // Hours of day for timeline
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i)

  // Function to navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1))
  }

  // Function to navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1))
  }

  // Function to go to current week
  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))
  }

  // Filter events for current week
  const eventsInCurrentWeek = events.filter((event) => {
    return isWithinInterval(event.start, {
      start: currentWeekStart,
      end: currentWeekEnd,
    })
  })

  // Function to calculate position and size of an event in timeline
  const calculateEventPosition = (event: TimelineEvent, dayIndex: number) => {
    const eventDay = event.start.getDay()

    // Check if event belongs to current day
    if (eventDay !== dayIndex) return null

    // Calculate vertical position based on start time
    const startHour = event.start.getHours()
    const startMinute = event.start.getMinutes()
    const startPosition = startHour + startMinute / 60

    // Calculate event duration in hours
    const durationMinutes = differenceInMinutes(event.end, event.start)
    const durationHours = durationMinutes / 60

    return {
      top: `${(startPosition / 24) * 100}%`,
      height: `${(durationHours / 24) * 100}%`,
      start: event.start,
      end: event.end,
    }
  }

  // Function to format time
  const formatEventTime = (date: Date) => {
    return format(date, "h:mm a", { locale: enUS })
  }

  // Function to handle click on empty slot
  const handleSlotClick = (day: Date, hour: number) => {
    const start = addMinutes(new Date(day.setHours(hour, 0, 0, 0)), 0)
    const end = addMinutes(start, 30)
    onSelectSlot({ start, end })
  }

  // Function to get background color based on platform
  const getEventBackground = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return "bg-gradient-to-r from-rose-500 to-pink-500"
      case "X":
        return "bg-gradient-to-r from-sky-500 to-blue-500"
      case "Blog":
        return "bg-gradient-to-r from-emerald-500 to-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Function to get border color based on platform
  const getEventBorder = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return "border-rose-600"
      case "X":
        return "border-sky-600"
      case "Blog":
        return "border-emerald-600"
      default:
        return "border-gray-600"
    }
  }

  // Function to get opacity based on status
  const getEventOpacity = (status: string) => {
    switch (status) {
      case "Draft":
        return "opacity-70"
      case "Approved":
        return "opacity-90"
      case "Published":
        return "opacity-100"
      default:
        return "opacity-80"
    }
  }

  // Function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return <Instagram className="w-3 h-3" />
      case "X":
        return <Twitter className="w-3 h-3" />
      case "Blog":
        return <FileText className="w-3 h-3" />
      default:
        return null
    }
  }

  // Effect to scroll to current time when view is loaded
  useEffect(() => {
    if (timelineRef.current) {
      const now = new Date()
      const currentHour = now.getHours()
      const scrollPosition = (currentHour / 24) * timelineRef.current.scrollHeight
      timelineRef.current.scrollTop = scrollPosition - 100 // Subtract 100px to show some hours before
    }
  }, [currentWeekStart])

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Timeline header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-medium ml-2">
              {format(currentWeekStart, "MMMM d", { locale: enUS })} -{" "}
              {format(currentWeekEnd, "MMMM d, yyyy", { locale: enUS })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Zoom:</span>
            <Button
              variant={zoomLevel === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setZoomLevel(1)}
              className="h-8"
            >
              Day
            </Button>
            <Button
              variant={zoomLevel === 2 ? "default" : "outline"}
              size="sm"
              onClick={() => setZoomLevel(2)}
              className="h-8"
            >
              Week
            </Button>
            <Button
              variant={zoomLevel === 3 ? "default" : "outline"}
              size="sm"
              onClick={() => setZoomLevel(3)}
              className="h-8"
            >
              Month
            </Button>
          </div>
        </div>

        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1">
          {daysInWeek.map((day, index) => (
            <div
              key={index}
              className={cn(
                "text-center py-2 font-medium rounded-t-lg",
                isToday(day) ? "bg-blue-50 text-blue-700" : "bg-gray-50",
              )}
            >
              <div className="text-xs text-gray-500">{format(day, "EEEE", { locale: enUS })}</div>
              <div className={cn("text-lg", isToday(day) ? "text-blue-700" : "text-gray-700")}>{format(day, "d")}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline body */}
      <div
        ref={timelineRef}
        className="flex-1 overflow-y-auto"
        style={{
          height:
            zoomLevel === 1 ? "calc(100vh - 200px)" : zoomLevel === 2 ? "calc(100vh - 200px)" : "calc(100vh - 200px)",
        }}
      >
        <div className="grid grid-cols-[60px_1fr] h-full">
          {/* Hours column */}
          <div className="bg-gray-50 border-r border-gray-200">
            {hoursOfDay.map((hour) => (
              <div
                key={hour}
                className="h-20 border-b border-gray-200 flex items-center justify-center text-xs text-gray-500"
              >
                {hour}:00
              </div>
            ))}
          </div>

          {/* Events column */}
          <div className="grid grid-cols-7 divide-x divide-gray-200">
            {daysInWeek.map((day, dayIndex) => (
              <div key={dayIndex} className="relative">
                {/* Hours grid */}
                {hoursOfDay.map((hour) => (
                  <div
                    key={hour}
                    className={cn(
                      "h-20 border-b border-gray-200 relative",
                      hour % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                    )}
                    onClick={() => handleSlotClick(day, hour)}
                  >
                    {/* Current time line */}
                    {isToday(day) && new Date().getHours() === hour && (
                      <div
                        className="absolute w-full h-0.5 bg-red-500 z-10"
                        style={{ top: `${(new Date().getMinutes() / 60) * 100}%` }}
                      >
                        <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Day events */}
                {eventsInCurrentWeek.map((event) => {
                  const position = calculateEventPosition(event, dayIndex)
                  if (!position) return null

                  return (
                    <DraggableTimelineEvent
                      key={event.id}
                      event={event}
                      position={position}
                      onEventUpdate={onEventUpdate}
                      getEventBackground={getEventBackground}
                      getEventBorder={getEventBorder}
                      getEventOpacity={getEventOpacity}
                      getPlatformIcon={getPlatformIcon}
                      formatEventTime={formatEventTime}
                    />
                  )
                })}

                {/* Add event button */}
                <button
                  className="absolute top-2 right-2 w-6 h-6 bg-[#01aef0] rounded-full flex items-center justify-center text-white shadow-sm hover:bg-[#0099d6] z-20"
                  onClick={() => {
                    const start = new Date(day)
                    start.setHours(9, 0, 0, 0)
                    const end = new Date(day)
                    end.setHours(9, 30, 0, 0)
                    onSelectSlot({ start, end })
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
