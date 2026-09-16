import type { BlogBlock } from '@/content/blog'

const NUM = /^\d+(\.\d+)*[.)]\s+/
const BUL = /^[-\u2013\u2014\u2022*\u00b7]\s*/

function capsish(l: string): boolean {
  return l === l.toUpperCase() && /[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(l)
}

function tituloSolto(l: string): boolean {
  return l.length <= 70 && l.split(/\s+/).length <= 8 && !/[.,;:]$/.test(l)
}

/**
 * Texto puro → BlogBlock[] compatível com BlogArticlePage.
 */
export function formatBlogBody(txt: string): BlogBlock[] {
  const lines = txt.replace(/\r/g, '').split('\n')
  const blocks: string[][] = []
  let cur: string[] = []
  for (const raw of lines) {
    const l = raw.trim()
    if (l === '') {
      if (cur.length) {
        blocks.push(cur)
        cur = []
      }
    } else {
      cur.push(l)
    }
  }
  if (cur.length) blocks.push(cur)

  const out: BlogBlock[] = []
  for (const blk of blocks) {
    const allBul = blk.every((l) => BUL.test(l))
    const allNum = blk.length > 1 && blk.every((l) => NUM.test(l))
    if (allBul || allNum) {
      out.push({
        type: 'ul',
        items: blk.map((l) => l.replace(allBul ? BUL : NUM, '')),
      })
      continue
    }
    let head: string | null = null
    let resto = blk
    const first = blk[0]
    if (blk.length > 1 && (capsish(first) || tituloSolto(first)) && first.length <= 90) {
      head = first
      resto = blk.slice(1)
    } else if (blk.length === 1 && (capsish(first) || (tituloSolto(first) && first.length <= 60))) {
      head = first
      resto = []
    }
    if (head) out.push({ type: 'h2', text: head })
    if (resto.length) {
      const items: string[] = []
      let pc: string[] = []
      for (let r = 0; r < resto.length; r++) {
        if (BUL.test(resto[r])) {
          if (pc.length) {
            out.push({ type: 'p', text: pc.join(' ') })
            pc = []
          }
          while (r < resto.length && BUL.test(resto[r])) {
            items.push(resto[r].replace(BUL, ''))
            r++
          }
          r--
          if (items.length) {
            out.push({ type: 'ul', items: [...items] })
            items.length = 0
          }
        } else {
          pc.push(resto[r])
        }
      }
      if (pc.length) out.push({ type: 'p', text: pc.join(' ') })
    }
  }
  return out
}

/** BlogBlock[] → texto puro (seed / edição). */
export function blocksToPlainText(blocks: BlogBlock[]): string {
  const lines: string[] = []
  for (const b of blocks) {
    if (b.type === 'h2') {
      if (lines.length) lines.push('')
      lines.push(b.text)
      lines.push('')
    } else if (b.type === 'p') {
      const plain = b.text.replace(/<[^>]+>/g, '')
      lines.push(plain)
      lines.push('')
    } else if (b.type === 'ul') {
      for (const item of b.items) {
        lines.push(`- ${item.replace(/<[^>]+>/g, '')}`)
      }
      lines.push('')
    }
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}
