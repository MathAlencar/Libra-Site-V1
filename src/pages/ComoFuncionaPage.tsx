import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'
import { Wrap } from '@/components/ui/Wrap'
import { usePageField } from '@/features/admin/hooks/usePageField'
import { ROUTES } from '@/lib/constants/routes'

export function ComoFuncionaPage() {
  const { Field: F } = usePageField('comoFunciona')

  return (
    <main>
      <section className="phero">
        <Wrap>
          <Eyebrow light>
            <F k="eyebrow" />
          </Eyebrow>
          <h1 className="serif">
            <F k="titleLine1" />
            <br />
            <F k="titleLine2" />
          </h1>
          <F k="lead" as="p" multiline />
        </Wrap>
      </section>

      <Section variant="cream">
        <Wrap>
          <div className="uselist">
            <div className="use">
              <div className="ui">1</div>
              <div>
                <F k="step1Title" as="h3" />
                <F k="step1Text" as="p" multiline />
              </div>
            </div>
            <div className="use">
              <div className="ui">2</div>
              <div>
                <F k="step2Title" as="h3" />
                <F k="step2Text" as="p" multiline />
              </div>
            </div>
            <div className="use">
              <div className="ui">3</div>
              <div>
                <F k="step3Title" as="h3" />
                <F k="step3Text" as="p" multiline />
              </div>
            </div>
            <div className="use">
              <div className="ui">4</div>
              <div>
                <F k="step4Title" as="h3" />
                <F k="step4Text" as="p" multiline />
              </div>
            </div>
          </div>
        </Wrap>
      </Section>

      <Section variant="navy">
        <Wrap>
          <div className="sec-head" style={{ maxWidth: '36rem' }}>
            <Eyebrow light>
              <F k="docsEyebrow" />
            </Eyebrow>
            <F k="docsTitle" as="h2" className="serif" />
            <F k="docsLead" as="p" multiline />
          </div>
          <div className="pgrid">
            <div className="pcard">
              <div className="pi">☰</div>
              <F k="doc1Title" as="h3" />
              <F k="doc1Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">⌂</div>
              <F k="doc2Title" as="h3" />
              <F k="doc2Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">✓</div>
              <F k="doc3Title" as="h3" />
              <F k="doc3Text" as="p" multiline />
            </div>
          </div>
          <div style={{ marginTop: 42 }}>
            <Button to={ROUTES.SIMULACAO} variant="gold" arrow>
              <F k="cta" />
            </Button>
          </div>
        </Wrap>
      </Section>
    </main>
  )
}
