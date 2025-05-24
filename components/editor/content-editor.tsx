"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PlatformPreview } from "@/components/preview/platform-preview"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Hash,
  AtSign,
  Smile,
  ImageIcon,
  RefreshCw,
  Save,
  Copy,
  Check,
  Wand2,
  Sparkles,
} from "lucide-react"
import { trackEvent } from "@/lib/analytics"

interface ContentEditorProps {
  initialContent: string
  platform?: "instagram" | "facebook" | "twitter" | "linkedin" | "all"
  onSave?: (content: string) => void
}

export function ContentEditor({ initialContent = "", platform = "all", onSave }: ContentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [originalContent, setOriginalContent] = useState(initialContent)
  const [isCopied, setIsCopied] = useState(false)
  const [tone, setTone] = useState(50) // 0-100 scale: formal to casual
  const [includeEmojis, setIncludeEmojis] = useState(true)
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setContent(initialContent)
    setOriginalContent(initialContent)
  }, [initialContent])

  const handleFormatClick = (format: string) => {
    if (!editorRef.current) return

    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = ""
    let cursorPosition = 0

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        cursorPosition = 2
        break
      case "italic":
        formattedText = `*${selectedText}*`
        cursorPosition = 1
        break
      case "underline":
        formattedText = `_${selectedText}_`
        cursorPosition = 1
        break
      case "list":
        formattedText = selectedText
          .split("\n")
          .map((line) => `• ${line}`)
          .join("\n")
        break
      case "ordered-list":
        formattedText = selectedText
          .split("\n")
          .map((line, i) => `${i + 1}. ${line}`)
          .join("\n")
        break
      case "hashtag":
        formattedText = `#${selectedText.replace(/\s+/g, "")}`
        break
      case "mention":
        formattedText = `@${selectedText.replace(/\s+/g, "")}`
        break
      default:
        return
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
    }, 0)
  }

  const handleAlignClick = (alignment: string) => {
    if (!editorRef.current) return

    const textarea = editorRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    // Find the start and end of the current paragraph
    let paragraphStart = start
    while (paragraphStart > 0 && content[paragraphStart - 1] !== "\n") {
      paragraphStart--
    }

    let paragraphEnd = end
    while (paragraphEnd < content.length && content[paragraphEnd] !== "\n") {
      paragraphEnd++
    }

    const beforeParagraph = content.substring(0, paragraphStart)
    const paragraph = content.substring(paragraphStart, paragraphEnd)
    const afterParagraph = content.substring(paragraphEnd)

    // Remove any existing alignment markers
    const cleanParagraph = paragraph.replace(/^(center:|right:|left:)\s*/i, "")

    // Add the new alignment marker
    let alignedParagraph = cleanParagraph
    if (alignment !== "left") {
      alignedParagraph = `${alignment}: ${cleanParagraph}`
    }

    const newContent = beforeParagraph + alignedParagraph + afterParagraph
    setContent(newContent)
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
    trackEvent("content_copied", { platform, content_length: content.length })
  }

  const handleResetContent = () => {
    setContent(originalContent)
    trackEvent("content_reset", { platform })
  }

  const handleSaveContent = () => {
    if (onSave) {
      onSave(content)
    }
    trackEvent("content_saved", { platform, content_length: content.length })
  }

  const enhanceContent = async () => {
    setIsEnhancing(true)
    trackEvent("content_enhancement_requested", {
      tone: tone,
      include_emojis: includeEmojis,
      include_hashtags: includeHashtags,
    })

    try {
      // In a real implementation, this would call an API
      // For now, we'll simulate an enhancement with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate enhanced content
      let enhancedContent = content

      // Add emojis if requested
      if (includeEmojis) {
        if (platform === "instagram" || platform === "all") {
          enhancedContent = enhancedContent.replace(/conteúdo/gi, "conteúdo 🚀")
          enhancedContent = enhancedContent.replace(/incrível/gi, "incrível ✨")
          enhancedContent = enhancedContent + "\n\n✨ Compartilhe se você gostou! 💙"
        }
      }

      // Add hashtags if requested
      if (includeHashtags) {
        if (platform === "instagram" || platform === "twitter" || platform === "all") {
          enhancedContent = enhancedContent + "\n\n#ConteúdoDigital #MarketingDeConteúdo #DicasDeMarketing"
        }
      }

      // Adjust tone
      if (tone < 30) {
        // More formal
        enhancedContent = enhancedContent.replace(/você/gi, "o(a) senhor(a)")
        enhancedContent = enhancedContent.replace(/olá/gi, "Prezado(a)")
      } else if (tone > 70) {
        // More casual
        enhancedContent = enhancedContent.replace(/olá/gi, "E aí")
        enhancedContent = enhancedContent.replace(/obrigado/gi, "valeu")
      }

      setContent(enhancedContent)
      trackEvent("content_enhanced", { success: true })
    } catch (error) {
      console.error("Error enhancing content:", error)
      trackEvent("content_enhanced", { success: false, error: String(error) })
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Editar</TabsTrigger>
          <TabsTrigger value="preview">Pré-visualizar</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          <div className="bg-white border rounded-md p-2">
            <div className="flex flex-wrap gap-1 border-b pb-2 mb-2">
              <Button variant="ghost" size="sm" onClick={() => handleFormatClick("bold")} className="h-8 w-8 p-0">
                <Bold className="h-4 w-4" />
                <span className="sr-only">Bold</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleFormatClick("italic")} className="h-8 w-8 p-0">
                <Italic className="h-4 w-4" />
                <span className="sr-only">Italic</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleFormatClick("underline")} className="h-8 w-8 p-0">
                <Underline className="h-4 w-4" />
                <span className="sr-only">Underline</span>
              </Button>
              <span className="w-px h-6 bg-gray-300 mx-1 self-center"></span>
              <Button variant="ghost" size="sm" onClick={() => handleAlignClick("left")} className="h-8 w-8 p-0">
                <AlignLeft className="h-4 w-4" />
                <span className="sr-only">Align Left</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleAlignClick("center")} className="h-8 w-8 p-0">
                <AlignCenter className="h-4 w-4" />
                <span className="sr-only">Align Center</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleAlignClick("right")} className="h-8 w-8 p-0">
                <AlignRight className="h-4 w-4" />
                <span className="sr-only">Align Right</span>
              </Button>
              <span className="w-px h-6 bg-gray-300 mx-1 self-center"></span>
              <Button variant="ghost" size="sm" onClick={() => handleFormatClick("list")} className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
                <span className="sr-only">Bullet List</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFormatClick("ordered-list")}
                className="h-8 w-8 p-0"
              >
                <ListOrdered className="h-4 w-4" />
                <span className="sr-only">Numbered List</span>
              </Button>
              <span className="w-px h-6 bg-gray-300 mx-1 self-center"></span>
              <Button variant="ghost" size="sm" onClick={() => handleFormatClick("hashtag")} className="h-8 w-8 p-0">
                <Hash className="h-4 w-4" />
                <span className="sr-only">Hashtag</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleFormatClick("mention")} className="h-8 w-8 p-0">
                <AtSign className="h-4 w-4" />
                <span className="sr-only">Mention</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Smile className="h-4 w-4" />
                <span className="sr-only">Emoji</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">Image</span>
              </Button>
            </div>

            <textarea
              ref={editorRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[200px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Digite ou edite seu conteúdo aqui..."
            />

            <div className="flex justify-between mt-4">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleResetContent} className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Resetar
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyContent} className="flex items-center">
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              <Button variant="default" size="sm" onClick={handleSaveContent} className="flex items-center">
                <Save className="h-4 w-4 mr-1" />
                Salvar
              </Button>
            </div>
          </div>

          <div className="bg-white border rounded-md p-4">
            <h3 className="text-sm font-medium mb-3">Aprimorar Conteúdo</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="tone-slider">Tom</Label>
                  <span className="text-xs text-gray-500">
                    {tone < 30 ? "Formal" : tone > 70 ? "Casual" : "Equilibrado"}
                  </span>
                </div>
                <Slider
                  id="tone-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={[tone]}
                  onValueChange={(value) => setTone(value[0])}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="include-emojis" className="cursor-pointer">
                  Incluir emojis
                </Label>
                <Switch id="include-emojis" checked={includeEmojis} onCheckedChange={setIncludeEmojis} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="include-hashtags" className="cursor-pointer">
                  Incluir hashtags
                </Label>
                <Switch id="include-hashtags" checked={includeHashtags} onCheckedChange={setIncludeHashtags} />
              </div>

              <Button className="w-full" onClick={enhanceContent} disabled={isEnhancing}>
                {isEnhancing ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Aprimorando...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Aprimorar Conteúdo
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <PlatformPreview content={content} platform={platform} image="/social-media-post.png" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
