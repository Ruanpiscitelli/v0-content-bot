"use client"

import { useState, useEffect } from "react"
// Removed Button as it's not used in the new structure directly for view modes
// import { Button } from "@/components/ui/button" 
// import ContentCalendar from "@/app/components/ContentCalendar" // Old calendar
import { FullScreenCalendar, type DayWithEvents } from "@/components/ui/fullscreen-calendar" // New calendar
import { toast } from "@/components/ui/use-toast" // Kept for potential future use, but not in current FullScreenCalendar example
import { useIdeas, type Idea as IdeaFromHook } from "@/hooks/useIdeas"
import { parseISO, format, startOfDay } from "date-fns"

// Define the Event type expected by FullScreenCalendar (based on dummyEvents)
interface FullScreenCalendarEvent {
  id: string | number;
  name: string;
  time: string; // e.g., "10:00 AM"
  datetime: string; // e.g., "2025-01-02T00:00:00Z"
  // Add other fields if FullScreenCalendar supports them, like desc, platform, status, imageUrl
}

// The DayWithEvents type from FullScreenCalendar typically looks like:
// interface DayWithEvents {
//   day: Date;
//   events: FullScreenCalendarEvent[];
// }
// We will use the imported DayWithEvents type.

interface CalendarClientPageProps {
  userId: string
}

export default function CalendarClientPage({ userId }: CalendarClientPageProps) {
  // const [viewMode, setViewMode] = useState<"calendar" | "timeline" | "advanced">("calendar") // Old view mode
  const { ideas, loading: ideasLoading, error: ideasError } = useIdeas(userId)
  const [calendarData, setCalendarData] = useState<DayWithEvents[]>([])

  useEffect(() => {
    if (ideas && ideas.length > 0) {
      const eventsByDay: { [key: string]: DayWithEvents } = {}

      ideas
        .filter(idea => idea.scheduled_date)
        .forEach((idea: IdeaFromHook) => {
          try {
            const scheduledDate = parseISO(idea.scheduled_date!)
            const dayKey = format(scheduledDate, "yyyy-MM-dd")

            if (!eventsByDay[dayKey]) {
              eventsByDay[dayKey] = {
                day: startOfDay(scheduledDate),
                events: [],
              }
            }

            eventsByDay[dayKey].events.push({
              id: idea.id,
              name: idea.title,
              time: format(scheduledDate, "p"), // e.g., "10:00 AM"
              // datetime should be the specific date string for that day, often used for comparisons or headers
              // The dummy data used "YYYY-MM-DDTHH:mm", let's use the start of the day in UTC for consistency.
              datetime: startOfDay(scheduledDate).toISOString(), // e.g., "2025-01-02T00:00:00.000Z"
              // You can add other properties from 'idea' if FullScreenCalendar supports rendering them
              // e.g., status: idea.status, description: idea.idea_text
            })
          } catch (e) {
            console.error("Error processing idea for calendar:", idea, e);
            // Optionally, show a toast message for the problematic idea
            toast({
              title: "Error Processing Idea",
              description: `Could not process idea "${idea.title || 'Unknown'}" for the calendar.`,
              variant: "destructive",
            })
          }
        })

      const transformedData = Object.values(eventsByDay)
      // Sort by day to ensure chronological order
      transformedData.sort((a, b) => a.day.getTime() - b.day.getTime());
      
      setCalendarData(transformedData)
      console.log("[CalendarClientPage] Transformed ideas to FullScreenCalendar data:", transformedData)
    } else {
      setCalendarData([])
      console.log("[CalendarClientPage] No ideas to transform or ideas array is empty.")
    }
  }, [ideas])

  // Handler for updating events - this will depend on FullScreenCalendar's API
  // For now, it's removed as FullScreenCalendar might have its own way or not support drag-and-drop updates by default
  /*
  const handleEventUpdate = (eventInfo: any, newStart: Date, newEnd: Date) => {
    setCalendarData((prev) => prev.map((day) => ({
      ...day,
      events: day.events.map((e) => (e.id === eventInfo.id ? { ...e, datetime: newStart.toISOString(), time: format(newStart, "p") } : e))
    })));
    
    toast({
      title: "Event rescheduled (UI only)",
      description: `"${eventInfo.name}" was moved. Backend update needed.`,
    });
    console.log("[CalendarClientPage] handleEventUpdate (UI only) - Event:", eventInfo, "New Start:", newStart);
  };
  */

  if (ideasLoading) {
    return <div className="p-4 text-center">Loading calendar data...</div>
  }

  if (ideasError) {
    return <div className="p-4 text-red-500 text-center">Error loading ideas: {ideasError.message}</div>
  }

  return (
    // The user example used "flex h-screen flex-1 flex-col scale-90"
    // Adjust container styling as needed for FullScreenCalendar
    <div className="flex flex-1 flex-col h-full"> 
      {/* 
        The title "Content Calendar" and view mode buttons were part of the old layout.
        FullScreenCalendar might be designed to take up the whole view or have its own chrome.
        Adjust this section based on how FullScreenCalendar should be integrated.
      */}
      <div className="mb-4 px-2 md:px-4 pt-2 md:pt-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Content Calendar</h1>
        {/* View mode buttons removed, FullScreenCalendar provides its own view */}
      </div>

      {/* 
        Render FullScreenCalendar.
        The 'data' prop is what we prepared as 'calendarData'.
        Check FullScreenCalendar's props for any other required or optional props (e.g., onEventClick, onDateChange).
      */}
      <div className="flex-1 overflow-auto"> {/* Added for potentially scrollable content if calendar itself doesn't manage it */}
        {calendarData.length > 0 ? (
          <FullScreenCalendar data={calendarData} />
        ) : (
          !ideasLoading && ( // Show only if not loading and no data
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No scheduled content to display in the calendar.</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
