"use client"

import { Calendar, Clock, Edit, MoreHorizontal, Trash } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Idea } from "@/hooks/useIdeas"

interface IdeasGridProps {
  ideas: Idea[]
  onEdit: (idea: Idea) => void
  onSchedule: (idea: Idea) => void
  onDelete: (idea: Idea) => void
}

export function IdeasGrid({ ideas, onEdit, onSchedule, onDelete }: IdeasGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ideas.map((idea) => (
        <Card key={idea.id} className="h-full flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{idea.title}</CardTitle>
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
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-gray-600 line-clamp-3">{idea.description}</p>

            {idea.scheduled_date && (
              <div className="flex items-center mt-3 text-xs text-[#01aef0] bg-[#01aef0]/10 p-1.5 rounded-md">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <span>Scheduled for {format(parseISO(idea.scheduled_date), "MMMM dd")}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-2 pb-3 gap-2">
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
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
