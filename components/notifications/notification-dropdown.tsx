"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

// Types for our notifications
export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  type: "message" | "mention" | "like" | "follow" | "system"
}

interface NotificationDropdownProps {
  isCollapsed: boolean
}

export default function NotificationDropdown({ isCollapsed }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Nova mensagem",
      message: "Você recebeu uma nova mensagem de @mariafernanda",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
      type: "message",
    },
    {
      id: "2",
      title: "Novo seguidor",
      message: "@carlos_silva começou a seguir você",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      type: "follow",
    },
    {
      id: "3",
      title: "Menção em comentário",
      message: "@juliana_costa mencionou você em um comentário",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      type: "mention",
    },
    {
      id: "4",
      title: "Curtida em seu post",
      message: "@roberto_almeida curtiu seu post recente",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true,
      type: "like",
    },
    {
      id: "5",
      title: "Atualização do sistema",
      message: "Novos recursos foram adicionados à plataforma",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      type: "system",
    },
  ])

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    trackEvent("notification_dropdown", { action: !isOpen ? "open" : "close" })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    trackEvent("notification_action", { action: "mark_as_read", id })
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    trackEvent("notification_action", { action: "mark_all_as_read" })
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        )
      case "mention":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
            </svg>
          </div>
        )
      case "like":
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
        )
      case "follow":
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
        )
      case "system":
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={cn(
          "relative flex items-center text-white rounded-lg transition-colors",
          "hover:bg-white/10 hover:text-white",
          isCollapsed ? "justify-center p-3" : "px-4 py-3",
          isOpen && "bg-white/20",
        )}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute bg-red-500 text-white text-xs rounded-full flex items-center justify-center",
              isCollapsed ? "-top-0.5 -right-0.5 w-5 h-5" : "top-2.5 left-7 w-4 h-4",
            )}
          >
            {unreadCount}
          </span>
        )}
        {!isCollapsed && <span className="ml-3">Notificações</span>}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 bg-white rounded-lg shadow-lg overflow-hidden",
            "w-80 max-h-[70vh] flex flex-col",
            isCollapsed ? "left-16" : "left-0",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Notificações</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-[#01aef0] hover:underline flex items-center">
                <Check className="w-3 h-3 mr-1" />
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Nenhuma notificação</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 border-b last:border-b-0 flex items-start gap-3",
                    !notification.read && "bg-blue-50",
                  )}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Mark as read"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t text-center">
            <a
              href="/notifications"
              className="text-sm text-[#01aef0] hover:underline"
              onClick={() => trackEvent("notification_action", { action: "view_all" })}
            >
              Ver todas as notificações
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
