import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/constants/routes'
import { useCurrentUser } from '@/hooks/use-current-user'
import { clearSession } from '@/utils/storage'

export function UserAvatar() {
  const { username, email, initials } = useCurrentUser()
  const navigate = useNavigate()

  function handleLogout() {
    clearSession()
    void navigate({ to: ROUTES.login })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="focus-visible:ring-ring bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Identity is plain text — only the logout item is interactive. */}
        <div className="flex flex-col gap-0.5 px-2 py-2">
          <p className="text-sm font-medium">{username}</p>
          <p className="text-muted-foreground truncate text-xs">{email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
