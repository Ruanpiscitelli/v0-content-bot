'use client'

import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  Shield,
  X,
  ChevronRight 
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminSidebarProps {
  activePage: string
  setActivePage: (page: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const navigation = [
  { 
    name: 'Dashboard', 
    id: 'dashboard', 
    icon: LayoutDashboard,
    description: 'Visão geral da plataforma'
  },
  { 
    name: 'Usuários', 
    id: 'users', 
    icon: Users,
    description: 'Gerenciar usuários'
  },
  { 
    name: 'Relatórios', 
    id: 'reports', 
    icon: BarChart3,
    description: 'Relatórios e métricas'
  },
  { 
    name: 'Configurações', 
    id: 'settings', 
    icon: Settings,
    description: 'Configurações do sistema'
  },
]

export function AdminSidebar({ activePage, setActivePage, isOpen, setIsOpen }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Panel
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = activePage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id)
                    setIsOpen(false) // Close sidebar on mobile after selection
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 mr-3 flex-shrink-0",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500"
                  )} />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 