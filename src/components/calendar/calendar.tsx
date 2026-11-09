import { useMemo } from 'react'

import { useCalendar } from '@/hooks/use-calendar'
import type { StudyLog } from '@/types/log'
import { groupLogsByDate } from '@/utils/log'

import { CalendarMonthView } from './calendar-month-view'
import { CalendarToolbar } from './calendar-toolbar'
import { CalendarWeekView } from './calendar-week-view'

type CalendarProps = {
  logs: StudyLog[]
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export function Calendar({ logs, selectedDate, onSelectDate }: CalendarProps) {
  const { view, setView, cursor, weeks, title, goToPrevious, goToNext, goToToday } =
    useCalendar(selectedDate)

  const logsByDate = useMemo(() => groupLogsByDate(logs), [logs])

  return (
    <div className="flex flex-col gap-4">
      <CalendarToolbar
        title={title}
        view={view}
        onViewChange={setView}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
      />

      {view === 'month' ? (
        <CalendarMonthView
          weeks={weeks}
          cursor={cursor}
          logsByDate={logsByDate}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
      ) : (
        <CalendarWeekView
          days={weeks[0] ?? []}
          logsByDate={logsByDate}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
      )}
    </div>
  )
}
