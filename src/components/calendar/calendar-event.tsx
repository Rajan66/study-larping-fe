import { Paperclip } from 'lucide-react'

import { UserLabel } from '@/components/user-label'
import type { StudyLog } from '@/types/log'

export function CalendarEvent({ log }: { log: StudyLog }) {
  return (
    <span className="bg-primary/10 text-primary flex w-full min-w-0 items-center gap-1 rounded px-1.5 py-0.5 text-[10px] leading-tight font-medium">
      <UserLabel author={log.author} variant="compact" className="-ml-0.5" />
      {log.attachment ? <Paperclip className="size-2.5 shrink-0" /> : null}
      <span className="truncate">{log.title}</span>
    </span>
  )
}

export function CalendarWeekEvent({ log }: { log: StudyLog }) {
  return (
    <span className="bg-primary/10 text-primary flex w-full flex-col gap-1 rounded px-1.5 py-1 text-[11px] leading-tight">
      <UserLabel author={log.author} className="text-foreground" />
      <span className="font-medium">{log.title}</span>
      {log.attachment ? (
        <span className="flex min-w-0 items-center gap-1 opacity-80">
          <Paperclip className="size-2.5 shrink-0" />
          <span className="truncate">{log.attachment.name}</span>
        </span>
      ) : null}
    </span>
  )
}
