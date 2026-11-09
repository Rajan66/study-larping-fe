import type { LogAuthor, StudyLog, StudyLogFormValues } from '@/types/log'

import { addDays, toDateKey } from '@/utils/calendar'
import { createLogAttachment } from '@/utils/file'
import { createLogAuthor } from '@/utils/user'

export function createStudyLog(
  values: StudyLogFormValues,
  date: Date,
  author: LogAuthor,
): StudyLog {
  return {
    id: crypto.randomUUID(),
    title: values.title.trim(),
    date: toDateKey(date),
    author,
    attachment: values.file ? createLogAttachment(values.file) : null,
    createdAt: new Date().toISOString(),
  }
}

export function groupLogsByDate(logs: StudyLog[]): Map<string, StudyLog[]> {
  const groups = new Map<string, StudyLog[]>()

  for (const log of logs) {
    const entries = groups.get(log.date)
    if (entries) entries.push(log)
    else groups.set(log.date, [log])
  }

  return groups
}

export function sortLogsByDate(logs: StudyLog[]): StudyLog[] {
  return [...logs].sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  )
}

/** Entries filed on one day, newest first — used by the day-detail dialog. */
export function getLogsForDate(logs: StudyLog[], date: Date): StudyLog[] {
  const dateKey = toDateKey(date)
  return sortLogsByDate(logs.filter((log) => log.date === dateKey))
}

export function countLogAuthors(logs: StudyLog[]): number {
  return new Set(logs.map((log) => log.author.id)).size
}

/** Demo content so the calendar is not empty on first load. Delete freely. */
export function createSeedLogs(): StudyLog[] {
  const today = new Date()

  return [
    { title: 'Algebra — quadratic forms', offset: 0, author: 'ada@study-larping.dev' },
    { title: 'Problem set 4 walkthrough', offset: 0, author: 'grace@study-larping.dev' },
    { title: 'Cell biology flashcards', offset: -2, author: 'alan@study-larping.dev' },
    { title: 'Reading: distributed systems', offset: 3, author: 'ada@study-larping.dev' },
  ].map(({ title, offset, author }) => ({
    id: crypto.randomUUID(),
    title,
    date: toDateKey(addDays(today, offset)),
    author: createLogAuthor(author),
    attachment: null,
    createdAt: today.toISOString(),
  }))
}
