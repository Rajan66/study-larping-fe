import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { LogEntriesContext, type LogEntriesContextValue } from '@/hooks/log-entries-context'
import { useCurrentUser } from '@/hooks/use-current-user'
import type { StudyLog, StudyLogFormValues } from '@/types/log'
import { createSeedLogs, createStudyLog } from '@/utils/log'

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<StudyLog[]>(createSeedLogs)
  const { author } = useCurrentUser()

  const addLog = useCallback(
    (values: StudyLogFormValues, date: Date) => {
      setLogs((current) => [createStudyLog(values, date, author), ...current])
    },
    [author],
  )

  const removeLog = useCallback((id: string) => {
    setLogs((current) => current.filter((log) => log.id !== id))
  }, [])

  const value = useMemo<LogEntriesContextValue>(
    () => ({ logs, addLog, removeLog }),
    [logs, addLog, removeLog],
  )

  return <LogEntriesContext.Provider value={value}>{children}</LogEntriesContext.Provider>
}
