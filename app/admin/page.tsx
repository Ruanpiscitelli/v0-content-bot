import { Suspense } from 'react'
import { AdminDashboard } from './components/AdminDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Painel Administrativo - Virallyzer',
  description: 'Painel de administração para gerenciar usuários e métricas da plataforma',
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<div>Carregando...</div>}>
        <AdminDashboard />
      </Suspense>
    </div>
  )
} 