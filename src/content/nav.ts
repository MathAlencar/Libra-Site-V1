import { ROUTES } from '@/lib/constants/routes'

export type NavItem = {
  label: string
  to: string
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home Equity', to: ROUTES.HOME, end: true },
  { label: 'Como funciona', to: ROUTES.COMO_FUNCIONA },
  { label: 'Por que faz sentido', to: ROUTES.POR_QUE_FAZ_SENTIDO },
  { label: 'A Libra', to: ROUTES.A_LIBRA },
  { label: 'Parceiros', to: ROUTES.PARCEIROS },
  { label: 'Blog', to: ROUTES.BLOG },
]
