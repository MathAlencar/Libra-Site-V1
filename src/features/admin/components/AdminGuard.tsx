import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'

import { Eyebrow } from '@/components/ui/Eyebrow'
import { useAdmin } from '@/features/admin/AdminProvider'
import { getApiBase } from '@/features/admin/api/client'

export function AdminLogin() {
  const { login, apiOnline } = useAdmin()
  const [email, setEmail] = useState('admin@libracredito.com.br')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <Eyebrow>Área interna</Eyebrow>
        <h1 className="serif wq">Entrar no painel.</h1>
        <p>
          {apiOnline
            ? `API: ${getApiBase()}`
            : 'Configure VITE_API_URL no .env (ex.: http://localhost:3018) e reinicie o Vite.'}
        </p>
        <form onSubmit={onSubmit}>
          <div className="adm-field">
            <label htmlFor="adm-email">E-mail</label>
            <input
              id="adm-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@libracredito.com.br"
            />
          </div>
          <div className="adm-field">
            <label htmlFor="adm-pass">Senha</label>
            <input
              id="adm-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="adm-msg err">{error}</p> : null}
          <button
            type="submit"
            className="btn btn-gold"
            style={{ marginTop: 18, width: '100%' }}
            disabled={loading || !apiOnline}
          >
            {loading ? 'Entrando…' : 'Entrar'} <span className="ar">→</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { session, bootstrapping } = useAdmin()
  if (bootstrapping) {
    return (
      <div className="adm-login">
        <div className="adm-login-card">
          <p style={{ color: 'var(--muted)' }}>Carregando painel…</p>
        </div>
      </div>
    )
  }
  if (!session) return <AdminLogin />
  return <>{children}</>
}
