import { useEffect, useRef, type ReactNode } from 'react'

import { useAdmin } from '@/features/admin/AdminProvider'
import { cn } from '@/lib/utils'

type EditableTextProps = {
  value: string
  onChange: (v: string) => void
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div' | 'b' | 'i' | 'small'
  className?: string
  multiline?: boolean
  children?: ReactNode
}

export function EditableText({
  value,
  onChange,
  as: Tag = 'span',
  className,
  multiline = false,
}: EditableTextProps) {
  const { editing } = useAdmin()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value
    }
  }, [value])

  return (
    <Tag
      ref={ref as never}
      className={cn(className)}
      contentEditable={editing || undefined}
      suppressContentEditableWarning
      spellCheck={editing ? false : undefined}
      onMouseDown={(e) => {
        if (editing) e.stopPropagation()
      }}
      onClick={(e) => {
        if (editing) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
      onBlur={() => {
        if (!editing || !ref.current) return
        const next = multiline
          ? (ref.current.innerText || '').replace(/\u00a0/g, ' ').trimEnd()
          : (ref.current.textContent || '').trim()
        if (next !== value) onChange(next)
      }}
    >
      {value}
    </Tag>
  )
}
