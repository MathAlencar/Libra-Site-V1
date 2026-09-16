import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { useAdmin } from '@/features/admin/AdminProvider'
import { cn } from '@/lib/utils'

type Variant = 'blue' | 'gold' | 'ghost-l' | 'ghost-d'
type Size = 'md' | 'sm'

type Common = {
  variant?: Variant
  size?: Size
  arrow?: boolean
  className?: string
  children: ReactNode
  disabled?: boolean
}

type AsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
    href?: undefined
  }

type AsLink = Common & {
  to: string
  href?: undefined
  type?: undefined
  onClick?: () => void
}

type AsAnchor = Common & {
  href: string
  to?: undefined
  target?: string
  rel?: string
  onClick?: () => void
}

export type ButtonProps = AsButton | AsLink | AsAnchor

const variantClass: Record<Variant, string> = {
  blue: 'btn-blue',
  gold: 'btn-gold',
  'ghost-l': 'btn-ghost-l',
  'ghost-d': 'btn-ghost-d',
}

export function Button(props: ButtonProps) {
  const {
    variant = 'blue',
    size = 'md',
    arrow,
    className,
    children,
    disabled,
  } = props

  const { editing } = useAdmin()

  const classes = cn(
    'btn',
    variantClass[variant],
    size === 'sm' && 'btn-sm',
    disabled && 'dis',
    editing && 'is-editing-btn',
    className,
  )

  const content = (
    <>
      {children}
      {arrow ? <span className="ar">→</span> : null}
    </>
  )

  /* Em edição: nunca navega nem submete — só o visual do botão + texto editável. */
  if (editing) {
    return (
      <span
        className={classes}
        role="presentation"
        onClick={(e) => e.preventDefault()}
        onMouseDown={(e) => {
          /* deixa o contentEditable receber foco sem “clicar” o botão */
          if ((e.target as HTMLElement).closest('[contenteditable="true"]')) {
            e.stopPropagation()
          }
        }}
      >
        {content}
      </span>
    )
  }

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes} onClick={props.onClick}>
        {content}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    return (
      <a
        href={props.href}
        className={classes}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
      >
        {content}
      </a>
    )
  }

  const buttonProps = props as AsButton
  return (
    <button
      type={buttonProps.type ?? 'button'}
      className={classes}
      disabled={disabled}
      onClick={buttonProps.onClick}
    >
      {content}
    </button>
  )
}
