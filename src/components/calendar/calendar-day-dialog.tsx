import { CalendarDays, Plus } from 'lucide-react'

import { AttachmentActions } from '@/components/attachment-actions'
import { UserLabel } from '@/components/user-label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { StudyLog } from '@/types/log'
import { formatFullDate, formatTime } from '@/utils/calendar'
import { countLogAuthors } from '@/utils/log'

type CalendarDayDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date
  /** Entries for `date`, already sorted. */
  logs: StudyLog[]
  onAddLog: (date: Date) => void
}

/**
 * Opened by clicking a day in the calendar: shows every entry filed that day,
 * who uploaded it, and which file came with it.
 */
export function CalendarDayDialog({
  open,
  onOpenChange,
  date,
  logs,
  onAddLog,
}: CalendarDayDialogProps) {
  const authorCount = countLogAuthors(logs)
  const description =
    logs.length === 0
      ? 'Nothing filed for this day yet.'
      : `${logs.length} ${logs.length === 1 ? 'entry' : 'entries'} from ${authorCount} ${
          authorCount === 1 ? 'person' : 'people'
        }.`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{formatFullDate(date)}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {logs.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-10 text-center text-sm">
            <CalendarDays className="size-5" />
            <p>No study logs on this date.</p>
          </div>
        ) : (
          <ul className="flex max-h-[55vh] flex-col gap-2 overflow-y-auto pr-1">
            {logs.map((log) => (
              <li key={log.id} className="flex flex-col gap-2 rounded-lg border p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-sm font-medium">{log.title}</span>
                  <Badge variant="secondary">{formatTime(log.createdAt)}</Badge>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <UserLabel author={log.author} variant="full" />

                  {log.attachment ? (
                    <AttachmentActions attachment={log.attachment} />
                  ) : (
                    <span className="text-muted-foreground text-xs">No attachment</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button type="button" onClick={() => onAddLog(date)}>
            <Plus data-icon="inline-start" /> Add log for this day
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
