import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'
import { Wrap } from '@/components/ui/Wrap'
import { useLeads, useAdmin } from '@/features/admin'
import { usePageField } from '@/features/admin/hooks/usePageField'
import { cn } from '@/lib/utils'

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function ParceirosPage() {
  const { Field: F } = usePageField('parceiros')
  const { editing } = useAdmin()
  const { addLead } = useLeads()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [tel, setTel] = useState('')
  const [tipo, setTipo] = useState('Correspondente')
  const [cidade, setCidade] = useState('')
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [showMsg, setShowMsg] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  function validate() {
    const next = {
      nome: !nome.trim(),
      email: !email.trim() || !email.includes('@'),
      tel: tel.replace(/\D/g, '').length < 10,
      cidade: !cidade.trim(),
    }
    setErrors(next)
    const ok = !Object.values(next).some(Boolean)
    setShowMsg(!ok)
    return ok
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (editing) return
    if (!validate()) return
    try {
      await addLead({
        tipo: 'parceiro',
        dados: {
          nome: nome.trim(),
          email: email.trim(),
          tel,
          tipoParceiro: tipo,
          cidade: cidade.trim(),
        },
        origem: '/parceiros',
      })
      setModalOpen(true)
      setNome('')
      setEmail('')
      setTel('')
      setCidade('')
      setTipo('Correspondente')
      setShowMsg(false)
      setErrors({})
    } catch {
      setShowMsg(true)
    }
  }

  return (
    <main>
      <section className="phero">
        <div className="wrap">
          <Eyebrow light>
            <F k="eyebrow" />
          </Eyebrow>
          <h1 className="serif">
            <F k="titleLine1" />
            <br />
            <F k="titleLine2" />
          </h1>
          <F k="lead" as="p" multiline />
          <div style={{ marginTop: 30 }}>
            <Button href="#parceiros-form" variant="gold" arrow>
              <F k="heroCta" />
            </Button>
          </div>
        </div>
      </section>

      <Section variant="cream">
        <Wrap>
          <div className="sec-head">
            <Eyebrow>
              <F k="whyEyebrow" />
            </Eyebrow>
            <F k="whyTitle" as="h2" className="serif" />
          </div>
          <div className="pgrid">
            <div className="pcard">
              <div className="pi">$</div>
              <F k="why1Title" as="h3" />
              <F k="why1Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">⚡</div>
              <F k="why2Title" as="h3" />
              <F k="why2Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">☎</div>
              <F k="why3Title" as="h3" />
              <F k="why3Text" as="p" multiline />
            </div>
          </div>
        </Wrap>
      </Section>

      <Section variant="navy">
        <Wrap>
          <div className="sec-head" style={{ maxWidth: '34rem' }}>
            <Eyebrow light>
              <F k="howEyebrow" />
            </Eyebrow>
            <F k="howTitle" as="h2" className="serif" />
          </div>
          <div className="uselist">
            <div className="use" style={{ borderColor: 'var(--line-light)' }}>
              <div className="ui" style={{ background: 'rgba(52,84,140,.2)', color: 'var(--gold)' }}>
                1
              </div>
              <div>
                <F k="how1Title" as="h3" className="parceiros-step-title" />
                <F k="how1Text" as="p" multiline className="parceiros-step-text" />
              </div>
            </div>
            <div className="use" style={{ borderColor: 'var(--line-light)' }}>
              <div className="ui" style={{ background: 'rgba(52,84,140,.2)', color: 'var(--gold)' }}>
                2
              </div>
              <div>
                <F k="how2Title" as="h3" className="parceiros-step-title" />
                <F k="how2Text" as="p" multiline className="parceiros-step-text" />
              </div>
            </div>
            <div className="use" style={{ borderColor: 'var(--line-light)' }}>
              <div className="ui" style={{ background: 'rgba(52,84,140,.2)', color: 'var(--gold)' }}>
                3
              </div>
              <div>
                <F k="how3Title" as="h3" className="parceiros-step-title" />
                <F k="how3Text" as="p" multiline className="parceiros-step-text" />
              </div>
            </div>
          </div>
        </Wrap>
      </Section>

      <Section variant="cream" id="parceiros-form">
        <Wrap>
          <div className="sec-head" style={{ maxWidth: '34rem' }}>
            <Eyebrow>
              <F k="formEyebrow" />
            </Eyebrow>
            <F k="formTitle" as="h2" className="serif" />
            <F k="formLead" as="p" multiline />
          </div>

          <form className="pform" onSubmit={onSubmit} noValidate>
            <div className="pfield">
              <label htmlFor="p-nome">Nome completo</label>
              <input
                id="p-nome"
                className={cn(errors.nome && 'err')}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div className="pfield">
              <label htmlFor="p-email">E-mail</label>
              <input
                id="p-email"
                type="email"
                className={cn(errors.email && 'err')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
              />
            </div>
            <div className="pfield">
              <label htmlFor="p-tel">Telefone / WhatsApp</label>
              <input
                id="p-tel"
                type="tel"
                inputMode="numeric"
                maxLength={15}
                className={cn(errors.tel && 'err')}
                value={tel}
                onChange={(e) => setTel(maskPhone(e.target.value))}
                placeholder="(16) 90000-0000"
              />
            </div>
            <div className="pfield">
              <label htmlFor="p-tipo">Tipo de parceiro</label>
              <select id="p-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option>Correspondente</option>
                <option>Imobiliária</option>
                <option>Contador</option>
                <option>Consultor</option>
                <option>Outro</option>
              </select>
            </div>
            <div className="pfield full">
              <label htmlFor="p-cidade">Cidade / UF</label>
              <input
                id="p-cidade"
                className={cn(errors.cidade && 'err')}
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Sua cidade"
              />
            </div>
            {showMsg ? <F k="formError" as="p" className="pform-msg" /> : null}
            <div className="full">
              <Button type="submit" variant="blue" arrow className="w-full justify-center">
                <F k="formCta" />
              </Button>
            </div>
          </form>
        </Wrap>
      </Section>

      {modalOpen ? (
        <div className="pmodal">
          <div className="pmodal-back" onClick={() => setModalOpen(false)} />
          <div className="pmodal-card" role="dialog" aria-modal="true" aria-labelledby="pmodal-title">
            <button
              type="button"
              className="pmodal-x"
              aria-label="Fechar"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <div className="pmodal-check">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <F k="modalTitle" as="h3" className="serif" />
            <F k="modalText" as="p" multiline />
            <Button variant="blue" arrow onClick={() => setModalOpen(false)}>
              <F k="modalCta" />
            </Button>
          </div>
        </div>
      ) : null}
    </main>
  )
}
