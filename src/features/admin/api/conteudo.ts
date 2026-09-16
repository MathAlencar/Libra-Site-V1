import { ApiError, apiGet, apiPut, isApiEnabled } from '@/features/admin/api/client'
import {
  createDefaultSiteContent,
  mergeSiteContent,
} from '@/features/admin/defaults/siteContent'
import { loadJson, saveJson, STORAGE_KEYS } from '@/features/admin/storage'
import type { SiteContent } from '@/features/admin/types'

export function getConteudoLocal(): SiteContent {
  const stored = loadJson<SiteContent>(STORAGE_KEYS.conteudo)
  if (stored) return mergeSiteContent(stored)
  const defaults = createDefaultSiteContent()
  saveJson(STORAGE_KEYS.conteudo, defaults)
  return defaults
}

export function saveConteudoLocal(content: SiteContent): SiteContent {
  const next: SiteContent = {
    ...content,
    versao: (content.versao || 0) + 1,
    atualizadoEm: new Date().toISOString(),
  }
  saveJson(STORAGE_KEYS.conteudo, next)
  return next
}

export async function getConteudo(): Promise<SiteContent> {
  if (isApiEnabled()) {
    const remote = await apiGet<SiteContent>('/conteudo', { auth: false })
    const merged = mergeSiteContent(remote)
    saveJson(STORAGE_KEYS.conteudo, merged)
    return merged
  }
  return getConteudoLocal()
}

export async function saveConteudo(content: SiteContent): Promise<SiteContent> {
  if (isApiEnabled()) {
    try {
      const saved = await apiPut<SiteContent>('/conteudo', content)
      const merged = mergeSiteContent(saved)
      saveJson(STORAGE_KEYS.conteudo, merged)
      return merged
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        throw new ApiError(
          'Conteúdo desatualizado (versão conflitante). Recarregue e tente de novo.',
          409,
          err.body,
        )
      }
      throw err
    }
  }
  return saveConteudoLocal(content)
}
