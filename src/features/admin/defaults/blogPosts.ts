import { BLOG_ARTICLES } from '@/content/blog'
import type { BlogPost } from '@/features/admin/types'
import { blocksToPlainText } from '@/features/admin/utils/formatBlogBody'
import { createId } from '@/features/admin/utils/id'

export function createDefaultBlogPosts(): BlogPost[] {
  const base = Date.now()
  return BLOG_ARTICLES.map((a, i) => ({
    id: createId(),
    slug: a.slug,
    titulo: a.title,
    categoria: a.category,
    resumo: a.summary,
    subtitulo: a.subtitle,
    leitura: a.readTime,
    corpoTexto: blocksToPlainText(a.body),
    publicado: a.visible,
    publicadoEm: new Date(base - i * 86_400_000).toISOString(),
  }))
}
