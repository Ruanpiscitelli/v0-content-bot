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
    return <div className="p-4 text-center bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading calendar data...</p>
      </div>
    </div>
  }

  if (ideasError) {
    return <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading ideas: {ideasError.message}</p>
        </div>
      </div>
    </div>
  }

  return (
    <div className="flex flex-1 flex-col h-full bg-gray-50"> 
      <div className="mb-4 px-4 md:px-6 pt-4 md:pt-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
      </div>

      <div className="flex-1 overflow-auto px-4 md:px-6 pb-4 md:pb-6">
        {calendarData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <FullScreenCalendar 
              data={calendarData}
              onEventClick={handleEventClick}
            />
          </div>
        ) : (
          !ideasLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <p className="text-gray-600">No scheduled content to display in the calendar.</p>
                <p className="text-sm text-gray-500 mt-2">Create some ideas and schedule them to see them here.</p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Modal melhorado */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedEvent.name}</h2>
              <div className="space-y-3 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-700">Time:</span>
                  <span className="text-sm text-gray-600 ml-2">{selectedEvent.time}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Date:</span>
                  <span className="text-sm text-gray-600 ml-2">{format(parseISO(selectedEvent.datetime), "PPP")}</span>
                </div>
              </div>
              
              {selectedEvent.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Details:</h3>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div 
                      className="text-sm text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedEvent.description }} 
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => setIsModalOpen(false)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
