"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bell, Check, X, Info, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // Simulated notifications - in a real app these would come from the database
        if (user) {
          const mockNotifications: Notification[] = [
            {
              id: '1',
              title: 'Bem-vindo ao Virallyzer!',
              message: 'Sua conta foi criada com sucesso. Explore nossas ferramenias de IA para criar conteúdo incrível.',
              type: 'success',
              read: false,
              created_at: new Date().toISOString(),
            },
            {
              id: '2',
              title: 'Nova ferramenta disponível',
              message: 'A geração de áudio com XTTS-v2 está agora disponível! Teste a criação de vozes sintéticas multilíngues.',
              type: 'info',
              read: false,
              created_at: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: '3',
              title: 'Perfil atualizado',
              message: 'Suas informações de perfil foram atualizadas com sucesso.',
              type: 'success',
              read: true,
              created_at: new Date(Date.now() - 7200000).toISOString(),
            },
          ];
          setNotifications(mockNotifications);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar notificações",
        });
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [supabase, toast]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    toast({
      title: "Notificação marcada como lida",
      description: "A notificação foi marcada como lida.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "Todas as notificações marcadas como lidas",
      description: "Todas as notificações foram marcadas como lidas.",
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    toast({
      title: "Notificação removida",
      description: "A notificação foi removida com sucesso.",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Bell className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Notificações</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}` : 'Todas as notificações estão lidas'}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma notificação</h3>
            <p className="text-muted-foreground">
              Você não tem notificações no momento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`${!notification.read ? 'border-blue-200 bg-blue-50/50' : ''} transition-all duration-200`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="text-lg">{notification.title}</CardTitle>
                        {!notification.read && (
                          <Badge className="text-xs px-2 py-1 bg-blue-100 text-blue-800 border-blue-200">
                            Nova
                          </Badge>
                        )}
                        <Badge className={`text-xs px-2 py-1 ${getNotificationBadgeColor(notification.type)}`}>
                          {notification.type}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm">
                        {new Date(notification.created_at).toLocaleString('pt-BR')}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm">{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Notificação</CardTitle>
          <CardDescription>
            Gerencie como você recebe notificações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            As configurações de notificação estarão disponíveis em breve. Por enquanto, todas as notificações são exibidas aqui.
          </p>
          <Button variant="outline" asChild>
            <Link href="/settings">
              Ir para Configurações
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 