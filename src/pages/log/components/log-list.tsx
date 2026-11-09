import { Trash2 } from 'lucide-react'

import { AttachmentActions } from '@/components/attachment-actions'
import { UserLabel } from '@/components/user-label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { StudyLog } from '@/types/log'
import { formatShortDate, fromDateKey } from '@/utils/calendar'
import { sortLogsByDate } from '@/utils/log'

type LogListProps = {
  logs: StudyLog[]
  onRemove: (id: string) => void
}

export function LogList({ logs, onRemove }: LogListProps) {
  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground py-10 text-center text-sm">
          No entries yet. Use “Add log” to create your first one.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {sortLogsByDate(logs).map((log) => (
        <Card key={log.id}>
          <CardContent className="flex flex-wrap items-start justify-between gap-3 py-4">
            <div className="flex min-w-0 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{log.title}</span>
                <Badge variant="secondary">{formatShortDate(fromDateKey(log.date))}</Badge>
              </div>

              <UserLabel author={log.author} variant="full" />

              {log.attachment ? (
                <AttachmentActions attachment={log.attachment} />
              ) : (
                <span className="text-muted-foreground text-xs">No attachment</span>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onRemove(log.id)}
              aria-label={`Delete ${log.title}`}
            >
              <Trash2 />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
