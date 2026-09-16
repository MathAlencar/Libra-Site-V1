import { useAdmin } from '@/features/admin/AdminProvider'
import { cn } from '@/lib/utils'

/** Toast global do admin — visível na home (barra Salvar) e no painel. */
export function AdminFlash() {
  const { flash } = useAdmin()
  if (!flash) return null

  return (
    <div
      className={cn('adm-toast', flash.type === 'err' && 'err')}
      role="status"
      aria-live="polite"
    >
      {flash.text}
    </div>
  )
}
