'use client'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
        <h2 style={{ color: '#ef4444', fontSize: 32, marginBottom: 16 }}>Algo deu errado!</h2>
        <p style={{ color: '#334155', marginBottom: 24 }}>{error?.message || 'Erro inesperado. Tente novamente.'}</p>
        <button onClick={() => reset()} style={{ padding: '8px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
          Tentar novamente
        </button>
      </body>
    </html>
  )
} 