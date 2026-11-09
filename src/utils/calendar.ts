const WEEKDAY_LONG = new Intl.DateTimeFormat(undefined, { weekday: 'long' })
const WEEKDAY_SHORT = new Intl.DateTimeFormat(undefined, { weekday: 'short' })
const MONTH_YEAR = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
const MONTH_DAY = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
const DAY_NUMERIC = new Intl.DateTimeFormat(undefined, { day: 'numeric' })

/** Monday-first week. */
export const WEEK_STARTS_ON = 1

export function startOfDay(date: Date): Date {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function addMonths(date: Date, amount: number): Date {
  const next = new Date(date)
  next.setDate(1)
  next.setMonth(next.getMonth() + amount)
  return next
}

export function startOfWeek(date: Date, weekStartsOn = WEEK_STARTS_ON): Date {
  const day = startOfDay(date)
  const offset = (day.getDay() - weekStartsOn + 7) % 7
  return addDays(day, -offset)
}

export function startOfMonth(date: Date): Date {
  const next = startOfDay(date)
  next.setDate(1)
  return next
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

/** Local-date key. Avoids `toISOString()`, which shifts across timezones. */
export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

/** Six full weeks, so the month grid never changes height. */
export function getMonthWeeks(date: Date, weekStartsOn = WEEK_STARTS_ON): Date[][] {
  const firstDay = startOfWeek(startOfMonth(date), weekStartsOn)

  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => addDays(firstDay, week * 7 + day)),
  )
}

export function getWeekDays(date: Date, weekStartsOn = WEEK_STARTS_ON): Date[] {
  const firstDay = startOfWeek(date, weekStartsOn)
  return Array.from({ length: 7 }, (_, day) => addDays(firstDay, day))
}

export function getWeekdayLabels(weekStartsOn = WEEK_STARTS_ON): string[] {
  const firstDay = startOfWeek(new Date(), weekStartsOn)
  return Array.from({ length: 7 }, (_, day) => WEEKDAY_SHORT.format(addDays(firstDay, day)))
}

export function formatMonthYear(date: Date): string {
  return MONTH_YEAR.format(date)
}

export function formatWeekRange(date: Date): string {
  const start = startOfWeek(date)
  const end = addDays(start, 6)
  const startLabel = MONTH_DAY.format(start)
  const endLabel = isSameMonth(start, end)
    ? DAY_NUMERIC.format(end)
    : `${MONTH_DAY.format(end)}, ${end.getFullYear()}`
  return `${startLabel} – ${endLabel}${isSameMonth(start, end) ? `, ${end.getFullYear()}` : ''}`
}

export function formatWeekday(date: Date): string {
  return WEEKDAY_LONG.format(date)
}

export function formatWeekdayShort(date: Date): string {
  return WEEKDAY_SHORT.format(date)
}

export function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatTime(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(isoDate))
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
