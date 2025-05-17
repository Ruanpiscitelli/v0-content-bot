"use client"

import { useState } from "react"
import { ContentTemplatesLibrary, type ContentTemplate } from "@/components/templates/content-templates-library"
import { ContentEditor } from "@/components/editor/content-editor"
import { PlatformPreview } from "@/components/preview/platform-preview"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Share2, CalendarPlus, Sparkles, Wand2 } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

export default function CreateContentPage() {
  const [activeTab, setActiveTab] = useState("templates")
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null)
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [contentTitle, setContentTitle] = useState("")
  const [contentPrompt, setContentPrompt] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("instagram")
  const [contentStyle, setContentStyle] = useState("casual")

  const handleSelectTemplate = (template: ContentTemplate) => {
    setSelectedTemplate(template)
    setContentPrompt(template.prompt)
    setActiveTab("create")
    trackEvent("template_selected", { template_id: template.id, template_title: template.title })
  }

  const handleGenerateContent = async () => {
    if (!contentPrompt.trim()) return

    setIsGenerating(true)
    trackEvent("content_generation_started", {
      platform: selectedPlatform,
      style: contentStyle,
      prompt_length: contentPrompt.length,
    })

    try {
      // In a real implementation, this would call an API
      // For now, we'll simulate content generation with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate sample content based on platform
      let sampleContent = ""

      if (selectedPlatform === "instagram") {
        sampleContent = `✨ ${contentTitle || "Título do Post"} ✨\n\nVocê já parou para pensar como pequenas mudanças podem transformar completamente seus resultados? 🤔\n\nHoje quero compartilhar com você 3 estratégias que revolucionaram minha abordagem:\n\n1️⃣ Consistência acima de perfeição\n2️⃣ Foco em valor, não em volume\n3️⃣ Conexão autêntica com a audiência\n\nImplementei essas mudanças há apenas 30 dias e os resultados já são visíveis! Engajamento aumentou em 47% e as conversões dobraram. 📈\n\nE você, qual dessas estratégias vai implementar primeiro? Conta nos comentários! 👇\n\n#MarketingDigital #Estratégias #CrescimentoOrgânico`
      } else if (selectedPlatform === "twitter") {
        sampleContent = `Pequenas mudanças, grandes resultados:\n\n1. Consistência > Perfeição\n2. Valor > Volume\n3. Autenticidade > Tendências\n\nImplementei por 30 dias:\n• Engajamento +47%\n• Conversões +100%\n\nQual você tentaria primeiro?`
      } else if (selectedPlatform === "linkedin") {
        sampleContent = `3 Estratégias que Transformaram Meus Resultados em 30 Dias\n\nNo mundo acelerado do marketing digital, é fácil se perder em táticas sem resultados concretos. Após muita experimentação, identifiquei 3 princípios fundamentais que mudaram completamente minha abordagem:\n\n1. Consistência acima de perfeição\nPublicar regularmente, mesmo que não seja perfeito, construiu mais confiança com minha audiência do que posts esporádicos "perfeitos".\n\n2. Foco em valor, não em volume\nReduzir a quantidade de conteúdo para aumentar a qualidade resultou em maior engajamento por post.\n\n3. Conexão autêntica com a audiência\nResponder comentários e criar conteúdo baseado em perguntas reais gerou mais conversões que qualquer tática de venda.\n\nOs resultados após 30 dias:\n• 47% de aumento em engajamento\n• 100% de aumento em conversões\n• Crescimento de comunidade mais qualificada\n\nQual dessas estratégias você acredita que teria maior impacto no seu negócio?\n\n#MarketingDigital #Estratégias #ResultadosReais`
      } else {
        sampleContent = `3 Estratégias que Transformaram Meus Resultados\n\nVocê já parou para pensar como pequenas mudanças podem transformar completamente seus resultados?\n\nHoje quero compartilhar com você 3 estratégias que revolucionaram minha abordagem:\n\n1. Consistência acima de perfeição\n2. Foco em valor, não em volume\n3. Conexão autêntica com a audiência\n\nImplementei essas mudanças há apenas 30 dias e os resultados já são visíveis! Engajamento aumentou em 47% e as conversões dobraram.\n\nE você, qual dessas estratégias vai implementar primeiro? Compartilhe nos comentários!`
      }

      setGeneratedContent(sampleContent)
      setActiveTab("edit")
      trackEvent("content_generation_completed", { success: true })
    } catch (error) {
      console.error("Error generating content:", error)
      trackEvent("content_generation_completed", { success: false, error: String(error) })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveContent = (content: string) => {
    setGeneratedContent(content)
    // In a real implementation, this would save to a database
    trackEvent("content_saved", { platform: selectedPlatform, content_length: content.length })
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Criar Conteúdo</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="create">Criar</TabsTrigger>
          <TabsTrigger value="edit" disabled={!generatedContent}>
            Editar & Visualizar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Biblioteca de Templates</CardTitle>
              <CardDescription>Escolha um template para começar ou crie seu conteúdo do zero.</CardDescription>
            </CardHeader>
            <CardContent>
              <ContentTemplatesLibrary onSelectTemplate={handleSelectTemplate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Conteúdo</CardTitle>
              <CardDescription>Descreva o conteúdo que você deseja criar e personalize as opções.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="content-title">Título do Conteúdo</Label>
                  <Input
                    id="content-title"
                    placeholder="Ex: 3 Estratégias para Aumentar Engajamento"
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Plataforma</Label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Selecione a plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style">Estilo</Label>
                    <Select value={contentStyle} onValueChange={setContentStyle}>
                      <SelectTrigger id="style">
                        <SelectValue placeholder="Selecione o estilo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="professional">Profissional</SelectItem>
                        <SelectItem value="funny">Divertido</SelectItem>
                        <SelectItem value="informative">Informativo</SelectItem>
                        <SelectItem value="persuasive">Persuasivo</SelectItem>
                        <SelectItem value="storytelling">Storytelling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-prompt">Descrição do Conteúdo</Label>
                  <Textarea
                    id="content-prompt"
                    placeholder="Descreva o conteúdo que você deseja criar..."
                    className="min-h-[150px]"
                    value={contentPrompt}
                    onChange={(e) => setContentPrompt(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Seja específico sobre o tópico, tom, objetivo e público-alvo do seu conteúdo.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleGenerateContent}
                    disabled={!contentPrompt.trim() || isGenerating}
                    className="flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Gerar Conteúdo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Editar Conteúdo</CardTitle>
                <CardDescription>Refine seu conteúdo antes de publicar ou agendar.</CardDescription>
              </CardHeader>
              <CardContent>
                <ContentEditor
                  initialContent={generatedContent}
                  platform={selectedPlatform as any}
                  onSave={handleSaveContent}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pré-visualização</CardTitle>
                <CardDescription>Veja como seu conteúdo ficará na plataforma selecionada.</CardDescription>
              </CardHeader>
              <CardContent>
                <PlatformPreview
                  content={generatedContent}
                  platform={selectedPlatform as any}
                  image="/social-media-post.png"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setActiveTab("create")}>
              Voltar para Edição
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Salvar Rascunho
              </Button>
              <Button variant="outline" className="flex items-center">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Agendar
              </Button>
              <Button className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Publicar Agora
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
