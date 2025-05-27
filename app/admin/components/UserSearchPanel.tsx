'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Download, Eye, MoreHorizontal, Calendar, Crown } from 'lucide-react'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { debounce } from 'lodash'

interface User {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  has_subscription: boolean | null
  created_at: string
  updated_at: string
}

interface SearchFilters {
  search: string
  subscription: string
  dateRange: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export function UserSearchPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    subscription: 'all',
    dateRange: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setFilters(prev => ({ ...prev, search: searchTerm }))
      setCurrentPage(1)
    }, 300),
    []
  )

  useEffect(() => {
    fetchUsers()
  }, [filters, currentPage])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const supabase = getSupabaseAdmin()
      
      let query = supabase.from('profiles').select('*', { count: 'exact' })

      // Apply search filter
      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,username.ilike.%${filters.search}%`)
      }

      // Apply subscription filter
      if (filters.subscription === 'premium') {
        query = query.eq('has_subscription', true)
      } else if (filters.subscription === 'free') {
        query = query.eq('has_subscription', false)
      }

      // Apply date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date()
        let startDate = new Date()
        
        switch (filters.dateRange) {
          case 'today':
            startDate.setHours(0, 0, 0, 0)
            break
          case 'week':
            startDate.setDate(now.getDate() - 7)
            break
          case 'month':
            startDate.setMonth(now.getMonth() - 1)
            break
          case 'quarter':
            startDate.setMonth(now.getMonth() - 3)
            break
        }
        
        query = query.gte('created_at', startDate.toISOString())
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' })

      // Apply pagination
      const from = (currentPage - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setUsers(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value: string) => {
    debouncedSearch(value)
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const getInitials = (name: string | null) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  const exportUsers = async () => {
    try {
      // Here you would implement CSV export functionality
      console.log('Exportando usuários...')
    } catch (error) {
      console.error('Erro ao exportar usuários:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Buscar Usuários</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar por nome ou email..."
                  className="pl-10"
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
            
            <Select 
              value={filters.subscription} 
              onValueChange={(value) => handleFilterChange('subscription', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assinatura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="free">Gratuito</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.dateRange} 
              onValueChange={(value) => handleFilterChange('dateRange', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mês</SelectItem>
                <SelectItem value="quarter">Últimos 3 meses</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportUsers} variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Usuários Encontrados ({totalCount.toLocaleString()})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Data de cadastro</SelectItem>
                  <SelectItem value="full_name">Nome</SelectItem>
                  <SelectItem value="updated_at">Última atividade</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Nome de usuário</TableHead>
                    <TableHead>Assinatura</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead>Última atividade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhum usuário encontrado com os filtros aplicados
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                                {getInitials(user.full_name || user.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {user.full_name || 'Sem nome'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {user.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 dark:text-gray-300">
                            {user.username ? `@${user.username}` : 'Não definido'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.has_subscription ? (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Gratuito</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(user.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(user.updated_at)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, totalCount)} de {totalCount} usuários
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 