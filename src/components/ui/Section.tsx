import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SectionVariant = 'cream' | 'cream2' | 'navy' | 'blue'

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  variant?: SectionVariant
}

const variantClass: Record<SectionVariant, string> = {
  cream: 'sec--cream',
  cream2: 'sec--cream2',
  navy: 'sec--navy',
  blue: 'sec--blue',
}

export function Section({
  children,
  variant = 'cream',
  className,
  ...rest
}: SectionProps) {
  return (
    <section className={cn('sec', variantClass[variant], className)} {...rest}>
      {children}
    </section>
  )
}
