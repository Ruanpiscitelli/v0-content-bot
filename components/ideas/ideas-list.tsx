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

// Added getStatusColor function for consistency with IdeasGrid
const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-500 text-green-50"
    case "scheduled":
      return "bg-blue-500 text-blue-50"
    case "draft":
    default:
      return "bg-gray-500 text-gray-50"
  }
}

export function IdeasList({ ideas, onEdit, onSchedule, onDelete }: IdeasListProps) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {ideas.map((idea) => {
        console.log("Rendering idea in List:", idea);
        return (
          <div key={idea.id} className="py-4 first:pt-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-bold truncate text-foreground">{idea.title}</h3>
                  </div>
                  <div className="flex items-center flex-shrink-0 ml-2">
                    <Badge
                      variant="outline"
                      className={`px-2 py-0.5 text-xs font-medium rounded-full mr-2 ${getStatusColor(idea.status)} border-transparent`}
                    >
                      {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                    </Badge>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onSelect={(e) => {
                            e.preventDefault();
                            onEdit(idea);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onSelect={(e) => {
                            e.preventDefault();
                            onSchedule(idea);
                          }}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {idea.scheduled_date ? "Reschedule" : "Schedule"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onSelect={(e) => {
                            e.preventDefault();
                            onDelete(idea);
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
                  {idea.idea_text}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                  {idea.tags && idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {idea.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Created on {format(parseISO(idea.created_at), "MM/dd/yyyy")}</span>
                  </div>
                </div>

                {idea.scheduled_date && (
                  <div className="flex items-center mt-3 text-xs text-[#01aef0] bg-[#01aef0]/10 p-1.5 rounded-md inline-flex">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>Scheduled for {format(parseISO(idea.scheduled_date), "MMMM dd, yyyy")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
