export const STORAGE_KEYS = {
  conteudo: 'libra_conteudo',
  posts: 'libra_posts',
  leads: 'libra_leads',
  session: 'libra_admin_session',
  config: 'libra_admin_config',
} as const

export function loadJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function saveJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
