"use client"

import { Calendar, Clock, Edit, MoreHorizontal, Trash } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Idea } from "@/hooks/useIdeas"

interface IdeasListProps {
  ideas: Idea[]
  onEdit: (idea: Idea) => void
  onSchedule: (idea: Idea) => void
  onDelete: (idea: Idea) => void
}

export function IdeasList({ ideas, onEdit, onSchedule, onDelete }: IdeasListProps) {
  return (
    <div className="divide-y">
      {ideas.map((idea) => (
        <div key={idea.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium">{idea.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(idea)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSchedule(idea)}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {idea.scheduled_date ? "Reschedule" : "Schedule"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(idea)} className="text-red-600 focus:text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-gray-600 mt-1">{idea.description}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex flex-wrap gap-1.5">
                  {idea.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Created on {format(parseISO(idea.created_at), "MM/dd/yyyy")}</span>
                </div>
              </div>

              {idea.scheduled_date && (
                <div className="flex items-center mt-3 text-xs text-[#01aef0] bg-[#01aef0]/10 p-1.5 rounded-md inline-flex">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>Scheduled for {format(parseISO(idea.scheduled_date), "MMMM dd")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
