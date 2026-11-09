import { Plus } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { useLogEntries } from '@/hooks/use-log-entries'

import { LogFormDialog } from './components/log-form-dialog'
import { LogList } from './components/log-list'

/**
 * Entry point for the study log page: no layout or data logic of its own,
 * just the composition of the pieces in `pages/log/components`.
 */
export function LogPage() {
  const { logs, addLog, removeLog } = useLogEntries()
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Study log"
        description="Everything you have filed, newest first."
        action={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus data-icon="inline-start" /> Add log
          </Button>
        }
      />

      <LogList logs={logs} onRemove={removeLog} />

      <LogFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        date={new Date()}
        onSubmit={(values) => addLog(values, new Date())}
      />
    </div>
  )
}
