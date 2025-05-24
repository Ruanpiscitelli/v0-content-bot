"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  ThumbsUp,
  Send,
  Repeat,
  MoreHorizontal,
  Download,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PlatformPreviewProps {
  content: string
  image?: string
  username?: string
  userAvatar?: string
  platform?: "instagram" | "facebook" | "twitter" | "linkedin" | "all"
}

export function PlatformPreview({
  content,
  image = "",
  username = "seu_perfil",
  userAvatar = "/woman-profile.png",
  platform = "all",
}: PlatformPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>(platform !== "all" ? platform : "instagram")

  const formattedDate = formatDistanceToNow(new Date(), {
    addSuffix: true,
    locale: ptBR,
  })

  // Process content for different platforms
  const processedContent = {
    instagram: content.replace(/#([^\s#]+)/g, '<span class="text-blue-500">#$1</span>'),
    facebook: content,
    twitter: content
      .replace(/#([^\s#]+)/g, '<span class="text-blue-500">#$1</span>')
      .replace(/@([^\s@]+)/g, '<span class="text-blue-500">@$1</span>'),
    linkedin: content,
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Pré-visualização</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="instagram" disabled={platform !== "all" && platform !== "instagram"}>
            <Instagram className="h-4 w-4 mr-2" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="facebook" disabled={platform !== "all" && platform !== "facebook"}>
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </TabsTrigger>
          <TabsTrigger value="twitter" disabled={platform !== "all" && platform !== "twitter"}>
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </TabsTrigger>
          <TabsTrigger value="linkedin" disabled={platform !== "all" && platform !== "linkedin"}>
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </TabsTrigger>
        </TabsList>

        {/* Instagram Preview */}
        <TabsContent value="instagram">
          <Card className="border-none shadow-md max-w-md mx-auto">
            <CardContent className="p-0">
              <div className="bg-white rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center p-3 border-b">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <Image
                      src={userAvatar || "/placeholder.svg"}
                      alt={username}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{username}</p>
                  </div>
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </div>

                {/* Image */}
                {image && (
                  <div className="aspect-square bg-gray-100 relative">
                    <Image src={image || "/placeholder.svg"} alt="Post content" fill className="object-cover" />
                  </div>
                )}

                {/* Actions */}
                <div className="p-3 flex justify-between">
                  <div className="flex space-x-4">
                    <Heart className="h-6 w-6 text-gray-700" />
                    <MessageCircle className="h-6 w-6 text-gray-700" />
                    <Send className="h-6 w-6 text-gray-700" />
                  </div>
                  <Bookmark className="h-6 w-6 text-gray-700" />
                </div>

                {/* Likes */}
                <div className="px-3 pb-2">
                  <p className="text-sm font-semibold">127 curtidas</p>
                </div>

                {/* Caption */}
                <div className="px-3 pb-3">
                  <p className="text-sm">
                    <span className="font-semibold mr-1">{username}</span>
                    <span dangerouslySetInnerHTML={{ __html: processedContent.instagram }} />
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Ver todos os 24 comentários</p>
                  <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facebook Preview */}
        <TabsContent value="facebook">
          <Card className="border-none shadow-md max-w-md mx-auto">
            <CardContent className="p-0">
              <div className="bg-white rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center p-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={userAvatar || "/placeholder.svg"}
                      alt={username}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{username}</p>
                    <p className="text-xs text-gray-500">{formattedDate} · 🌎</p>
                  </div>
                  <MoreHorizontal className="h-5 w-5 text-gray-500 ml-auto" />
                </div>

                {/* Content */}
                <div className="px-3 pb-3">
                  <p className="text-sm mb-3">{processedContent.facebook}</p>
                </div>

                {/* Image */}
                {image && (
                  <div className="aspect-video bg-gray-100 relative">
                    <Image src={image || "/placeholder.svg"} alt="Post content" fill className="object-cover" />
                  </div>
                )}

                {/* Stats */}
                <div className="px-3 py-2 border-t border-b flex justify-between text-xs text-gray-500">
                  <div>127 curtidas</div>
                  <div>24 comentários · 5 compartilhamentos</div>
                </div>

                {/* Actions */}
                <div className="px-3 py-1 flex justify-between">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <ThumbsUp className="h-5 w-5 mr-2" />
                    Curtir
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Comentar
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Share2 className="h-5 w-5 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Twitter Preview */}
        <TabsContent value="twitter">
          <Card className="border-none shadow-md max-w-md mx-auto">
            <CardContent className="p-0">
              <div className="bg-white rounded-lg overflow-hidden p-4">
                {/* Header */}
                <div className="flex">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={userAvatar || "/placeholder.svg"}
                      alt={username}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-semibold">{username}</p>
                      <p className="text-gray-500 text-sm ml-2">
                        @{username} · {formattedDate}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="mt-1">
                      <p className="text-sm" dangerouslySetInnerHTML={{ __html: processedContent.twitter }} />
                    </div>

                    {/* Image */}
                    {image && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                        <div className="aspect-video bg-gray-100 relative">
                          <Image src={image || "/placeholder.svg"} alt="Post content" fill className="object-cover" />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between mt-3 text-gray-500 max-w-md">
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs ml-1">24</span>
                      </div>
                      <div className="flex items-center">
                        <Repeat className="h-4 w-4" />
                        <span className="text-xs ml-1">5</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4" />
                        <span className="text-xs ml-1">127</span>
                      </div>
                      <div className="flex items-center">
                        <Share2 className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LinkedIn Preview */}
        <TabsContent value="linkedin">
          <Card className="border-none shadow-md max-w-md mx-auto">
            <CardContent className="p-0">
              <div className="bg-white rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-start p-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <Image
                      src={userAvatar || "/placeholder.svg"}
                      alt={username}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{username}</p>
                    <p className="text-xs text-gray-500">Profissional de Marketing Digital</p>
                    <p className="text-xs text-gray-500">{formattedDate} · 🌎</p>
                  </div>
                  <MoreHorizontal className="h-5 w-5 text-gray-500 ml-auto" />
                </div>

                {/* Content */}
                <div className="px-3 pb-3">
                  <p className="text-sm">{processedContent.linkedin}</p>
                </div>

                {/* Image */}
                {image && (
                  <div className="aspect-video bg-gray-100 relative">
                    <Image src={image || "/placeholder.svg"} alt="Post content" fill className="object-cover" />
                  </div>
                )}

                {/* Stats */}
                <div className="px-3 py-2 border-t flex items-center text-xs text-gray-500">
                  <ThumbsUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span>127</span>
                  <span className="mx-1">·</span>
                  <span>24 comentários</span>
                </div>

                {/* Actions */}
                <div className="px-3 py-1 flex justify-between border-t">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <ThumbsUp className="h-5 w-5 mr-2" />
                    Gostei
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Comentar
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Share2 className="h-5 w-5 mr-2" />
                    Compartilhar
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Send className="h-5 w-5 mr-2" />
                    Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-4">
        <Button variant="outline" size="sm" className="mr-2">
          <Download className="h-4 w-4 mr-2" />
          Salvar Imagem
        </Button>
        <Button size="sm">Agendar Publicação</Button>
      </div>
    </div>
  )
}
