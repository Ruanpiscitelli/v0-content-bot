"use client"

import { useState } from "react"
import { Search, Grid3X3, List, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { trackEvent } from "@/lib/analytics"

// Template types and data
export type ContentTemplate = {
  id: string
  title: string
  description: string
  category: string
  platform: string
  tags: string[]
  prompt: string
  previewImage?: string
  popularity: number // 1-10 scale
}

const TEMPLATE_CATEGORIES = [
  "Todos",
  "Engajamento",
  "Vendas",
  "Educacional",
  "Inspiracional",
  "Promocional",
  "Storytelling",
]

const PLATFORMS = ["Todos", "Instagram", "Facebook", "Twitter", "LinkedIn", "YouTube", "TikTok", "Blog", "Email"]

// Sample templates data
const TEMPLATES: ContentTemplate[] = [
  {
    id: "template-1",
    title: "Carrossel Educativo",
    description: "Série de slides que explicam um conceito de forma simples e visual",
    category: "Educacional",
    platform: "Instagram",
    tags: ["carrossel", "educativo", "informativo"],
    prompt:
      "Crie um carrossel educativo sobre [TÓPICO] com 5 slides, cada um explicando um aspecto importante. Inclua uma introdução atraente e uma conclusão com call-to-action.",
    previewImage: "/templates/educational-carousel.png",
    popularity: 9,
  },
  {
    id: "template-2",
    title: "Pergunta Engajadora",
    description: "Pergunta aberta para estimular comentários e interações",
    category: "Engajamento",
    platform: "Facebook",
    tags: ["pergunta", "engajamento", "interação"],
    prompt:
      "Crie uma pergunta engajadora sobre [TÓPICO] que estimule meus seguidores a compartilhar suas experiências nos comentários. A pergunta deve ser aberta e provocativa.",
    previewImage: "/templates/engaging-question.png",
    popularity: 8,
  },
  {
    id: "template-3",
    title: "Promoção de Produto",
    description: "Post destacando benefícios de um produto sem parecer muito promocional",
    category: "Vendas",
    platform: "Instagram",
    tags: ["produto", "venda", "promoção"],
    prompt:
      "Crie um post para promover [PRODUTO] destacando seus 3 principais benefícios. Use storytelling para conectar com o público e inclua um call-to-action sutil no final.",
    previewImage: "/templates/product-promotion.png",
    popularity: 10,
  },
  {
    id: "template-4",
    title: "Thread Informativa",
    description: "Série de tweets conectados explicando um tópico complexo",
    category: "Educacional",
    platform: "Twitter",
    tags: ["thread", "informativo", "explicativo"],
    prompt:
      "Crie uma thread de 5 tweets sobre [TÓPICO] que explique o conceito de forma simples e informativa. Comece com um tweet impactante e termine com uma conclusão memorável.",
    previewImage: "/templates/informative-thread.png",
    popularity: 7,
  },
  {
    id: "template-5",
    title: "Depoimento de Cliente",
    description: "Post destacando a experiência positiva de um cliente",
    category: "Promocional",
    platform: "LinkedIn",
    tags: ["depoimento", "cliente", "social proof"],
    prompt:
      "Crie um post destacando o depoimento de um cliente sobre [PRODUTO/SERVIÇO]. Estruture como uma história de antes e depois, destacando os resultados obtidos e incluindo uma citação direta do cliente.",
    previewImage: "/templates/customer-testimonial.png",
    popularity: 8,
  },
  {
    id: "template-6",
    title: "Dica Rápida",
    description: "Dica prática e útil que pode ser implementada rapidamente",
    category: "Educacional",
    platform: "Instagram",
    tags: ["dica", "rápido", "prático"],
    prompt:
      "Compartilhe uma dica rápida e prática sobre [TÓPICO] que meus seguidores possam implementar hoje mesmo. A dica deve ser específica, acionável e trazer resultados visíveis.",
    previewImage: "/templates/quick-tip.png",
    popularity: 9,
  },
  {
    id: "template-7",
    title: "História Inspiradora",
    description: "Narrativa pessoal que inspira e motiva",
    category: "Inspiracional",
    platform: "Facebook",
    tags: ["história", "inspiração", "motivação"],
    prompt:
      "Crie uma história inspiradora sobre [TEMA/EXPERIÊNCIA] que conecte com meu público e transmita uma lição valiosa. A história deve ter um início cativante, um meio desafiador e um final motivador.",
    previewImage: "/templates/inspiring-story.png",
    popularity: 7,
  },
  {
    id: "template-8",
    title: "Roteiro para Reels",
    description: "Roteiro curto e dinâmico para vídeos de 30 segundos",
    category: "Engajamento",
    platform: "Instagram",
    tags: ["reels", "vídeo", "tendência"],
    prompt:
      "Crie um roteiro para um Reels de 30 segundos sobre [TÓPICO]. O vídeo deve ser dinâmico, com 3-4 cenas rápidas, incluir uma música sugerida e um gancho forte nos primeiros 3 segundos.",
    previewImage: "/templates/reels-script.png",
    popularity: 10,
  },
  {
    id: "template-9",
    title: "Newsletter Semanal",
    description: "Email informativo com as principais novidades da semana",
    category: "Educacional",
    platform: "Email",
    tags: ["newsletter", "email", "semanal"],
    prompt:
      "Crie uma newsletter semanal sobre [NICHO/INDÚSTRIA] com 3 seções: principais notícias da semana, uma dica útil e um recurso recomendado. Inclua uma introdução pessoal e um call-to-action no final.",
    previewImage: "/templates/weekly-newsletter.png",
    popularity: 6,
  },
  {
    id: "template-10",
    title: "Desafio para Seguidores",
    description: "Proposta de desafio para engajar a comunidade por vários dias",
    category: "Engajamento",
    platform: "Instagram",
    tags: ["desafio", "comunidade", "participação"],
    prompt:
      "Crie um desafio de 7 dias sobre [TÓPICO] para engajar meus seguidores. Cada dia deve ter uma tarefa simples e acionável, com instruções claras e um hashtag exclusivo para o desafio.",
    previewImage: "/templates/follower-challenge.png",
    popularity: 8,
  },
  {
    id: "template-11",
    title: "Comparativo Antes/Depois",
    description: "Post mostrando transformação ou evolução",
    category: "Promocional",
    platform: "Instagram",
    tags: ["antes/depois", "transformação", "resultado"],
    prompt:
      "Crie um post comparativo de antes/depois para [PRODUTO/SERVIÇO/TRANSFORMAÇÃO]. Destaque os principais pontos de mudança, explique o processo e inclua um testemunho sobre a experiência.",
    previewImage: "/templates/before-after.png",
    popularity: 9,
  },
  {
    id: "template-12",
    title: "Título de Blog Clickbait",
    description: "Títulos irresistíveis para artigos de blog",
    category: "Engajamento",
    platform: "Blog",
    tags: ["título", "blog", "clickbait"],
    prompt:
      "Gere 10 títulos clickbait para um artigo de blog sobre [TÓPICO]. Os títulos devem despertar curiosidade, criar urgência ou prometer benefícios claros, mas sem serem enganosos.",
    previewImage: "/templates/blog-titles.png",
    popularity: 7,
  },
]

interface ContentTemplatesLibraryProps {
  onSelectTemplate: (template: ContentTemplate) => void
}

export function ContentTemplatesLibrary({ onSelectTemplate }: ContentTemplatesLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedPlatform, setSelectedPlatform] = useState("Todos")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filter templates based on search, category, and platform
  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesSearch =
      searchQuery === "" ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "Todos" || template.category === selectedCategory
    const matchesPlatform = selectedPlatform === "Todos" || template.platform === selectedPlatform

    return matchesSearch && matchesCategory && matchesPlatform
  })

  // Sort templates by popularity
  const sortedTemplates = [...filteredTemplates].sort((a, b) => b.popularity - a.popularity)

  // Handle template selection
  const handleSelectTemplate = (template: ContentTemplate) => {
    trackEvent("template_selected", {
      template_id: template.id,
      template_title: template.title,
      template_category: template.category,
      template_platform: template.platform,
    })
    onSelectTemplate(template)
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Biblioteca de Templates</h2>
        <p className="text-gray-600">
          Escolha um template para começar seu conteúdo rapidamente ou personalize conforme suas necessidades.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Plataforma" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Templates Display */}
      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="popular">Populares</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="saved">Salvos</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="w-full">
          {sortedTemplates.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhum template encontrado com os filtros selecionados.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("Todos")
                  setSelectedPlatform("Todos")
                }}
              >
                Limpar filtros
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {template.previewImage && (
                    <div className="relative h-40 bg-gray-100">
                      <img
                        src={template.previewImage || "/placeholder.svg"}
                        alt={template.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-white text-black">{template.platform}</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleSelectTemplate(template)}>
                      Usar Template
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {template.previewImage && (
                    <div className="relative w-full sm:w-48 h-32 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={template.previewImage || "/placeholder.svg"}
                        alt={template.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-white text-black">{template.platform}</Badge>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{template.title}</h3>
                    <p className="text-gray-600 mt-1">{template.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Button size="sm" onClick={() => handleSelectTemplate(template)}>
                        Usar Template
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Seus templates recentes aparecerão aqui.</p>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Seus templates salvos aparecerão aqui.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
