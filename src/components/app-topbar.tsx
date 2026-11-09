import { useRouterState } from '@tanstack/react-router'
import { Menu } from 'lucide-react'

import { ModeToggle } from '@/components/mode-toggle'
import { UserAvatar } from '@/components/user-avatar'
import { Button } from '@/components/ui/button'
import { NAV_ITEMS } from '@/constants/navigation'

type AppTopbarProps = {
  onOpenSidebar: () => void
}

export function AppTopbar({ onOpenSidebar }: AppTopbarProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const currentItem = NAV_ITEMS.find((item) => pathname.startsWith(item.to))

  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onOpenSidebar}
        aria-label="Open sidebar"
      >
        <Menu />
      </Button>

      <span className="font-heading truncate text-sm font-semibold tracking-tight">
        {currentItem?.label ?? 'Workspace'}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
        <UserAvatar />
      </div>
    </header>
  )
}
