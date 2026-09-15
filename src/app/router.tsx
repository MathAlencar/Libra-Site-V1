import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '@/components/layout/RootLayout'
import { ROUTES } from '@/lib/constants/routes'
import {
  AdminPage,
  ALibraPage,
  BlogPage,
  ComoFuncionaPage,
  HomePage,
  ParceirosPage,
  PoliticaCookiesPage,
  PoliticaPrivacidadePage,
  PorQueFazSentidoPage,
  SimulacaoPage,
} from '@/pages'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.COMO_FUNCIONA, element: <ComoFuncionaPage /> },
      { path: ROUTES.POR_QUE_FAZ_SENTIDO, element: <PorQueFazSentidoPage /> },
      { path: ROUTES.A_LIBRA, element: <ALibraPage /> },
      { path: ROUTES.PARCEIROS, element: <ParceirosPage /> },
      { path: ROUTES.BLOG, element: <BlogPage /> },
      { path: ROUTES.SIMULACAO, element: <SimulacaoPage /> },
      {
        path: ROUTES.POLITICA_PRIVACIDADE,
        element: <PoliticaPrivacidadePage />,
      },
      { path: ROUTES.POLITICA_COOKIES, element: <PoliticaCookiesPage /> },
      { path: ROUTES.ADMIN, element: <AdminPage /> },
    ],
  },
])
