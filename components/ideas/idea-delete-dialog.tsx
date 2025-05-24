"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Idea } from "@/hooks/useIdeas"

interface IdeaDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  idea: Idea
}

export function IdeaDeleteDialog({ isOpen, onClose, onDelete, idea }: IdeaDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Idea</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the idea <span className="font-medium">"{idea.title}"</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
