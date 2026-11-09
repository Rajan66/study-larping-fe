import type { LogAuthor } from '@/types/log'
import { cn } from '@/utils/cn'
import { getInitials } from '@/utils/user'

type UserLabelProps = {
  author: LogAuthor
  /**
   * `compact` is just the initials badge (tight calendar cells),
   * `default` adds the name, `full` adds the email as well.
   */
  variant?: 'compact' | 'default' | 'full'
  className?: string
}

const AVATAR_SIZE = {
  compact: 'size-4 text-[8px]',
  default: 'size-6 text-[10px]',
  full: 'size-7 text-[11px]',
} as const

/** Read-only identity chip: who uploaded a log entry. Not interactive. */
export function UserLabel({ author, variant = 'default', className }: UserLabelProps) {
  const initials = getInitials(author.name)
  const label = `Uploaded by ${author.name} (${author.email})`

  const avatar = (
    <span
      aria-hidden="true"
      className={cn(
        'bg-primary text-primary-foreground flex shrink-0 items-center justify-center rounded-full font-semibold',
        AVATAR_SIZE[variant],
      )}
    >
      {initials}
    </span>
  )

  if (variant === 'compact') {
    return (
      <span
        aria-label={label}
        title={label}
        className={cn('inline-flex shrink-0 items-center', className)}
      >
        {avatar}
      </span>
    )
  }

  return (
    <span
      aria-label={label}
      title={label}
      className={cn('flex min-w-0 items-center gap-2', className)}
    >
      {avatar}
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-xs leading-tight font-medium">{author.name}</span>
        {variant === 'full' ? (
          <span className="text-muted-foreground truncate text-[11px] leading-tight">
            {author.email}
          </span>
        ) : null}
      </span>
    </span>
  )
}
