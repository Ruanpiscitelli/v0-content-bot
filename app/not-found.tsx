'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const translations = {
  pt: {
    title: '404',
    subtitle: 'Página não encontrada',
    description: 'Não conseguimos encontrar o recurso solicitado.',
    back: 'Voltar para o início',
  },
  en: {
    title: '404',
    subtitle: 'Page not found',
    description: "We couldn't find the requested resource.",
    back: 'Back to homepage',
  },
  es: {
    title: '404',
    subtitle: 'Página no encontrada',
    description: 'No pudimos encontrar el recurso solicitado.',
    back: 'Volver al inicio',
  },
}

type Lang = 'pt' | 'en' | 'es'

function getLang(): Lang {
  if (typeof window === 'undefined') return 'pt'
  const lang = navigator.language || navigator.languages?.[0] || 'pt'
  if (lang.startsWith('es')) return 'es'
  if (lang.startsWith('en')) return 'en'
  if (lang.startsWith('pt')) return 'pt'
  return 'pt'
}

export default function NotFound() {
  const [lang, setLang] = useState<Lang>('pt')

  useEffect(() => {
    setLang(getLang())
  }, [])

  const t = translations[lang]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
      <h1 style={{ color: '#ef4444', fontSize: 48, marginBottom: 16 }}>{t.title}</h1>
      <h2 style={{ color: '#334155', fontSize: 24, marginBottom: 8 }}>{t.subtitle}</h2>
      <p style={{ color: '#64748b', marginBottom: 24 }}>{t.description}</p>
      <Link href="/" style={{ padding: '8px 24px', background: '#3b82f6', color: '#fff', borderRadius: 6, fontWeight: 600, textDecoration: 'none' }}>
        {t.back}
      </Link>
    </div>
  )
} 