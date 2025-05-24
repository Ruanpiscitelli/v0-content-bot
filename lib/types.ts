export interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  image?: string
  audioUrl?: string
  audioType?: string
}

export interface Idea {
  id: string
  title: string
  description: string
  tags?: string[]
  createdAt: Date
  scheduledDate?: Date | null
}
