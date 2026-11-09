import { useMemo, useState } from 'react'

import type { CalendarView } from '@/types/calendar'
import {
  addDays,
  addMonths,
  formatMonthYear,
  formatWeekRange,
  getMonthWeeks,
  getWeekDays,
  startOfDay,
} from '@/utils/calendar'

/**
 * Owns calendar navigation state. `weeks` is always a `Date[][]`:
 * six rows in month view, one row in week view.
 */
export function useCalendar(initialDate: Date = new Date()) {
  const [view, setView] = useState<CalendarView>('month')
  const [cursor, setCursor] = useState(() => startOfDay(initialDate))

  const weeks = useMemo(
    () => (view === 'month' ? getMonthWeeks(cursor) : [getWeekDays(cursor)]),
    [cursor, view],
  )

  const title = view === 'month' ? formatMonthYear(cursor) : formatWeekRange(cursor)

  function goToPrevious() {
    setCursor((current) => (view === 'month' ? addMonths(current, -1) : addDays(current, -7)))
  }

  function goToNext() {
    setCursor((current) => (view === 'month' ? addMonths(current, 1) : addDays(current, 7)))
  }

  function goToToday() {
    setCursor(startOfDay(new Date()))
  }

  return {
    view,
    setView,
    cursor,
    weeks,
    title,
    goToPrevious,
    goToNext,
    goToToday,
  }
}
