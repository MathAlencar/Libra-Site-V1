import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { AdminFlash, EditBar } from '@/features/admin'

export function RootLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <AdminFlash />
      <EditBar />
    </>
  )
}
