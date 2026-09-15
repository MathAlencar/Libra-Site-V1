export const ROUTES = {
  HOME: '/',
  COMO_FUNCIONA: '/como-funciona',
  POR_QUE_FAZ_SENTIDO: '/por-que-faz-sentido',
  A_LIBRA: '/a-libra',
  PARCEIROS: '/parceiros',
  BLOG: '/blog',
  SIMULACAO: '/simulacao',
  POLITICA_PRIVACIDADE: '/politica-de-privacidade',
  POLITICA_COOKIES: '/politica-de-cookies',
  ADMIN: '/admin',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
