"use client"

import { MoreHorizontal, Calendar, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Idea } from "@/hooks/useIdeas"

interface IdeasGridProps {
  ideas: Idea[]
  onEdit: (idea: Idea) => void
  onSchedule: (idea: Idea) => void
  onDelete: (idea: Idea) => void
}

export function IdeasGrid({ ideas, onEdit, onSchedule, onDelete }: IdeasGridProps) {
  // Function to get the first X characters of text, preserving whole words and trying to end at punctuation
  const getExcerpt = (html: string, maxLength: number = 150) => {
    // Create a div to parse the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    if (text.length <= maxLength) return text;
    
    // Try to end at a sentence
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (sentences) {
      let excerpt = '';
      for (const sentence of sentences) {
        if ((excerpt + sentence).length <= maxLength) {
          excerpt += sentence;
        } else {
          return excerpt.trim();
        }
      }
      return excerpt.trim();
    }
    
    // If no punctuation, just cut at word boundary
    const excerptEndsAt = text.lastIndexOf(' ', maxLength);
    return text.substring(0, excerptEndsAt > 0 ? excerptEndsAt : maxLength) + '...';
  }

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

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea) => (
        <div 
          key={idea.id} 
          className="border rounded-lg p-4 flex flex-col bg-background shadow hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold truncate flex-1 mr-2 text-foreground">{idea.title}</h3>

            <div className="flex items-center">
              {/* <div
                className={`w-2.5 h-2.5 rounded-full mr-2 ${getStatusColor(idea.status)}`}
                title={idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
              /> */}
              <Badge 
                variant="outline" 
                className={`px-2 py-0.5 text-xs font-medium rounded-full mr-2 ${getStatusColor(idea.status || 'draft')} border-transparent`}
              >
                {(idea.status || 'draft').charAt(0).toUpperCase() + (idea.status || 'draft').slice(1)}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(idea)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSchedule(idea)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(idea)} className="text-red-600 focus:text-red-600">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 flex-grow overflow-hidden">
            {getExcerpt(idea.description || "")}
          </p>

          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {idea.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-500 mt-auto pt-2 border-t">
            {idea.created_at ? new Date(idea.created_at).toLocaleDateString() : 'Unknown date'}
          </div>
        </div>
      ))}
    </div>
  )
}
