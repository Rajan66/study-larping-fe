import { Link } from '@tanstack/react-router'

import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      to={ROUTES.home}
      className={cn('font-heading text-sm font-semibold tracking-tight', className)}
    >
      study<span className="text-muted-foreground">/</span>larping
    </Link>
  )
}
