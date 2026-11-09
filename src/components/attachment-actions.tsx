import { Download, FileText } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { LogAttachment } from '@/types/log'
import { cn } from '@/utils/cn'
import { formatFileSize, getAttachmentViewerHref } from '@/utils/file'

type AttachmentActionsProps = {
  attachment: LogAttachment
  className?: string
}

/**
 * Attachment row shared by the study log list and the calendar day dialog:
 * the filename opens the viewer in a new tab, the icon downloads the file.
 */
export function AttachmentActions({ attachment, className }: AttachmentActionsProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-1', className)}>
      <a
        href={getAttachmentViewerHref(attachment)}
        target="_blank"
        rel="noreferrer"
        title={`Open ${attachment.name} in a new tab`}
        className="text-muted-foreground hover:text-foreground inline-flex min-w-0 items-center gap-1 text-xs hover:underline"
      >
        <FileText className="size-3 shrink-0" />
        <span className="truncate">{attachment.name}</span>
        <span className="shrink-0 whitespace-nowrap">· {formatFileSize(attachment.size)}</span>
      </a>

      <Button asChild variant="ghost" size="icon-sm" className="-my-1 shrink-0">
        <a
          href={attachment.url}
          download={attachment.name}
          aria-label={`Download ${attachment.name}`}
          title={`Download ${attachment.name}`}
        >
          <Download />
        </a>
      </Button>
    </div>
  )
}
