"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
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
}: {
  isCollapsed: boolean
  user?: { name?: string; avatar_url?: string }
  onLogoutClick: () => void
}) {
  return (
    <div className={cn("mt-1 mb-2 px-3 py-2", isCollapsed ? "flex justify-center" : "border-t border-black/10")}>
      {isCollapsed ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-9 h-9 rounded-full bg-white cartoon-border hover:bg-gray-100 transition-colors flex items-center justify-center">
              <div className="w-7 h-7 rounded-full overflow-hidden">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={`${user.name || "User"}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="19" fill="white" stroke="black" strokeWidth="2" />
                    <circle cx="20" cy="15" r="6" fill="black" />
                    <path d="M8 32C8 25.3726 13.3726 20 20 20C26.6274 20 32 25.3726 32 32V38H8V32Z" fill="black" />
                  </svg>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56 cartoon-border">
            <div className="flex flex-col items-center gap-1 p-2">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={`${user.name || "User"}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="19" fill="white" stroke="black" strokeWidth="2" />
                    <circle cx="20" cy="15" r="6" fill="black" />
                    <path d="M8 32C8 25.3726 13.3726 20 20 20C26.6274 20 32 25.3726 32 32V38H8V32Z" fill="black" />
                  </svg>
                )}
              </div>
              <p className="font-medium text-sm">{user?.name || "User123"}</p>
              <p className="text-xs text-gray-500">Member</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm" asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm text-red-600" onClick={onLogoutClick}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors">
              <div className="relative">
                <div className="w-9 h-9 rounded-full overflow-hidden cartoon-border">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url || "/placeholder.svg"}
                      alt={`${user.name || "User"}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="19" fill="white" stroke="black" strokeWidth="2" />
                      <circle cx="20" cy="15" r="6" fill="black" />
                      <path d="M8 32C8 25.3726 13.3726 20 20 20C26.6274 20 32 25.3726 32 32V38H8V32Z" fill="black" />
                    </svg>
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || "User123"}</p>
                <p className="text-xs text-white/70 truncate">Member</p>
              </div>
              <ChevronDown className="w-4 h-4 text-white/70" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 cartoon-border">
            <DropdownMenuItem className="cursor-pointer text-sm" asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm text-red-600" onClick={onLogoutClick}>
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
  const [user, setUser] = useState<{ name?: string; avatar_url?: string } | null>(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { signOut } = useAuth()
  const { toast } = useToast()

  // Fetch user data when component mounts
  useEffect(() => {
    // This is a placeholder - replace with your actual user data fetching logic
    const fetchUserData = async () => {
      try {
        // Example: const { data } = await supabase.auth.getUser()
        // For now, we'll use mock data
        setUser({
          name: "João Silva",
          avatar_url: null, // Replace with actual user avatar URL when available
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])

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
      name: "Security",
      href: "/security",
      icon: <Shield className="w-5 h-5" />,
      active: pathname === "/security",
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
          background: "rgb(82, 129, 239)",
        }}
        aria-label="Sidebar"
      >
        {/* Logo */}
        <div
          className={cn(
            "flex justify-center items-center border-b-2 border-black/10",
            isCollapsed ? "p-3 pt-4 pb-3" : "px-2 pt-3 pb-2",
          )}
        >
          {isCollapsed ? (
            <div className="relative w-10 h-10 animate-float">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5Z"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />
                <path
                  d="M15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15Z"
                  fill="black"
                />
                <path
                  d="M29 15C29 16.6569 27.6569 18 26 18C24.3431 18 23 16.6569 23 15C23 13.3431 24.3431 12 26 12C27.6569 12 29 13.3431 29 15Z"
                  fill="black"
                />
                <path
                  d="M13 22C13 22 15 25 20 25C25 25 27 22 27 22"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full py-4">
              <div className="relative flex items-center">
                <div className="relative w-10 h-10 mr-2 animate-float">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5Z"
                      fill="white"
                      stroke="black"
                      strokeWidth="2"
                    />
                    <path
                      d="M15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15Z"
                      fill="black"
                    />
                    <path
                      d="M29 15C29 16.6569 27.6569 18 26 18C24.3431 18 23 16.6569 23 15C23 13.3431 24.3431 12 26 12C27.6569 12 29 13.3431 29 15Z"
                      fill="black"
                    />
                    <path
                      d="M13 22C13 22 15 25 20 25C25 25 27 22 27 22"
                      stroke="black"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-extrabold text-white">Virallyzer</h1>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-4 space-y-1.5 overflow-y-auto">
          <NotificationDropdown isCollapsed={isCollapsed} />

          {/* Main navigation items */}
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-white rounded-lg transition-all text-sm cartoon-border",
                "hover:bg-white/15 hover:text-white hover:translate-x-1",
                item.active && "bg-white/20 font-medium backdrop-blur-sm",
                item.highlight && !item.active && "bg-white/10 font-medium", // Highlight the Create Content item
                isCollapsed && "justify-center px-2",
              )}
              onClick={() => trackEvent("sidebar_navigation", { destination: item.name.toLowerCase() })}
            >
              {item.icon}
              {!isCollapsed && (
                <>
                  <span className="ml-3">{item.name}</span>
                  {item.highlight && !item.active && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] rounded-full bg-white/20">New</span>
                  )}
                  {item.active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></span>}
                </>
              )}
              {isCollapsed && item.highlight && !item.active && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-white"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        <UserProfileSection isCollapsed={isCollapsed} user={user || undefined} onLogoutClick={handleLogoutClick} />

        {/* Footer */}
        <div
          className={cn(
            "p-3 mt-auto border-t-2 border-black/10 transition-all",
            isCollapsed ? "p-2" : "hover:bg-white/10",
          )}
        >
          {isCollapsed ? (
            <div className="flex justify-center">
              <Instagram className="w-4 h-4 text-white/80" />
            </div>
          ) : (
            <div className="flex items-center text-white/80 text-xs">
              <Instagram className="w-3.5 h-3.5 mr-2" />
              <span>@virallyzer</span>
            </div>
          )}
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={toggleCollapsed}
          className="hidden md:flex items-center justify-center p-1.5 mx-auto mb-3 bg-white/15 hover:bg-white/25 rounded-full transition-all hover:shadow-md cartoon-border"
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
              className="text-white"
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
              className="text-white"
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
