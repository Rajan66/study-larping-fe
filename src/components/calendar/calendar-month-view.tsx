import type { StudyLog } from '@/types/log'
import {
  formatFullDate,
  getWeekdayLabels,
  isSameDay,
  isSameMonth,
  isToday,
  toDateKey,
} from '@/utils/calendar'
import { cn } from '@/utils/cn'

import { CalendarEvent } from './calendar-event'

const WEEKDAY_LABELS = getWeekdayLabels()

type CalendarMonthViewProps = {
  weeks: Date[][]
  cursor: Date
  logsByDate: Map<string, StudyLog[]>
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export function CalendarMonthView({
  weeks,
  cursor,
  logsByDate,
  selectedDate,
  onSelectDate,
}: CalendarMonthViewProps) {
  return (
    <div className="bg-border overflow-hidden rounded-lg border">
      <div className="bg-muted/50 grid grid-cols-7">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-muted-foreground py-2 text-center text-xs font-medium">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px">
        {weeks.flat().map((day) => {
          const logs = logsByDate.get(toDateKey(day)) ?? []
          const inMonth = isSameMonth(day, cursor)
          const selected = isSameDay(day, selectedDate)

          return (
            <button
              key={toDateKey(day)}
              type="button"
              aria-label={formatFullDate(day)}
              aria-haspopup="dialog"
              aria-pressed={selected}
              onClick={() => onSelectDate(day)}
              className={cn(
                'focus-visible:ring-ring flex min-h-20 flex-col gap-1 p-1.5 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset sm:min-h-24 sm:p-2',
                inMonth
                  ? 'bg-card hover:bg-muted/60'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50',
                selected && 'ring-primary ring-2 ring-inset',
              )}
            >
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full text-xs font-medium',
                  isToday(day) && 'bg-primary text-primary-foreground',
                )}
              >
                {day.getDate()}
              </span>

              {logs.length > 0 ? (
                <div className="flex w-full min-w-0 flex-col gap-1">
                  {logs.slice(0, 2).map((log) => (
                    <CalendarEvent key={log.id} log={log} />
                  ))}
                  {logs.length > 2 ? (
                    <span className="text-muted-foreground pl-1 text-[10px]">
                      +{logs.length - 2} more
                    </span>
                  ) : null}
                </div>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
