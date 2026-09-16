import { useId, useState } from 'react'

import { Photo } from '@/components/ui/Photo'
import { useAdmin } from '@/features/admin/AdminProvider'
import { resolveMediaUrl, uploadImage } from '@/features/admin/api/client'
import { cn } from '@/lib/utils'

type EditableImageProps = {
  src: string
  onChange: (url: string) => void
  alt?: string
  fallback?: string
  aspect?: string
  className?: string
  radius?: string
}

export function EditableImage({
  src,
  onChange,
  alt = '',
  fallback = 'Foto',
  aspect = '4/5',
  className,
  radius,
}: EditableImageProps) {
  const { editing, setFlash } = useAdmin()
  const inputId = useId()
  const [uploading, setUploading] = useState(false)

  async function onFile(file: File | undefined) {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
      setFlash({
        type: 'ok',
        text: 'Imagem enviada. Clique em Salvar na barra para gravar no servidor.',
      })
    } catch (err) {
      setFlash({
        type: 'err',
        text: err instanceof Error ? err.message : 'Falha no upload da imagem.',
      })
    } finally {
      setUploading(false)
    }
  }

  const photo = (
    <Photo
      src={resolveMediaUrl(src)}
      alt={alt}
      fallback={fallback}
      aspect={aspect}
      className={className}
      radius={radius}
    />
  )

  if (!editing) {
    return photo
  }

  return (
    <label
      htmlFor={inputId}
      className={cn('editable-img-wrap is-editing', uploading && 'is-uploading')}
      title="Clique para escolher uma imagem"
    >
      {photo}
      <span className="editable-img-overlay" aria-hidden>
        {uploading ? 'Enviando…' : 'Trocar imagem'}
      </span>
      <input
        id={inputId}
        className="sr-file"
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        disabled={uploading}
        onChange={(e) => {
          void onFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </label>
  )
}
