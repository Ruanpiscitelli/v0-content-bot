"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

interface Event {
  id: number
  title: string
  start: Date
  end: Date
  desc?: string
  platform?: string
  status?: string
  imageUrl?: string
}

interface ContentCalendarProps {
  events: Event[]
  onEventUpdate?: (event: Event, newStart: Date, newEnd: Date) => void
}

export default function ContentCalendar({ events, onEventUpdate }: ContentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Filter events for the selected date
  const eventsForSelectedDate = selectedDate
    ? events.filter(
        (event) =>
          event.start.getDate() === selectedDate.getDate() &&
          event.start.getMonth() === selectedDate.getMonth() &&
          event.start.getFullYear() === selectedDate.getFullYear(),
      )
    : []

  // Function to determine which days have events
  const getDaysWithEvents = () => {
    const eventDates = events.map((event) => new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate()))
    console.log("[ContentCalendar] getDaysWithEvents - Dates with events:", eventDates);
    return eventDates;
  }

  // Function to render day content in the calendar
  const renderDayContent = (day: Date) => {
    const hasEvents = events.some(
      (event) =>
        event.start.getDate() === day.getDate() &&
        event.start.getMonth() === day.getMonth() &&
        event.start.getFullYear() === day.getFullYear(),
    )
    console.log("[ContentCalendar] renderDayContent - Day:", day, "Has Events:", hasEvents);

    if (hasEvents) {
      return <div className="w-1 h-1 bg-primary rounded-full mx-auto mt-1"></div>
    }

    return null
  }

  // Function to get status color
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "bg-green-500"
      case "approved":
        return "bg-blue-500"
      case "draft":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  // Function to get platform color
  const getPlatformColor = (platform?: string) => {
    switch (platform?.toLowerCase()) {
      case "instagram":
        return "bg-pink-500"
      case "facebook":
        return "bg-blue-600"
      case "x":
      case "twitter":
        return "bg-black"
      case "linkedin":
        return "bg-blue-700"
      case "blog":
        return "bg-green-600"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-10rem)]">
      <div className="bg-white p-4 rounded-lg shadow">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => setSelectedDate(date || undefined)}
          locale={enUS}
          className="w-full"
          modifiers={{
            hasEvent: getDaysWithEvents(),
          }}
          modifiersClassNames={{
            hasEvent: "font-bold text-primary",
          }}
        />
      </div>

      <div className="md:col-span-2 bg-white p-4 rounded-lg shadow overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          {selectedDate ? format(selectedDate, "MMMM d, yyyy", { locale: enUS }) : "Select a date"}
        </h2>

        {eventsForSelectedDate.length === 0 ? (
          <p className="text-muted-foreground">No content scheduled for this date.</p>
        ) : (
          <div className="space-y-4">
            {eventsForSelectedDate.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {event.imageUrl && (
                      <div className="w-full md:w-1/4 h-32 md:h-auto">
                        <img
                          src={event.imageUrl || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`p-4 ${event.imageUrl ? "md:w-3/4" : "w-full"}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        <div className="flex gap-2">
                          {event.platform && (
                            <Badge className={`${getPlatformColor(event.platform)} text-white`}>{event.platform}</Badge>
                          )}
                          {event.status && (
                            <Badge className={`${getStatusColor(event.status)} text-white`}>{event.status}</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                      </p>
                      {event.desc && <p className="text-sm">{event.desc}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
