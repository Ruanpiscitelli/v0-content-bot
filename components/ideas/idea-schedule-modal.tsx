"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Idea } from "@/hooks/useIdeas"

interface IdeaScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSchedule: (date: Date | null) => void
  idea: Idea
}

export function IdeaScheduleModal({ isOpen, onClose, onSchedule, idea }: IdeaScheduleModalProps) {
  const [date, setDate] = useState<Date | null>(idea.scheduled_date ? parseISO(idea.scheduled_date) : null)

  const handleSchedule = () => {
    onSchedule(date)
  }

  const handleClearDate = () => {
    setDate(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Idea</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-500 mb-4">
            Select a date to schedule <span className="font-medium">"{idea.title}"</span>
          </p>

          <div className="grid gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date || undefined} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            {date && (
              <Button variant="outline" onClick={handleClearDate}>
                Clear date
              </Button>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} className="bg-[#01aef0] hover:bg-[#0099d6]">
            {date ? "Schedule" : "Remove Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
