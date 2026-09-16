import {
  apiGet,
  apiPatch,
  apiPost,
  isApiEnabled,
} from '@/features/admin/api/client'
import { loadJson, saveJson, STORAGE_KEYS } from '@/features/admin/storage'
import type { Lead, LeadStatus, LeadTipo } from '@/features/admin/types'
import { createId } from '@/features/admin/utils/id'

export function listLeadsLocal(): Lead[] {
  const stored = loadJson<Lead[]>(STORAGE_KEYS.leads)
  return stored && Array.isArray(stored) ? stored : []
}

function persist(leads: Lead[]): Lead[] {
  saveJson(STORAGE_KEYS.leads, leads)
  return leads
}

export function addLeadLocal(input: {
  tipo: LeadTipo
  dados: Record<string, string | number | null>
  resultado?: Record<string, string | number | null>
  origem?: string
}): Lead {
  const lead: Lead = {
    id: createId(),
    tipo: input.tipo,
    quando: new Date().toISOString(),
    status: 'novo',
    dados: input.dados,
    resultado: input.resultado,
    origem: input.origem ?? (typeof window !== 'undefined' ? window.location.pathname : undefined),
  }
  persist([lead, ...listLeadsLocal()])
  return lead
}

export function markLeadReadLocal(id: string, status: LeadStatus = 'lido'): Lead | null {
  const leads = listLeadsLocal()
  const i = leads.findIndex((l) => l.id === id)
  if (i < 0) return null
  leads[i] = { ...leads[i], status }
  persist(leads)
  return leads[i]
}

export function clearLeadsLocal(): void {
  persist([])
}

export function exportLeadsCsvLocal(leads = listLeadsLocal()): string {
  const header = ['id', 'tipo', 'quando', 'status', 'origem', 'dados', 'resultado']
  const rows = leads.map((l) =>
    [
      l.id,
      l.tipo,
      l.quando,
      l.status,
      l.origem ?? '',
      JSON.stringify(l.dados),
      JSON.stringify(l.resultado ?? {}),
    ]
      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
      .join(','),
  )
  return [header.join(','), ...rows].join('\n')
}

export async function addLead(input: {
  tipo: LeadTipo
  dados: Record<string, string | number | null>
  resultado?: Record<string, string | number | null>
  origem?: string
}): Promise<Lead> {
  const payload = {
    tipo: input.tipo,
    dados: input.dados,
    resultado: input.resultado,
    origem:
      input.origem ?? (typeof window !== 'undefined' ? window.location.pathname : undefined),
  }

  if (isApiEnabled()) {
    const created = await apiPost<Lead>('/leads', payload, { auth: false })
    // mantém espelho local para UX offline rápida
    const local = listLeadsLocal()
    persist([created, ...local.filter((l) => l.id !== created.id)])
    return created
  }
  return addLeadLocal(payload)
}

export async function listLeadsAdmin(params?: {
  tipo?: LeadTipo
  status?: LeadStatus
}): Promise<Lead[]> {
  if (isApiEnabled()) {
    const q = new URLSearchParams()
    if (params?.tipo) q.set('tipo', params.tipo)
    if (params?.status) q.set('status', params.status)
    const qs = q.toString()
    const remote = await apiGet<Lead[]>(`/admin/leads${qs ? `?${qs}` : ''}`)
    const list = Array.isArray(remote) ? remote : []
    persist(list)
    return list
  }
  return listLeadsLocal()
}

export async function markLeadRead(
  id: string,
  status: LeadStatus = 'lido',
): Promise<Lead | null> {
  if (isApiEnabled()) {
    const updated = await apiPatch<Lead>(`/admin/leads/${id}`, { status })
    const all = listLeadsLocal()
    const i = all.findIndex((l) => l.id === id)
    if (i >= 0) {
      all[i] = updated
      persist(all)
    }
    return updated
  }
  return markLeadReadLocal(id, status)
}
