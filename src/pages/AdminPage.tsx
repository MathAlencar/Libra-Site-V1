import { useState } from 'react'

import { AdminGuard } from '@/features/admin/components/AdminGuard'
import { BlogPanel } from '@/features/admin/components/BlogPanel'
import { ConfigPanel } from '@/features/admin/components/ConfigPanel'
import { LeadsPanel } from '@/features/admin/components/LeadsPanel'
import { useAdmin } from '@/features/admin/AdminProvider'
import { cn } from '@/lib/utils'

type Tab = 'blog' | 'leads' | 'export'

export function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  )
}

function AdminDashboard() {
  const { session } = useAdmin()
  const [tab, setTab] = useState<Tab>('blog')

  return (
    <main>
      <section className="adm-hero">
        <div className="wrap">
          <span className="eyebrow">Área interna</span>
          <h1 className="serif">Painel da Libra.</h1>
          <p>
            Publique posts no blog, acompanhe simulações e cadastros de parceiros, e exporte o
            conteúdo em JSON. Olá, {session?.nome}.
          </p>
          <div className="adm-tabs">
            <button
              type="button"
              className={cn('adm-tab', tab === 'blog' && 'on')}
              onClick={() => setTab('blog')}
            >
              Blog
            </button>
            <button
              type="button"
              className={cn('adm-tab', tab === 'leads' && 'on')}
              onClick={() => setTab('leads')}
            >
              Simulações &amp; Parceiros
            </button>
            <button
              type="button"
              className={cn('adm-tab', tab === 'export' && 'on')}
              onClick={() => setTab('export')}
            >
              Exportar &amp; Configurar
            </button>
          </div>
        </div>
      </section>

      <section className={cn('adm-pane', tab === 'blog' && 'on')}>
        <div className="wrap">
          <BlogPanel />
        </div>
      </section>
      <section className={cn('adm-pane', tab === 'leads' && 'on')}>
        <div className="wrap">
          <LeadsPanel />
        </div>
      </section>
      <section className={cn('adm-pane', tab === 'export' && 'on')}>
        <div className="wrap">
          <ConfigPanel />
        </div>
      </section>
    </main>
  )
}
