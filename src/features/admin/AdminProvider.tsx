import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { getSessionLocal, login as loginApi, logout as logoutApi } from '@/features/admin/api/auth'
import {
  createPost as createPostApi,
  deletePost as deletePostApi,
  listPostsAdmin,
  listPostsPublic,
  updatePost as updatePostApi,
} from '@/features/admin/api/blog'
import { ApiError, getApiBase, getConfig, isApiEnabled, setConfig } from '@/features/admin/api/client'
import { getConteudo, getConteudoLocal, saveConteudo } from '@/features/admin/api/conteudo'
import {
  addLead as addLeadApi,
  clearLeadsLocal,
  exportLeadsCsvLocal,
  listLeadsAdmin,
  listLeadsLocal,
  markLeadRead as markLeadReadApi,
} from '@/features/admin/api/leads'
import type {
  AdminConfig,
  AdminSession,
  BlogPost,
  Lead,
  LeadStatus,
  LeadTipo,
  SiteContent,
} from '@/features/admin/types'

type Flash = { type: 'ok' | 'err'; text: string } | null

type AdminContextValue = {
  session: AdminSession
  bootstrapping: boolean
  apiOnline: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  editing: boolean
  setEditing: (on: boolean) => void
  content: SiteContent
  setContent: (c: SiteContent | ((prev: SiteContent) => SiteContent)) => void
  saveContent: () => Promise<SiteContent>
  refreshContent: () => Promise<void>
  posts: BlogPost[]
  createPost: (
    input: Omit<BlogPost, 'id' | 'slug' | 'publicadoEm'> & { slug?: string },
  ) => Promise<BlogPost>
  updatePost: (id: string, patch: Partial<BlogPost>) => Promise<BlogPost | null>
  deletePost: (id: string) => Promise<boolean>
  refreshPosts: () => Promise<void>
  leads: Lead[]
  addLead: (input: {
    tipo: LeadTipo
    dados: Record<string, string | number | null>
    resultado?: Record<string, string | number | null>
    origem?: string
  }) => Promise<Lead>
  markLeadRead: (id: string, status?: LeadStatus) => Promise<void>
  clearLeads: () => void
  exportLeadsCsv: () => string
  refreshLeads: () => Promise<void>
  config: AdminConfig
  saveConfig: (cfg: AdminConfig) => void
  flash: Flash
  setFlash: (f: Flash) => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession>(null)
  const [editing, setEditingState] = useState(false)
  const [content, setContent] = useState<SiteContent>(() => getConteudoLocal())
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [leads, setLeads] = useState<Lead[]>(() => listLeadsLocal())
  const [config, setConfigState] = useState<AdminConfig>(() => getConfig())
  const [flash, setFlash] = useState<Flash>(null)
  const [bootstrapping, setBootstrapping] = useState(true)
  const [apiOnline, setApiOnline] = useState(() => isApiEnabled())

  useEffect(() => {
    setSession(getSessionLocal())

    let cancelled = false
    ;(async () => {
      try {
        const online = isApiEnabled()
        setApiOnline(online)

        const remoteContent = await getConteudo()
        if (!cancelled) setContent(remoteContent)

        if (online && getSessionLocal()) {
          try {
            const adminPosts = await listPostsAdmin()
            if (!cancelled) setPosts(adminPosts)
          } catch {
            const pub = await listPostsPublic()
            if (!cancelled) setPosts(pub)
          }
          try {
            const remoteLeads = await listLeadsAdmin()
            if (!cancelled) setLeads(remoteLeads)
          } catch {
            /* mantém local */
          }
        } else {
          const pub = await listPostsPublic()
          if (!cancelled) setPosts(pub)
        }
      } catch (err) {
        if (!cancelled) {
          setFlash({
            type: 'err',
            text:
              err instanceof Error
                ? `Falha ao carregar da API: ${err.message}`
                : 'Falha ao carregar da API.',
          })
        }
      } finally {
        if (!cancelled) setBootstrapping(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('editing', editing)
    return () => document.body.classList.remove('editing')
  }, [editing])

  useEffect(() => {
    if (!flash) return
    const t = window.setTimeout(() => setFlash(null), 5500)
    return () => window.clearTimeout(t)
  }, [flash])

  const setEditing = useCallback((on: boolean) => {
    setEditingState(on)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const s = await loginApi(email, password)
    setSession(s)
    setFlash({ type: 'ok', text: `Olá, ${s.nome}.` })
    try {
      const [adminPosts, remoteLeads, remoteContent] = await Promise.all([
        listPostsAdmin(),
        listLeadsAdmin(),
        getConteudo(),
      ])
      setPosts(adminPosts)
      setLeads(remoteLeads)
      setContent(remoteContent)
    } catch {
      /* painel ainda abre */
    }
  }, [])

  const logout = useCallback(() => {
    logoutApi()
    setSession(null)
    setEditingState(false)
    setFlash({ type: 'ok', text: 'Sessão encerrada.' })
    void listPostsPublic()
      .then((pub) => setPosts(pub))
      .catch(() => setPosts([]))
  }, [])

  const refreshContent = useCallback(async () => {
    const remote = await getConteudo()
    setContent(remote)
  }, [])

  const saveContent = useCallback(async () => {
    try {
      const next = await saveConteudo(content)
      setContent(next)
      setFlash({
        type: 'ok',
        text: isApiEnabled()
          ? 'Página salva com sucesso.'
          : 'Página salva neste navegador.',
      })
      return next
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setFlash({ type: 'err', text: err.message })
        await refreshContent()
      } else {
        setFlash({
          type: 'err',
          text: err instanceof Error ? err.message : 'Erro ao salvar conteúdo.',
        })
      }
      throw err
    }
  }, [content, refreshContent])

  const refreshPosts = useCallback(async () => {
    if (session && isApiEnabled()) {
      setPosts(await listPostsAdmin())
    } else {
      setPosts(await listPostsPublic())
    }
  }, [session])

  const refreshLeads = useCallback(async () => {
    if (session && isApiEnabled()) {
      setLeads(await listLeadsAdmin())
      setFlash({ type: 'ok', text: 'Leads atualizados do servidor.' })
    } else {
      setLeads(listLeadsLocal())
    }
  }, [session])

  const createPost = useCallback(
    async (input: Omit<BlogPost, 'id' | 'slug' | 'publicadoEm'> & { slug?: string }) => {
      const post = await createPostApi(input)
      await refreshPosts()
      return post
    },
    [refreshPosts],
  )

  const updatePost = useCallback(
    async (id: string, patch: Partial<BlogPost>) => {
      const next = await updatePostApi(id, patch)
      await refreshPosts()
      return next
    },
    [refreshPosts],
  )

  const deletePost = useCallback(
    async (id: string) => {
      const ok = await deletePostApi(id)
      await refreshPosts()
      return ok
    },
    [refreshPosts],
  )

  const addLead = useCallback(
    async (input: {
      tipo: LeadTipo
      dados: Record<string, string | number | null>
      resultado?: Record<string, string | number | null>
      origem?: string
    }) => {
      const lead = await addLeadApi(input)
      if (session) {
        try {
          setLeads(await listLeadsAdmin())
        } catch {
          setLeads((prev) => [lead, ...prev.filter((l) => l.id !== lead.id)])
        }
      } else {
        setLeads((prev) => [lead, ...prev.filter((l) => l.id !== lead.id)])
      }
      return lead
    },
    [session],
  )

  const markLeadRead = useCallback(async (id: string, status: LeadStatus = 'lido') => {
    await markLeadReadApi(id, status)
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }, [])

  const clearLeads = useCallback(() => {
    clearLeadsLocal()
    setLeads([])
    setFlash({
      type: 'ok',
      text: isApiEnabled()
        ? 'Lista local limpa (registros no servidor permanecem).'
        : 'Leads locais limpos.',
    })
  }, [])

  const exportLeadsCsv = useCallback(() => exportLeadsCsvLocal(leads), [leads])

  const saveConfigFn = useCallback((cfg: AdminConfig) => {
    setConfig(cfg)
    setConfigState(cfg)
    setApiOnline(Boolean((cfg.apiBaseUrl || getApiBase()).trim()))
    setFlash({
      type: 'ok',
      text: 'Configuração salva. Recarregue a página se mudou a URL da API.',
    })
  }, [])

  const value = useMemo<AdminContextValue>(
    () => ({
      session,
      bootstrapping,
      apiOnline,
      login,
      logout,
      editing,
      setEditing,
      content,
      setContent,
      saveContent,
      refreshContent,
      posts,
      createPost,
      updatePost,
      deletePost,
      refreshPosts,
      leads,
      addLead,
      markLeadRead,
      clearLeads,
      exportLeadsCsv,
      refreshLeads,
      config,
      saveConfig: saveConfigFn,
      flash,
      setFlash,
    }),
    [
      session,
      bootstrapping,
      apiOnline,
      login,
      logout,
      editing,
      setEditing,
      content,
      saveContent,
      refreshContent,
      posts,
      createPost,
      updatePost,
      deletePost,
      refreshPosts,
      leads,
      addLead,
      markLeadRead,
      clearLeads,
      exportLeadsCsv,
      refreshLeads,
      config,
      saveConfigFn,
      flash,
    ],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin deve ser usado dentro de AdminProvider')
  return ctx
}

export function useSiteContent() {
  const { content, setContent, saveContent, refreshContent } = useAdmin()
  return { content, setContent, saveContent, refreshContent }
}

export function useBlogPosts() {
  const { posts, createPost, updatePost, deletePost, refreshPosts } = useAdmin()
  return { posts, createPost, updatePost, deletePost, refreshPosts }
}

export function useLeads() {
  const { leads, addLead, markLeadRead, clearLeads, exportLeadsCsv, refreshLeads } = useAdmin()
  return { leads, addLead, markLeadRead, clearLeads, exportLeadsCsv, refreshLeads }
}
