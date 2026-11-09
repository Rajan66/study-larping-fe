import { useContext } from 'react'

import { LogEntriesContext } from '@/hooks/log-entries-context'

export function useLogEntries() {
  const context = useContext(LogEntriesContext)

  if (!context) {
    throw new Error('useLogEntries must be used within a <LogProvider>')
  }

  return context
}
