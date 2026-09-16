import { Link } from 'react-router-dom'
import type { MouseEvent } from 'react'

import { HOME_DEFAULTS } from '@/features/admin/defaults/siteContent'
import { useAdmin } from '@/features/admin/AdminProvider'
import { EditableText } from '@/features/admin/components/EditableText'
import type { SiteContent } from '@/features/admin/types'
import { ROUTES } from '@/lib/constants/routes'

function setHomeField(
  content: SiteContent,
  setContent: (c: SiteContent | ((p: SiteContent) => SiteContent)) => void,
  key: string,
  value: string,
) {
  setContent({
    ...content,
    paginas: {
      ...content.paginas,
      home: { ...content.paginas.home, [key]: value },
    },
  })
}

function FootText({
  k,
  as = 'span',
  className,
  multiline,
}: {
  k: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div' | 'b'
  className?: string
  multiline?: boolean
}) {
  const { content, setContent } = useAdmin()
  const value = content.paginas.home[k] ?? HOME_DEFAULTS[k] ?? ''
  return (
    <EditableText
      as={as}
      className={className}
      multiline={multiline}
      value={value}
      onChange={(v) => setHomeField(content, setContent, k, v)}
    />
  )
}

export function SiteFooter() {
  const { content, editing } = useAdmin()
  const home = content.paginas.home
  const whatsappHref = content.cta.whatsapp || '#'

  const linkClick = (e: MouseEvent) => {
    if (editing) e.preventDefault()
  }

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="brand" style={{ fontSize: 24, color: 'var(--cream)' }}>
              <span className="logo" role="img" aria-label="Libra Crédito" />
            </div>
            <FootText k="footTag" as="p" className="foot-tag" multiline />
          </div>

          <div>
            <h4>
              <FootText k="footColProduto" />
            </h4>
            <Link to={ROUTES.HOME} onClick={linkClick}>
              <FootText k="footLinkHome" />
            </Link>
            <Link to={ROUTES.SIMULACAO} onClick={linkClick}>
              <FootText k="footLinkSimular" />
            </Link>
            <Link to={ROUTES.COMO_FUNCIONA} onClick={linkClick}>
              <FootText k="footLinkComo" />
            </Link>
            <Link to={ROUTES.POR_QUE_FAZ_SENTIDO} onClick={linkClick}>
              <FootText k="footLinkPorQue" />
            </Link>
          </div>

          <div>
            <h4>
              <FootText k="footColEmpresa" />
            </h4>
            <Link to={ROUTES.A_LIBRA} onClick={linkClick}>
              <FootText k="footLinkLibra" />
            </Link>
            <Link to={ROUTES.BLOG} onClick={linkClick}>
              <FootText k="footLinkBlog" />
            </Link>
            <Link to={ROUTES.PARCEIROS} onClick={linkClick}>
              <FootText k="footLinkParceiros" />
            </Link>
            <Link to={`${ROUTES.HOME}#depoimento`} onClick={linkClick}>
              <FootText k="footLinkHistorias" />
            </Link>
          </div>

          <div>
            <h4>
              <FootText k="footColContato" />
            </h4>
            <a href={whatsappHref} onClick={linkClick}>
              <FootText k="footWhatsapp" />
            </a>
            <a
              href={`mailto:${home.footEmail || HOME_DEFAULTS.footEmail}?subject=Contato%20pelo%20site%20da%20Libra`}
              onClick={linkClick}
            >
              <FootText k="footEmail" />
            </a>
            <a href="#" onClick={linkClick}>
              <FootText k="footCidade" />
            </a>
          </div>
        </div>

        <div className="legal">
          <div className="legal-col">
            <FootText k="footCopy" as="p" />
            <FootText k="footCnpj" as="p" multiline />
            <p className="legal-links">
              <Link to={ROUTES.POLITICA_PRIVACIDADE} onClick={linkClick}>
                Política de Privacidade
              </Link>
              {' · '}
              <Link to={ROUTES.POLITICA_COOKIES} onClick={linkClick}>
                Política de Cookies
              </Link>
            </p>
          </div>
          <FootText k="footNote" as="p" className="legal-note" multiline />
        </div>

        {editing ? (
          <p style={{ marginTop: 18, fontSize: 13, color: 'var(--muted-light)' }}>
            Footer editável — altere os textos e clique em <b>Salvar</b> na barra.
          </p>
        ) : null}
      </div>
    </footer>
  )
}
