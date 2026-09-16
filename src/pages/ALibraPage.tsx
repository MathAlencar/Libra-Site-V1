import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'
import { Wrap } from '@/components/ui/Wrap'
import { EditableImage } from '@/features/admin/components/EditableImage'
import { usePageField } from '@/features/admin/hooks/usePageField'

export function ALibraPage() {
  const { Field: F, content, setContent } = usePageField('aLibra')
  const fotoFallback = content.paginas.aLibra.fotoFallback || 'Foto do time Libra'

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
          <div className="split">
            <EditableImage
              src={content.midias.sobreImageUrl}
              onChange={(url) =>
                setContent({
                  ...content,
                  midias: { ...content.midias, sobreImageUrl: url },
                })
              }
              fallback={fotoFallback}
              aspect="4/5"
              alt="Time Libra"
            />
            <div>
              <div className="sec-head" style={{ marginBottom: 24 }}>
                <Eyebrow>
                  <F k="histEyebrow" />
                </Eyebrow>
                <F k="histTitle" as="h2" className="serif" />
              </div>
              <F
                k="histP1"
                as="p"
                multiline
                className="alibra-p"
              />
              <F
                k="histP2"
                as="p"
                multiline
                className="alibra-p"
              />
            </div>
          </div>
        </Wrap>
      </Section>

      <Section variant="navy">
        <Wrap>
          <div className="sec-head" style={{ maxWidth: '36rem' }}>
            <Eyebrow light>
              <F k="valEyebrow" />
            </Eyebrow>
            <F k="valTitle" as="h2" className="serif" />
          </div>
          <div className="pgrid">
            <div className="pcard">
              <div className="pi">⚖</div>
              <F k="val1Title" as="h3" />
              <F k="val1Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">◑</div>
              <F k="val2Title" as="h3" />
              <F k="val2Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">♡</div>
              <F k="val3Title" as="h3" />
              <F k="val3Text" as="p" multiline />
            </div>
          </div>
          <div className="about-stats" style={{ marginTop: 26 }}>
            <div className="s">
              <F k="stat1Value" as="b" />
              <F k="stat1Label" as="span" />
            </div>
            <div className="s">
              <F k="stat2Prefix" as="i" className="apde" />
              <F k="stat2Value" as="b" />
              <F k="stat2Label" as="span" />
            </div>
            <div className="s">
              <F k="stat3Value" as="b" />
              <F k="stat3Label" as="span" />
            </div>
            <div className="s">
              <F k="stat4Value" as="b" />
              <F k="stat4Label" as="span" />
            </div>
          </div>
        </Wrap>
      </Section>
    </main>
  )
}
