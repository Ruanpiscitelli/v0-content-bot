"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ContentCalendar from "@/app/components/ContentCalendar"
import { toast } from "@/components/ui/use-toast"

export default function CalendarClientPage() {
  const [viewMode, setViewMode] = useState<"calendar" | "timeline" | "advanced">("calendar")

  // Example events
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Instagram Post - Carousel",
      start: new Date(2025, 4, 5, 10, 0),
      end: new Date(2025, 4, 5, 10, 30),
      desc: "Carousel about productivity tips",
      platform: "Instagram",
      status: "Approved",
      imageUrl: "/instagram-post-lifestyle.png",
    },
    {
      id: 2,
      title: "Tweet about launch",
      start: new Date(2025, 4, 7, 14, 0),
      end: new Date(2025, 4, 7, 14, 15),
      desc: "Announcement of new platform feature",
      platform: "X",
      status: "Draft",
    },
    {
      id: 3,
      title: "Blog Article - SEO",
      start: new Date(2025, 4, 10, 9, 0),
      end: new Date(2025, 4, 10, 11, 0),
      desc: "Detailed article about SEO techniques for 2025",
      platform: "Blog",
      status: "Published",
      imageUrl: "/blog-post-concept.png",
    },
    // Add more events to demonstrate calendar density
    {
      id: 4,
      title: "Instagram Post - Reels",
      start: new Date(2025, 4, 12, 15, 0),
      end: new Date(2025, 4, 12, 15, 30),
      desc: "Reels showing behind the scenes",
      platform: "Instagram",
      status: "Draft",
    },
    {
      id: 5,
      title: "Thread on X",
      start: new Date(2025, 4, 15, 9, 0),
      end: new Date(2025, 4, 15, 9, 30),
      desc: "Thread about marketing trends",
      platform: "X",
      status: "Approved",
    },
  ])

  // Handler for updating events
  const handleEventUpdate = (event: any, newStart: Date, newEnd: Date) => {
    setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, start: newStart, end: newEnd } : e)))

    toast({
      title: "Event rescheduled",
      description: `"${event.title}" was successfully moved.`,
    })
  }

  return (
    <div className="container mx-auto p-2 md:p-4 h-[calc(100vh-4rem)]">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Content Calendar</h1>
        <div className="flex gap-2">
          <Button variant={viewMode === "calendar" ? "default" : "outline"} onClick={() => setViewMode("calendar")}>
            Calendar
          </Button>
          <Button variant={viewMode === "timeline" ? "default" : "outline"} onClick={() => setViewMode("timeline")}>
            Timeline
          </Button>
          <Button variant={viewMode === "advanced" ? "default" : "outline"} onClick={() => setViewMode("advanced")}>
            Advanced
          </Button>
        </div>
      </div>

      {viewMode === "calendar" && <ContentCalendar events={events} onEventUpdate={handleEventUpdate} />}

      {viewMode === "timeline" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          <p className="text-gray-500">Timeline view in development.</p>
        </div>
      )}

      {viewMode === "advanced" && (
        <div className="bg-white p-4 rounded-lg shadow h-[calc(100vh-10rem)]">
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Advanced view in development.</p>
          </div>
        </div>
      )}
    </div>
  )
}
