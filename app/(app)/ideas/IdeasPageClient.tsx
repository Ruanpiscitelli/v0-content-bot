"use client"

import { useState } from "react"
import { Plus, Search, Grid, List, Tag, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IdeasGrid } from "@/components/ideas/ideas-grid"
import { IdeasList } from "@/components/ideas/ideas-list"
import { IdeaCreateModal } from "@/components/ideas/idea-create-modal"
import { IdeaEditModal } from "@/components/ideas/idea-edit-modal"
import { IdeaScheduleModal } from "@/components/ideas/idea-schedule-modal"
import { IdeaDeleteDialog } from "@/components/ideas/idea-delete-dialog"
import { useIdeas, type Idea, type NewIdea } from "@/hooks/useIdeas"
import { Skeleton } from "@/components/ui/skeleton"

interface IdeasPageClientProps {
  userId: string
}

export default function IdeasPageClient({ userId }: IdeasPageClientProps) {
  // Use our custom hook
  const { ideas, loading, error, createIdea, updateIdea, deleteIdea, scheduleIdea, getAllTags } = useIdeas(userId)

  // State for view mode (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // State for search
  const [searchTerm, setSearchTerm] = useState("")

  // State for tag filters
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // States for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null)

  // Filter ideas based on search and selected tags
  const filteredIdeas = ideas.filter((idea) => {
    // Filter by search term
    const matchesSearch =
      searchTerm === "" ||
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by selected tags
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => idea.tags?.includes(tag))

    return matchesSearch && matchesTags
  })

  // Handlers for CRUD operations
  const handleCreateIdea = async (newIdea: Omit<NewIdea, "status">) => {
    const result = await createIdea({
      ...newIdea,
      status: "draft",
    })
    if (result.success) {
      setIsCreateModalOpen(false)
    }
  }

  const handleEditIdea = async (updatedIdea: Idea) => {
    const { id, ...updates } = updatedIdea
    const result = await updateIdea(id, updates)
    if (result.success) {
      setIsEditModalOpen(false)
      setCurrentIdea(null)
    }
  }

  const handleScheduleIdea = async (ideaId: string, date: Date | null) => {
    const result = await scheduleIdea(ideaId, date)
    if (result.success) {
      setIsScheduleModalOpen(false)
      setCurrentIdea(null)
    }
  }

  const handleDeleteIdea = async (ideaId: string) => {
    const result = await deleteIdea(ideaId)
    if (result.success) {
      setIsDeleteDialogOpen(false)
      setCurrentIdea(null)
    }
  }

  // Handlers for opening modals
  const openEditModal = (idea: Idea) => {
    setCurrentIdea(idea)
    setIsEditModalOpen(true)
  }

  const openScheduleModal = (idea: Idea) => {
    setCurrentIdea(idea)
    setIsScheduleModalOpen(true)
  }

  const openDeleteDialog = (idea: Idea) => {
    setCurrentIdea(idea)
    setIsDeleteDialogOpen(true)
  }

  // Get all available tags
  const availableTags = getAllTags()

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Ideas Board</h1>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#01aef0] hover:bg-[#0099d6] text-xs md:text-sm h-9 md:h-10"
        >
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
          New Idea
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 md:mb-6">
        <div className="p-3 md:p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
            <Input
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full text-xs md:text-sm h-9 md:h-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 md:h-10 text-xs md:text-sm">
                  <Tag className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  Tags
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {availableTags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTags([...selectedTags, tag])
                      } else {
                        setSelectedTags(selectedTags.filter((t) => t !== tag))
                      }
                    }}
                    className="text-xs md:text-sm"
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
                {availableTags.length === 0 && (
                  <div className="px-2 py-1 text-xs md:text-sm text-gray-500">No tags available</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
              <TabsList className="h-9 md:h-10">
                <TabsTrigger value="grid" className="flex items-center gap-1 h-7 md:h-8 px-2 md:px-3">
                  <Grid className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline text-xs md:text-sm">Grid</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-1 h-7 md:h-8 px-2 md:px-3">
                  <List className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline text-xs md:text-sm">List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="p-3 md:p-4">
          {loading ? (
            // Loading state
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6 mb-3" />
                  <div className="flex gap-1 mb-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredIdeas.length === 0 ? (
            // Empty state
            <div className="text-center py-8 md:py-12">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Filter className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
              </div>
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1">No ideas found</h3>
              <p className="text-sm text-gray-500">
                {searchTerm || selectedTags.length > 0
                  ? "Try adjusting your search filters"
                  : "Start by creating your first idea"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            // Grid view
            <IdeasGrid
              ideas={filteredIdeas}
              onEdit={openEditModal}
              onSchedule={openScheduleModal}
              onDelete={openDeleteDialog}
            />
          ) : (
            // List view
            <IdeasList
              ideas={filteredIdeas}
              onEdit={openEditModal}
              onSchedule={openScheduleModal}
              onDelete={openDeleteDialog}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <IdeaCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateIdea}
        availableTags={availableTags}
      />

      {currentIdea && (
        <>
          <IdeaEditModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false)
              setCurrentIdea(null)
            }}
            onSave={handleEditIdea}
            idea={currentIdea}
            availableTags={availableTags}
          />

          <IdeaScheduleModal
            isOpen={isScheduleModalOpen}
            onClose={() => {
              setIsScheduleModalOpen(false)
              setCurrentIdea(null)
            }}
            onSchedule={(date) => handleScheduleIdea(currentIdea.id, date)}
            idea={currentIdea}
          />

          <IdeaDeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false)
              setCurrentIdea(null)
            }}
            onDelete={() => handleDeleteIdea(currentIdea.id)}
            idea={currentIdea}
          />
        </>
      )}
    </div>
  )
}
