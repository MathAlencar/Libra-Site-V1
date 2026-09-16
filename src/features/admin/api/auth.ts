import {
  ApiError,
  apiGet,
  apiPost,
  clearToken,
  isApiEnabled,
  setToken,
} from '@/features/admin/api/client'
import { loadJson, STORAGE_KEYS } from '@/features/admin/storage'
import type { AdminSession } from '@/features/admin/types'

/**
 * Login via POST /token.
 * Fallback local só se a API não estiver configurada.
 */
export async function login(
  email: string,
  password: string,
): Promise<NonNullable<AdminSession>> {
  const e = email.trim()
  if (!e.includes('@') || !password) {
    throw new Error('Informe e-mail e senha.')
  }

  if (!isApiEnabled()) {
    throw new Error(
      'API não configurada. Defina VITE_API_URL=http://localhost:3018 no .env e reinicie o Vite.',
    )
  }

  try {
    const data = await apiPost<{
      token: string
      nome: string
      email: string
      expiresAt?: string
    }>('/token', { email: e, password }, { auth: false })

    const session: NonNullable<AdminSession> = {
      token: data.token,
      nome: data.nome,
      email: data.email,
      expiresAt: data.expiresAt,
    }
    setToken(session)
    return session
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      throw new Error('E-mail ou senha incorretos.')
    }
    throw err instanceof Error ? err : new Error('Não foi possível entrar.')
  }
}

export async function fetchMe(): Promise<{ id: number | string; nome: string; email: string }> {
  return apiGet('/admin/me')
}

export function logout(): void {
  clearToken()
}

export function getSessionLocal(): AdminSession {
  return loadJson<AdminSession>(STORAGE_KEYS.session)
}

/** @deprecated use login() */
export const loginLocal = login
/** @deprecated use logout() */
export const logoutLocal = logout
