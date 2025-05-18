"use client"

import { useState, useEffect } from "react"
// Removed Button as it's not used in the new structure directly for view modes
// import { Button } from "@/components/ui/button" 
// import ContentCalendar from "@/app/components/ContentCalendar" // Old calendar
import { FullScreenCalendar, type DayWithEvents } from "@/components/ui/fullscreen-calendar" // New calendar
import { toast } from "@/components/ui/use-toast" // Kept for potential future use, but not in current FullScreenCalendar example
import { useIdeas, type Idea as IdeaFromHook } from "@/hooks/useIdeas"
import { parseISO, format, startOfDay } from "date-fns"
import { Button } from "@/components/ui/button"

// Define the Event type expected by FullScreenCalendar (based on dummyEvents)
// Renomeando para FullScreenEventType para evitar conflito com o Event do DOM global se necessário em outros contextos.
interface FullScreenEventType {
  id: string | number;
  name: string;
  time: string; 
  datetime: string; 
  description?: string;
  // Adicione outros campos que você possa ter adicionado à interface Event em fullscreen-calendar.tsx
  // Por exemplo: platform?: string; status?: string;
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
  const [selectedEvent, setSelectedEvent] = useState<FullScreenEventType | null>(null); // Estado para o evento selecionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

  // Função para lidar com o clique no evento
  const handleEventClick = (event: FullScreenEventType) => {
    console.log("Event clicked:", event);
    setSelectedEvent(event);
    setIsModalOpen(true);
    // Aqui você abriria um modal para mostrar os detalhes do evento
    // Por exemplo: setShowEventModal(true);
    toast({
      title: "Event Clicked (Placeholder)",
      description: `Name: ${event.name} at ${event.time}. Implement modal to see details.`,
    });
  };

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
              description: idea.idea_text || "",
              // You can add other properties from 'idea' if FullScreenCalendar supports rendering them
              // e.g., status: idea.status
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
          <FullScreenCalendar 
            data={calendarData}
            onEventClick={handleEventClick} // Passar a função de clique aqui
          />
        ) : (
          !ideasLoading && ( // Show only if not loading and no data
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No scheduled content to display in the calendar.</p>
            </div>
          )
        )}
      </div>

      {/* Placeholder para o Modal de Visualização do Evento */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">{selectedEvent.name}</h2>
            <p className="text-sm text-muted-foreground mb-2">Time: {selectedEvent.time}</p>
            <p className="text-sm text-muted-foreground mb-4">Date: {format(parseISO(selectedEvent.datetime), "PPP")}</p>
            {/* Adicione mais detalhes do evento aqui */}
            <div className="mb-4">
              <strong className="block mb-1">Details:</strong>
              <div 
                className="prose dark:prose-invert max-w-none" // Adicionando classes do Tailwind Typography
                dangerouslySetInnerHTML={{ __html: selectedEvent.description || "No description available." }} 
              />
            </div>
            <Button onClick={() => setIsModalOpen(false)} variant="outline">Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}
