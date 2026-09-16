import { useState } from 'react'

import { useAdmin } from '@/features/admin/AdminProvider'
import { getApiBase } from '@/features/admin/api/client'

export function ConfigPanel() {
  const { config, saveConfig, content, posts, setFlash, logout, session, refreshContent, apiOnline } =
    useAdmin()
  const [apiBaseUrl, setApiBaseUrl] = useState(config.apiBaseUrl || getApiBase())
  const [msg, setMsg] = useState('')

  function onSaveConfig() {
    saveConfig({ apiBaseUrl: apiBaseUrl.trim() })
    setMsg(
      apiBaseUrl.trim()
        ? 'URL salva. Recarregue a página para aplicar em todas as chamadas.'
        : 'URL limpa — o front usará só VITE_API_URL do .env (se existir).',
    )
  }

  function exportJson() {
    const payload = {
      conteudo: content,
      posts,
      exportadoEm: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `libra-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setFlash({ type: 'ok', text: 'JSON exportado.' })
  }

  return (
    <>
      <div className="adm-card">
        <h3>Conteúdo do site</h3>
        <p className="hint">
          Fonte da verdade: <code>GET/PUT /conteudo</code> no Express. Versão atual:{' '}
          <b>v{content.versao}</b>.
        </p>
        <div className="adm-actions">
          <button
            type="button"
            className="btn btn-blue"
            onClick={() => void refreshContent().then(() => setFlash({ type: 'ok', text: 'Conteúdo recarregado.' }))}
          >
            Recarregar do servidor <span className="ar">→</span>
          </button>
          <button type="button" className="btn btn-gold" onClick={exportJson}>
            Exportar JSON backup
          </button>
        </div>
      </div>

      <div className="adm-card">
        <h3>API Express</h3>
        <p className="hint">
          Ativo agora: <b>{apiOnline ? getApiBase() : 'nenhuma'}</b>
          <br />
          Preferência: campo abaixo (localStorage) → senão <code>VITE_API_URL</code> do .env.
        </p>
        <div className="adm-field">
          <label>URL base da API (opcional)</label>
          <input
            type="url"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            placeholder="http://localhost:3018"
          />
        </div>
        <div className="adm-actions">
          <button type="button" className="btn btn-blue" onClick={onSaveConfig}>
            Salvar endereço
          </button>
        </div>
        {msg ? <p className="adm-msg">{msg}</p> : null}
        <p className="adm-note">
          <b>Rotas:</b> POST /token · GET/PUT /conteudo · /blog · /admin/blog · /leads ·
          /upload/imagem
        </p>
      </div>

      <div className="adm-card">
        <h3>Sessão</h3>
        <p className="hint">
          Logado como <b>{session?.nome}</b> ({session?.email}).
        </p>
        <div className="adm-actions">
          <button type="button" className="btn btn-ghost-d" onClick={() => logout()}>
            Sair
          </button>
        </div>
      </div>
    </>
  )
}
