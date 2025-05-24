"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useProfile } from "@/hooks/useProfile"
import { useToast } from "@/hooks/use-toast"
import {
  LayoutDashboard,
  TrendingUp,
  Calendar,
  Settings,
  Menu,
  X,
  Instagram,
  Lightbulb,
  ChevronDown,
  User,
  LogOut,
  MessageSquare,
  PlusCircle,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Rocket,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"
import NotificationDropdown from "./notifications/notification-dropdown"

function UserProfileSection({
  isCollapsed,
  user,
  onLogoutClick,
  isLoading = false,
}: {
  isCollapsed: boolean
  user?: { name?: string; avatar_url?: string }
  onLogoutClick: () => void
  isLoading?: boolean
}) {
  const displayName = isLoading ? "Carregando..." : (user?.name || "Usuário")
  const avatarUrl = user?.avatar_url
  return (
    <div className={cn("mt-1 mb-2 px-3 py-2", isCollapsed ? "flex justify-center" : "border-t border-white/10")}>
      {isCollapsed ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 hover:from-cyan-500/30 hover:to-purple-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-400/50">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${displayName}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="19" fill="url(#avatar-gradient)" stroke="#00d4ff" strokeWidth="2" />
                    <circle cx="20" cy="15" r="6" fill="#1e1b4b" />
                    <path d="M8 32C8 25.3726 13.3726 20 20 20C26.6274 20 32 25.3726 32 32V38H8V32Z" fill="#1e1b4b" />
                    <defs>
                      <linearGradient id="avatar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00d4ff" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-white shadow-lg shadow-green-400/50"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 border border-cyan-400/30 shadow-xl shadow-cyan-500/20">
            <div className="flex flex-col items-center gap-1 p-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-400/50">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${displayName}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="19" fill="url(#avatar-gradient-2)" stroke="#00d4ff" strokeWidth="2" />
                    <circle cx="20" cy="15" r="6" fill="#1e1b4b" />
                    <path d="M8 32C8 25.3726 13.3726 20 20 20C26.6274 20 32 25.3726 32 32V38H8V32Z" fill="#1e1b4b" />
                    <defs>
                      <linearGradient id="avatar-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00d4ff" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>
              <p className="font-medium text-sm text-cyan-300">{displayName}</p>
              <p className="text-xs text-purple-300">Member</p>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="cursor-pointer text-sm text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:text-cyan-300 transition-all duration-300" asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="cursor-pointer text-sm text-red-400 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 hover:text-red-300 transition-all duration-300" onClick={onLogoutClick}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="relative">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-400/50">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={`${displayName}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="19" fill="url(#avatar-gradient-3)" stroke="#00d4ff" strokeWidth="2" />
                      <circle cx="20" cy="15" r="6" fill="#1e1b4b" />
                      <path d="M8 32C8 25.3726 13.3726 20 20 20C26.6274 20 32 25.3726 32 32V38H8V32Z" fill="#1e1b4b" />
                      <defs>
                        <linearGradient id="avatar-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00d4ff" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-white shadow-lg shadow-green-400/50"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cyan-300 truncate">{displayName}</p>
                <p className="text-xs text-purple-300 truncate">Member</p>
              </div>
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 border border-cyan-400/30 shadow-xl shadow-cyan-500/20">
            <DropdownMenuItem className="cursor-pointer text-sm text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:text-cyan-300 transition-all duration-300" asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="cursor-pointer text-sm text-red-400 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 hover:text-red-300 transition-all duration-300" onClick={onLogoutClick}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default function AppSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { signOut } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const { toast } = useToast()

  // Transform profile data to the format expected by UserProfileSection
  const userData = profile ? {
    name: profile.full_name || profile.username || "Usuário",
    avatar_url: profile.avatar_url
  } : {
    name: "Usuário",
    avatar_url: null
  }

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
    trackEvent("logout_dialog_open")
  }

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true)
      trackEvent("logout_confirmed")

      const result = await signOut()

      if (result.success) {
        // Show success toast notification
        toast({
          title: "Logout realizado com sucesso!",
          description: "Você foi desconectado da sua conta.",
          variant: "default",
          duration: 3000,
          className: "cartoon-border",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        })

        // Record successful logout event
        trackEvent("logout_successful")

        // Note: The redirect to login page is handled by the signOut function
        // or by the auth middleware, so we don't need to handle it here
      } else {
        console.error("Erro ao fazer logout:", result.error)

        // Show error toast notification
        toast({
          title: "Erro ao fazer logout",
          description: "Ocorreu um problema ao tentar desconectar. Tente novamente.",
          variant: "destructive",
          duration: 5000,
          className: "cartoon-border",
        })

        trackEvent("logout_error", { error: result.error })
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error)

      // Show error toast notification
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um problema ao tentar desconectar. Tente novamente.",
        variant: "destructive",
        duration: 5000,
        className: "cartoon-border",
      })

      trackEvent("logout_error", { error: String(error) })
    } finally {
      setIsLoggingOut(false)
      setShowLogoutDialog(false)
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false)
    trackEvent("logout_cancelled")
  }

  const pathname = usePathname()

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar")
      const toggle = document.getElementById("sidebar-toggle")

      if (sidebar && !sidebar.contains(event.target as Node) && toggle && !toggle.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
    trackEvent("sidebar_toggle", { new_state: !isOpen ? "open" : "closed" })
  }

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
    trackEvent("sidebar_collapse", { new_state: !isCollapsed ? "collapsed" : "expanded" })
  }

  // Updated navigation items focused on content creation
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      active: pathname === "/dashboard",
    },
    {
      name: "Create Content",
      href: "/chat",
      icon: <MessageSquare className="w-5 h-5" />,
      active: pathname === "/chat",
      highlight: true, // Highlight this item since we removed the quick action button
    },
    {
      name: "Ideas Bank",
      href: "/ideas",
      icon: <Lightbulb className="w-5 h-5" />,
      active: pathname === "/ideas",
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: <Calendar className="w-5 h-5" />,
      active: pathname === "/calendar",
    },
    {
      name: "Trends",
      href: "/trends",
      icon: <TrendingUp className="w-5 h-5" />,
      active: pathname === "/trends",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
      active: pathname === "/settings",
    },
  ]

  useEffect(() => {
    // Add a class to the body when the sidebar is open on mobile
    if (isOpen) {
      document.body.classList.add("sidebar-open")
    } else {
      document.body.classList.remove("sidebar-open")
    }

    return () => {
      document.body.classList.remove("sidebar-open")
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        id="sidebar-toggle"
        onClick={toggleSidebar}
        className="fixed top-3 left-3 z-50 p-2 rounded-md bg-white cartoon-border md:hidden hover:bg-gray-100 transition-all"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile Quick Create Button */}
      <Link
        href="/chat"
        className="md:hidden fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"
        aria-label="Create content"
        onClick={() => trackEvent("mobile_quick_create")}
      >
        <PlusCircle className="w-6 h-6" />
      </Link>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out",
          "md:translate-x-0",
          isCollapsed ? "md:w-16" : "md:w-64",
          "w-[250px] -translate-x-full",
          isOpen && "translate-x-0",
          "flex flex-col cartoon-border border-r-2 border-t-0 border-l-0 border-b-0",
        )}
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #581c87 75%, #6b21a8 100%)",
        }}
        aria-label="Sidebar"
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-pink-500/20 opacity-50 blur-xl pointer-events-none"></div>
        
        {/* Logo */}
        <div
          className={cn(
            "relative z-10 flex justify-center items-center border-b border-white/10",
            isCollapsed ? "p-3 pt-4 pb-3" : "px-2 pt-3 pb-2",
          )}
        >
          {isCollapsed ? (
            <div className="relative w-12 h-12 animate-float">
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 hover:opacity-75 transition-opacity duration-300"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full py-4">
              <div className="relative flex items-center">
                <div className="relative w-12 h-12 mr-3 animate-float">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  {/* Glowing effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 hover:opacity-75 transition-opacity duration-300"></div>
                </div>
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Virallyzer
                </h1>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 px-3 pb-4 space-y-1.5 overflow-y-auto">
          <NotificationDropdown isCollapsed={isCollapsed} />

          {/* Main navigation items */}
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2.5 text-white rounded-xl transition-all duration-300 text-sm relative overflow-hidden",
                "hover:bg-gradient-to-r hover:from-cyan-500/20 hover:via-purple-500/20 hover:to-pink-500/20",
                "hover:shadow-lg hover:shadow-cyan-500/20 hover:text-cyan-300 hover:translate-x-1",
                "border border-transparent hover:border-cyan-400/30",
                item.active && "bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 font-medium backdrop-blur-sm border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/25",
                item.highlight && !item.active && "bg-gradient-to-r from-purple-500/20 to-pink-500/20 font-medium border-purple-400/30", 
                isCollapsed && "justify-center px-2",
              )}
              onClick={() => trackEvent("sidebar_navigation", { destination: item.name.toLowerCase() })}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              
              <div className="relative z-10 flex items-center w-full">
                <div className={cn(
                  "transition-colors duration-300",
                  item.active ? "text-cyan-300" : "text-white group-hover:text-cyan-300"
                )}>
              {item.icon}
                </div>
              {!isCollapsed && (
                <>
                  <span className="ml-3">{item.name}</span>
                  {item.highlight && !item.active && (
                      <span className="ml-auto px-1.5 py-0.5 text-[10px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                        New
                      </span>
                  )}
                    {item.active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 shadow-lg shadow-cyan-400/50"></span>
                    )}
                </>
              )}
              {isCollapsed && item.highlight && !item.active && (
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg shadow-purple-400/50"></span>
              )}
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="relative z-10">
                        <UserProfileSection 
                  isCollapsed={isCollapsed} 
                  user={userData} 
                  onLogoutClick={handleLogoutClick}
                  isLoading={profileLoading}
                />
        </div>

        {/* Footer */}
        <div
          className={cn(
            "relative z-10 p-3 mt-auto border-t border-white/10 transition-all duration-300",
            isCollapsed ? "p-2" : "hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10",
          )}
        >
          {isCollapsed ? (
            <div className="flex justify-center">
              <Instagram className="w-4 h-4 text-cyan-300 hover:text-pink-400 transition-colors duration-300" />
            </div>
          ) : (
            <div className="flex items-center text-cyan-200 text-xs hover:text-cyan-300 transition-colors duration-300">
              <Instagram className="w-3.5 h-3.5 mr-2" />
              <span>@virallyzer</span>
            </div>
          )}
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={toggleCollapsed}
          className="relative z-10 hidden md:flex items-center justify-center p-1.5 mx-auto mb-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 border border-cyan-400/30 hover:border-cyan-400/50"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cyan-300"
            >
              <polyline points="13 17 18 12 13 7"></polyline>
              <polyline points="6 17 11 12 6 7"></polyline>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cyan-300"
            >
              <polyline points="11 17 6 12 11 7"></polyline>
              <polyline points="18 17 13 12 18 7"></polyline>
            </svg>
          )}
        </button>
      </aside>

      {/* Overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="cartoon-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirmar Logout
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja sair? Você precisará fazer login novamente para acessar sua conta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogoutCancel} className="cartoon-border">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700 text-white cartoon-border"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Saindo..." : "Sim, sair"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
