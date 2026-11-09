import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useEffect } from 'react'

import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { NAV_ITEMS } from '@/constants/navigation'
import { cn } from '@/utils/cn'

type AppSidebarProps = {
  open: boolean
  onClose: () => void
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <>
      {/* Mobile drawer */}
      <div className={cn('fixed inset-0 z-50 md:hidden', open ? 'block' : 'hidden')}>
        <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
        <aside className="bg-sidebar text-sidebar-foreground absolute inset-y-0 left-0 flex w-64 flex-col border-r shadow-lg">
          <SidebarContent onNavigate={onClose} />
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="bg-sidebar text-sidebar-foreground hidden w-64 shrink-0 flex-col border-r md:sticky md:top-0 md:flex md:h-svh">
        <SidebarContent />
      </aside>
    </>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Brand />
        {onNavigate ? (
          <Button variant="ghost" size="icon-sm" onClick={onNavigate} aria-label="Close sidebar">
            <X />
          </Button>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <Button
            key={to}
            asChild
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={onNavigate}
          >
            <Link
              to={to}
              activeProps={{ className: 'bg-muted text-foreground' }}
              inactiveProps={{ className: 'text-muted-foreground' }}
            >
              <Icon />
              {label}
            </Link>
          </Button>
        ))}
      </nav>

      <p className="text-muted-foreground border-t px-4 py-4 text-xs">Study Larping · scaffold</p>
    </>
  )
}
