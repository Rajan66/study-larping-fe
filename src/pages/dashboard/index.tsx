import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Calendar } from '@/components/calendar/calendar'
import { CalendarDayDialog } from '@/components/calendar/calendar-day-dialog'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { useLogEntries } from '@/hooks/use-log-entries'
import { startOfDay } from '@/utils/calendar'
import { getLogsForDate } from '@/utils/log'

import { LogFormDialog } from '@/pages/log/components/log-form-dialog'

export function DashboardPage() {
  const { logs, addLog } = useLogEntries()
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()))
  const [detailsDate, setDetailsDate] = useState<Date | null>(null)
  const [formDate, setFormDate] = useState<Date | null>(null)

  /** Clicking a day selects it and opens the "who filed what" dialog. */
  function handleSelectDate(date: Date) {
    setSelectedDate(date)
    setDetailsDate(date)
  }

  function handleAddForDate(date: Date) {
    setDetailsDate(null)
    setFormDate(date)
  }

  const formDateValue = formDate ?? selectedDate

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Your study log at a glance. Pick a day to see who filed what."
        action={
          <Button onClick={() => setFormDate(selectedDate)}>
            <Plus data-icon="inline-start" /> Add log
          </Button>
        }
      />

      <Calendar logs={logs} selectedDate={selectedDate} onSelectDate={handleSelectDate} />

      <CalendarDayDialog
        open={detailsDate !== null}
        date={detailsDate ?? selectedDate}
        logs={getLogsForDate(logs, detailsDate ?? selectedDate)}
        onOpenChange={(open) => {
          if (!open) setDetailsDate(null)
        }}
        onAddLog={handleAddForDate}
      />

      <LogFormDialog
        open={formDate !== null}
        onOpenChange={(open) => {
          if (!open) setFormDate(null)
        }}
        date={formDateValue}
        onSubmit={(values) => addLog(values, formDateValue)}
      />
    </div>
  )
}
