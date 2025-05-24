"use client"

import type React from "react"

import { useState, useRef } from "react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { Clock, Repeat } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface DraggableTimelineEventProps {
  event: any
  position: {
    top: string
    height: string
    start: Date
    end: Date
  }
  onEventUpdate: (event: any, newStart: Date, newEnd: Date) => void
  getEventBackground: (platform: string) => string
  getEventBorder: (platform: string) => string
  getEventOpacity: (status: string) => string
  getPlatformIcon: (platform: string) => React.ReactNode
  formatEventTime: (date: Date) => string
}

export default function DraggableTimelineEvent({
  event,
  position,
  onEventUpdate,
  getEventBackground,
  getEventBorder,
  getEventOpacity,
  getPlatformIcon,
  formatEventTime,
}: DraggableTimelineEventProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef({ y: 0 })
  const eventOriginalDates = useRef({ start: new Date(event.start), end: new Date(event.end) })

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    // Store initial mouse position
    dragStartPos.current = { y: e.clientY }

    // Store original event dates
    eventOriginalDates.current = { start: new Date(event.start), end: new Date(event.end) }

    // Start dragging
    setIsDragging(true)

    // Add event listeners for movement and release
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    // Add style class during dragging
    if (dragRef.current) {
      dragRef.current.classList.add("opacity-70", "shadow-lg", "z-50", "scale-[1.02]")
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return

    // Calculate vertical displacement
    const deltaY = e.clientY - dragStartPos.current.y

    // Move the element visually during dragging
    dragRef.current.style.transform = `translateY(${deltaY}px)`
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return

    // Calculate vertical displacement
    const deltaY = e.clientY - dragStartPos.current.y

    // Reset transformation
    dragRef.current.style.transform = ""

    // If displacement is significant, consider it a drag
    if (Math.abs(deltaY) > 10) {
      // Calculate how many minutes to move based on displacement
      // Assuming each 2px = 1 minute
      const minutesToMove = Math.round(deltaY / 2)

      // Create new dates based on displacement
      const newStart = new Date(eventOriginalDates.current.start)
      const newEnd = new Date(eventOriginalDates.current.end)

      // Adjust minutes
      newStart.setMinutes(newStart.getMinutes() + minutesToMove)
      newEnd.setMinutes(newEnd.getMinutes() + minutesToMove)

      // Update the event
      onEventUpdate(event, newStart, newEnd)

      // Show notification
      toast({
        title: "Event rescheduled",
        description: `"${event.title}" was moved to ${format(newStart, "h:mm a", { locale: enUS })}`,
      })
    }

    // End dragging
    setIsDragging(false)

    // Remove event listeners
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)

    // Remove style class
    dragRef.current.classList.remove("opacity-70", "shadow-lg", "z-50", "scale-[1.02]")
  }

  return (
    <div
      ref={dragRef}
      className={cn(
        "absolute left-0 right-0 mx-1 rounded-md shadow-sm border-l-4 text-white overflow-hidden cursor-grab active:cursor-grabbing transition-all hover:shadow-md",
        getEventBackground(event.platform),
        getEventBorder(event.platform),
        getEventOpacity(event.status),
      )}
      style={{
        top: position.top,
        height: position.height,
        minHeight: "25px",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="p-1 text-xs">
        <div className="font-medium truncate flex items-center gap-1">
          {getPlatformIcon(event.platform)}
          <span className="truncate">{event.title}</span>
          {event.recurrence && <Repeat className="w-3 h-3 ml-1" />}
        </div>
        <div className="flex items-center gap-1 opacity-90">
          <Clock className="w-2.5 h-2.5" />
          <span>
            {formatEventTime(event.start)} - {formatEventTime(event.end)}
          </span>
        </div>
      </div>
    </div>
  )
}
