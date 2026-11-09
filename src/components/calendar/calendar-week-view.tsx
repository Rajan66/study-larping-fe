import type { StudyLog } from '@/types/log'
import { formatFullDate, formatWeekdayShort, isSameDay, isToday, toDateKey } from '@/utils/calendar'
import { cn } from '@/utils/cn'

import { CalendarWeekEvent } from './calendar-event'

type CalendarWeekViewProps = {
  days: Date[]
  logsByDate: Map<string, StudyLog[]>
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export function CalendarWeekView({
  days,
  logsByDate,
  selectedDate,
  onSelectDate,
}: CalendarWeekViewProps) {
  return (
    <div className="overflow-x-auto">
      <div className="bg-border grid min-w-[44rem] grid-cols-7 gap-px overflow-hidden rounded-lg border">
        {days.map((day) => {
          const logs = logsByDate.get(toDateKey(day)) ?? []
          const selected = isSameDay(day, selectedDate)

          return (
            <div
              key={toDateKey(day)}
              className={cn(
                'bg-card flex min-h-48 flex-col',
                selected && 'ring-primary ring-2 ring-inset',
              )}
            >
              <button
                type="button"
                aria-label={formatFullDate(day)}
                aria-haspopup="dialog"
                aria-pressed={selected}
                onClick={() => onSelectDate(day)}
                className="hover:bg-muted/60 focus-visible:ring-ring flex flex-col items-center gap-0.5 border-b px-2 py-2 text-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset"
              >
                <span className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                  {formatWeekdayShort(day)}
                </span>
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-sm font-medium',
                    isToday(day) && 'bg-primary text-primary-foreground',
                  )}
                >
                  {day.getDate()}
                </span>
              </button>

              <button
                type="button"
                aria-label={`View entries on ${formatFullDate(day)}`}
                aria-haspopup="dialog"
                onClick={() => onSelectDate(day)}
                className="hover:bg-muted/40 focus-visible:ring-ring flex flex-1 flex-col gap-1 p-1.5 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset"
              >
                {logs.length === 0 ? (
                  <span className="text-muted-foreground px-1 py-2 text-center text-[11px]">
                    No entries
                  </span>
                ) : (
                  logs.map((log) => <CalendarWeekEvent key={log.id} log={log} />)
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
