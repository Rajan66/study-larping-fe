import { createContext } from 'react'

import type { StudyLog, StudyLogFormValues } from '@/types/log'

export type LogEntriesContextValue = {
  logs: StudyLog[]
  addLog: (values: StudyLogFormValues, date: Date) => void
  removeLog: (id: string) => void
}

export const LogEntriesContext = createContext<LogEntriesContextValue | null>(null)
