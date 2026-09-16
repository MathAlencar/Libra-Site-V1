import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type WrapProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Wrap({ children, className, ...rest }: WrapProps) {
  return (
    <div className={cn('wrap', className)} {...rest}>
      {children}
    </div>
  )
}
