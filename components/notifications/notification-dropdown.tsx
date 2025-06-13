"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"

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
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('left')
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New message",
      message: "You received a new message from @mariafernanda",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
      type: "message",
    },
    {
      id: "2",
      title: "New follower",
      message: "@carlos_silva started following you",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      type: "follow",
    },
    {
      id: "3",
      title: "Comment mention",
      message: "@juliana_costa mentioned you in a comment",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      type: "mention",
    },
    {
      id: "4",
      title: "Post liked",
      message: "@roberto_almeida liked your recent post",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true,
      type: "like",
    },
    {
      id: "5",
      title: "System update",
      message: "New features have been added to the platform",
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

  // Recalcular posição quando a janela for redimensionada
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && isCollapsed) {
        calculateDropdownPosition()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [isOpen, isCollapsed])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const toggleDropdown = () => {
    if (!isOpen) {
      // Calcular posição antes de abrir o dropdown
      calculateDropdownPosition()
    }
    setIsOpen(!isOpen)
    trackEvent("notification_dropdown", { action: !isOpen ? "open" : "close" })
  }

  const calculateDropdownPosition = () => {
    if (dropdownRef.current && isCollapsed) {
      const rect = dropdownRef.current.getBoundingClientRect()
      const dropdownWidth = 320 // w-80 = 320px
      const viewportWidth = window.innerWidth
      const spaceOnRight = viewportWidth - rect.right
      
      // Em dispositivos móveis (< 768px), sempre posicionar à direita
      if (viewportWidth < 768) {
        setDropdownPosition('right')
      } else if (spaceOnRight < dropdownWidth) {
        // Se não há espaço suficiente à direita, posiciona à esquerda
        setDropdownPosition('right')
      } else {
        setDropdownPosition('left')
      }
    } else {
      setDropdownPosition('left')
    }
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-pink-400/30 flex items-center justify-center text-pink-400">
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 flex items-center justify-center text-green-400">
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500/20 to-slate-500/20 border border-gray-400/30 flex items-center justify-center text-gray-300">
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
          "group relative flex items-center text-white rounded-xl transition-all duration-300",
          "hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20",
          "border border-transparent hover:border-cyan-400/30",
          isCollapsed ? "justify-center p-3" : "px-4 py-3",
          isOpen && "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/30 text-cyan-300",
        )}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg shadow-pink-500/50",
              isCollapsed ? "-top-0.5 -right-0.5 w-5 h-5" : "top-2.5 left-7 w-4 h-4",
            )}
          >
            {unreadCount}
          </span>
        )}
        {!isCollapsed && <span className="ml-3">Notifications</span>}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-xl shadow-2xl shadow-cyan-500/20 overflow-hidden border border-cyan-400/30",
            "w-80 max-h-[70vh] flex flex-col backdrop-blur-lg",
            // Posicionamento inteligente baseado no espaço disponível
            isCollapsed && dropdownPosition === 'left' && "left-16",
            isCollapsed && dropdownPosition === 'right' && "right-0",
            !isCollapsed && "left-0",
            // Garantir que nunca saia da tela em mobile
            "max-w-[calc(100vw-2rem)] sm:max-w-80",
            // Em telas muito pequenas, usar posicionamento fixo
            "sm:absolute fixed sm:mt-2 mt-1 sm:right-auto right-4 sm:left-auto",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-medium text-cyan-300">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline flex items-center transition-colors duration-300">
                <Check className="w-3 h-3 mr-1" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 border-b border-white/10 last:border-b-0 flex items-start gap-3 transition-all duration-300",
                    !notification.read && "bg-gradient-to-r from-cyan-500/10 to-purple-500/10",
                    "hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20",
                  )}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm text-white">{notification.title}</p>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: enUS })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-0.5 line-clamp-2">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors duration-300"
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
          <div className="p-3 border-t border-white/10 text-center">
            <a
              href="/notifications"
              className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-300"
              onClick={() => trackEvent("notification_action", { action: "view_all" })}
            >
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
