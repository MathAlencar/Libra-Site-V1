import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type EyebrowProps = {
  children: ReactNode
  light?: boolean
  className?: string
}

export function Eyebrow({ children, light, className }: EyebrowProps) {
  return (
    <span className={cn('eyebrow', light && 'light', className)}>{children}</span>
  )
}
