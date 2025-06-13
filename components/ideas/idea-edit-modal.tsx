"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RichTextEditor } from "./rich-text-editor"
import type { Idea } from "@/hooks/useIdeas"

interface IdeaEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (idea: Idea) => void
  idea: Idea
  availableTags: string[]
}

export function IdeaEditModal({ isOpen, onClose, onSave, idea, availableTags }: IdeaEditModalProps) {
  const [title, setTitle] = useState(idea.title)
  const [ideaText, setIdeaText] = useState(idea.description || "")
  const [tags, setTags] = useState<string[]>(idea.tags || [])
  const [newTag, setNewTag] = useState("")
  const [status, setStatus] = useState(idea.status || "draft")
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  const handleSubmit = async () => {
    const newErrors: { title?: string; description?: string } = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!ideaText.trim()) {
      newErrors.description = "Description is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const result = await onSave({
      ...idea,
      title: title.trim(),
      description: ideaText.trim(),
      tags: tags.length > 0 ? tags : [],
      status,
    })
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-background"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.body.style.pointerEvents = '';
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Idea</DialogTitle>
          <DialogDescription>
            Make changes to your content idea.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className={errors.title ? "text-red-500" : ""}>
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors({ ...errors, title: undefined })
              }}
              className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className={errors.description ? "text-red-500" : ""}>
              Description
            </Label>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
              <TabsList className="mb-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="write">
                <RichTextEditor 
                  content={ideaText}
                  onChange={(newContent) => {
                    setIdeaText(newContent)
                    if (errors.description) setErrors({ ...errors, description: undefined })
                  }}
                />
              </TabsContent>
              
              <TabsContent value="preview">
                <div className="min-h-[200px] p-3 border rounded-md bg-muted/10">
                  {ideaText ? (
                    <div dangerouslySetInnerHTML={{ __html: ideaText }} className="prose prose-sm max-w-none" />
                  ) : (
                    <p className="text-muted-foreground">No content to preview</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tag..."
                className="flex-grow"
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {availableTags.length > 0 && (
              <div className="mt-1">
                <p className="text-xs text-gray-500 mb-1">Existing tags:</p>
                <div className="flex flex-wrap gap-1">
                  {availableTags
                    .filter((tag) => !tags.includes(tag))
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => setTags([...tags, tag])}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pr-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 rounded-full hover:bg-gray-200 p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-[#01aef0] hover:bg-[#0099d6]">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
