"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Image, Video, Music, MessageSquare, Sparkles, FileText } from "lucide-react";
import Link from "next/link";

export default function CreatePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error loading user:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar informações do usuário",
        });
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [supabase, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você precisa estar logado para acessar esta página
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Fazer Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contentTypes = [
    {
      title: "Geração de Imagens",
      description: "Crie imagens incríveis com IA generativa",
      icon: Image,
      href: "/tools/image-generation",
      gradient: "from-pink-500 to-violet-500",
      available: true,
    },
    {
      title: "Geração de Vídeos",
      description: "Produza vídeos de alta qualidade usando IA",
      icon: Video,
      href: "/tools/video-generation",
      gradient: "from-blue-500 to-cyan-500",
      available: true,
    },
    {
      title: "Geração de Áudio",
      description: "Sintetize voz e áudio com tecnologia avançada",
      icon: Music,
      href: "/tools/audio-generation",
      gradient: "from-green-500 to-emerald-500",
      available: true,
    },
    {
      title: "Lip Sync",
      description: "Sincronize áudio com movimentos labiais",
      icon: MessageSquare,
      href: "/tools/lip-sync",
      gradient: "from-orange-500 to-red-500",
      available: true,
    },
    {
      title: "Chat Inteligente",
      description: "Converse com IA para gerar ideias e conteúdo",
      icon: MessageSquare,
      href: "/chat",
      gradient: "from-purple-500 to-indigo-500",
      available: true,
    },
    {
      title: "Ideias Criativas",
      description: "Explore e organize suas ideias de conteúdo",
      icon: Sparkles,
      href: "/ideas",
      gradient: "from-yellow-500 to-orange-500",
      available: true,
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <Plus className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold">Criar Conteúdo</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Escolha o tipo de conteúdo que deseja criar usando nossa plataforma de IA avançada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentTypes.map((type, index) => {
          const IconComponent = type.icon;
          
          return (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-secondary/20">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${type.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription className="text-sm">
                  {type.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {type.available ? (
                  <Button asChild className="w-full group-hover:scale-105 transition-transform duration-300">
                    <Link href={type.href}>
                      Começar
                      <Plus className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    Em Breve
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Dicas para Criar Conteúdo</span>
          </CardTitle>
          <CardDescription>
            Maximize o potencial das nossas ferramentas de IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-blue-800">Para Imagens:</h4>
                <p className="text-blue-700">Seja específico com descrições visuais, estilos e cores</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800">Para Vídeos:</h4>
                <p className="text-blue-700">Descreva a ação, cenário e duração desejada</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-blue-800">Para Áudio:</h4>
                <p className="text-blue-700">Escolha o idioma e forneça uma amostra de voz clara</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800">Para Ideias:</h4>
                <p className="text-blue-700">Use o chat para brainstorming e refinamento de conceitos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Galeria de Criações</CardTitle>
          <CardDescription>
            Veja todos os seus conteúdos criados em um só lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full md:w-auto">
            <Link href="/gallery">
              Ver Galeria
              <Image className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 