"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Laptop, Smartphone, Tablet, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

type LoginEvent = {
  id: string
  created_at: string
  ip_address: string | null
  user_agent: string | null
  event_type: string
  status: string
  metadata: any
}

export function LoginHistoryCard() {
  const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLoginHistory = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = getSupabase()

        if (!supabase) {
          throw new Error("Supabase client not initialized")
        }

        // Obter o usuário atual
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user?.id) {
          throw new Error("User not authenticated")
        }

        // Buscar eventos de login
        const { data, error } = await supabase
          .from("auth_events")
          .select("*")
          .eq("user_id", user.id)
          .in("event_type", ["login_success", "login_failed", "login_attempt"])
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) {
          throw error
        }

        setLoginEvents(data || [])
      } catch (err) {
        console.error("Error fetching login history:", err)
        setError("Não foi possível carregar o histórico de login")
      } finally {
        setLoading(false)
      }
    }

    fetchLoginHistory()
  }, [])

  // Função para determinar o ícone do dispositivo com base no user agent
  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return <Laptop className="h-4 w-4" />

    const ua = userAgent.toLowerCase()

    if (ua.includes("iphone") || (ua.includes("android") && ua.includes("mobile"))) {
      return <Smartphone className="h-4 w-4" />
    } else if (ua.includes("ipad") || (ua.includes("android") && !ua.includes("mobile"))) {
      return <Tablet className="h-4 w-4" />
    } else {
      return <Laptop className="h-4 w-4" />
    }
  }

  // Função para obter o status do login
  const getStatusInfo = (status: string, eventType: string) => {
    if (eventType === "login_failed" || status === "failed") {
      return {
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        text: "Falha",
        className: "text-red-500",
      }
    } else if (eventType === "login_attempt" || status === "pending") {
      return {
        icon: <Clock className="h-4 w-4 text-yellow-500" />,
        text: "Tentativa",
        className: "text-yellow-500",
      }
    } else {
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        text: "Sucesso",
        className: "text-green-500",
      }
    }
  }

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      })
    } catch (e) {
      return "Data desconhecida"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Histórico de Login</CardTitle>
        <CardDescription>Seus logins recentes na plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : loginEvents.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Nenhum histórico de login encontrado</div>
        ) : (
          <div className="space-y-4">
            {loginEvents.map((event) => {
              const statusInfo = getStatusInfo(event.status, event.event_type)

              return (
                <div key={event.id} className="flex items-start space-x-3 border-b pb-3 last:border-0">
                  <div className="bg-gray-100 p-2 rounded-full">{getDeviceIcon(event.user_agent)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Login {event.ip_address ? `de ${event.ip_address}` : ""}</p>
                        <p className="text-xs text-gray-500">
                          {event.user_agent
                            ? event.user_agent.substring(0, 50) + (event.user_agent.length > 50 ? "..." : "")
                            : "Dispositivo desconhecido"}
                        </p>
                      </div>
                      <div className={`flex items-center space-x-1 ${statusInfo.className}`}>
                        {statusInfo.icon}
                        <span className="text-xs font-medium">{statusInfo.text}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(event.created_at)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
