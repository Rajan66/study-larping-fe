import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { CalendarView } from '@/types/calendar'

const VIEW_OPTIONS: { value: CalendarView; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

type CalendarToolbarProps = {
  title: string
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function CalendarToolbar({
  title,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon-sm" onClick={onPrevious} aria-label="Previous period">
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <Button variant="outline" size="icon-sm" onClick={onNext} aria-label="Next period">
          <ChevronRight />
        </Button>
        <h2 className="font-heading ml-1 text-base font-semibold tracking-tight">{title}</h2>
      </div>

      <div
        className="bg-muted flex items-center gap-1 rounded-lg p-1"
        role="group"
        aria-label="Calendar view"
      >
        {VIEW_OPTIONS.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant={view === option.value ? 'default' : 'ghost'}
            aria-pressed={view === option.value}
            className="h-7"
            onClick={() => onViewChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
