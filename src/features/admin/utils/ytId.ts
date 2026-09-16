/** Extrai o ID de 11 caracteres de URLs YouTube (watch, embed, shorts, youtu.be). */
export function ytId(url: string | null | undefined): string | null {
  const m = (url || '').match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  )
  return m ? m[1] : null
}
