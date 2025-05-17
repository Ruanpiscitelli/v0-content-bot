"use client"

import type React from "react"

import { useState, useRef } from "react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { Clock, Instagram, Twitter, FileText, Repeat, ImageIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface DraggableEventProps {
  event: any
  onEventUpdate: (event: any, newStart: Date, newEnd: Date) => void
}

export default function DraggableEvent({ event, onEventUpdate }: DraggableEventProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const eventOriginalDates = useRef({ start: new Date(event.start), end: new Date(event.end) })

  // Platform icon
  const PlatformIcon = () => {
    switch (event.platform) {
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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Store initial mouse position
    dragStartPos.current = { x: e.clientX, y: e.clientY }

    // Store original event dates
    eventOriginalDates.current = { start: new Date(event.start), end: new Date(event.end) }

    // Start dragging
    setIsDragging(true)

    // Add event listeners for movement and release
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    // Add style class during dragging
    if (dragRef.current) {
      dragRef.current.classList.add("opacity-70", "scale-105", "shadow-lg", "z-50")
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    // Here you can add logic to show a visual indicator
    // of where the event will be placed when the user releases the mouse
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return

    // Calculate mouse displacement
    const deltaX = e.clientX - dragStartPos.current.x
    const deltaY = e.clientY - dragStartPos.current.y

    // If displacement is significant, consider it a drag
    if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
      // Here you would implement logic to determine the new date based on position
      // For this example, we'll simulate a displacement of a few hours
      const hoursToMove = Math.round(deltaY / 20) // Each 20px = 1 hour
      const daysToMove = Math.round(deltaX / 100) // Each 100px = 1 day

      // Create new dates based on displacement
      const newStart = new Date(eventOriginalDates.current.start)
      const newEnd = new Date(eventOriginalDates.current.end)

      // Adjust days
      if (daysToMove !== 0) {
        newStart.setDate(newStart.getDate() + daysToMove)
        newEnd.setDate(newEnd.getDate() + daysToMove)
      }

      // Adjust hours
      if (hoursToMove !== 0) {
        newStart.setHours(newStart.getHours() + hoursToMove)
        newEnd.setHours(newEnd.getHours() + hoursToMove)
      }

      // Update the event
      onEventUpdate(event, newStart, newEnd)

      // Show notification
      toast({
        title: "Event rescheduled",
        description: `"${event.title}" was moved to ${format(newStart, "MM/dd/yyyy HH:mm", { locale: enUS })}`,
      })
    }

    // End dragging
    setIsDragging(false)

    // Remove event listeners
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)

    // Remove style class
    if (dragRef.current) {
      dragRef.current.classList.remove("opacity-70", "scale-105", "shadow-lg", "z-50")
    }
  }

  return (
    <div
      ref={dragRef}
      className="p-1.5 overflow-hidden text-sm h-full cursor-grab active:cursor-grabbing transition-all"
      onMouseDown={handleMouseDown}
    >
      <div className="font-medium truncate flex items-center gap-1">
        <PlatformIcon />
        <span className="truncate">{event.title}</span>
        {event.recurrence && <Repeat className="w-3 h-3 ml-1" />}
      </div>
      <div className="flex items-center text-xs gap-1 mt-0.5 opacity-90">
        <Clock className="w-2.5 h-2.5" />
        <span>{format(event.start, "HH:mm", { locale: enUS })}</span>
        {event.imageUrl && <ImageIcon className="w-2.5 h-2.5 ml-1" />}
      </div>
    </div>
  )
}
