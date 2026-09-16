import { RouterProvider } from 'react-router-dom'

import { router } from '@/app/router'
import { AdminProvider } from '@/features/admin'

export function App() {
  return (
    <AdminProvider>
      <RouterProvider router={router} />
    </AdminProvider>
  )
}
