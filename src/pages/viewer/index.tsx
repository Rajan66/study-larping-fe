import { Link } from '@tanstack/react-router'
import { ArrowLeft, Download, Loader2 } from 'lucide-react'

import { Brand } from '@/components/brand'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { formatFileSize, getAttachmentKind, type AttachmentKind } from '@/utils/file'

import { MarkdownViewer } from './components/markdown-viewer'
import { PdfViewer } from './components/pdf-viewer'
import { useAttachmentUrl } from './hooks/use-attachment-url'

export type ViewerPageProps = {
  id: string
  src: string
  name: string
  type: string
  size: string
}

const KIND_LABEL: Record<AttachmentKind, string> = {
  markdown: 'Markdown document',
  pdf: 'PDF document',
  other: 'File',
}

/**
 * Full-page attachment viewer, opened in a new tab from the log list or the
 * calendar day dialog. Thin composition of the header and the two viewers.
 */
export function ViewerPage({ id, src, name, type, size }: ViewerPageProps) {
  const attachment = useAttachmentUrl({ id, src })
  const kind = getAttachmentKind({ name, mimeType: type })
  const bytes = Number(size)
  const sizeLabel = Number.isFinite(bytes) && bytes > 0 ? formatFileSize(bytes) : null
  const title = name || 'Attachment'
  const hasReference = Boolean(id || src)
  const resolvedUrl = attachment.status === 'ready' ? attachment.url : null

  return (
    <div className="bg-background flex min-h-svh flex-col">
      <header className="bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Button asChild variant="ghost" size="icon-sm" aria-label="Back to dashboard">
            <Link to={ROUTES.dashboard}>
              <ArrowLeft />
            </Link>
          </Button>

          <Brand className="hidden sm:inline" />
          <span className="bg-border hidden h-5 w-px sm:block" aria-hidden="true" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="text-muted-foreground text-xs">
              {KIND_LABEL[kind]}
              {sizeLabel ? ` · ${sizeLabel}` : null}
            </p>
          </div>

          <ModeToggle />

          {resolvedUrl ? (
            <Button asChild size="sm">
              <a href={resolvedUrl} download={title}>
                <Download data-icon="inline-start" />
                <span className="hidden sm:inline">Download</span>
              </a>
            </Button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6">
        {!hasReference ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <h1 className="font-heading text-xl font-semibold tracking-tight">Nothing to show</h1>
            <p className="text-muted-foreground max-w-sm text-sm">
              This viewer needs a file URL. Open an attachment from your study log instead.
            </p>
            <Button asChild variant="outline">
              <Link to={ROUTES.log}>Go to study log</Link>
            </Button>
          </div>
        ) : attachment.status === 'loading' ? (
          <div className="text-muted-foreground flex flex-1 items-center justify-center gap-2 py-16 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Loading file…
          </div>
        ) : attachment.status === 'error' ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <p
              role="alert"
              className="border-destructive/30 bg-destructive/10 text-destructive max-w-md rounded-md border px-3 py-2 text-sm"
            >
              {attachment.message}
            </p>
            <Button asChild variant="outline">
              <Link to={ROUTES.log}>Back to study log</Link>
            </Button>
          </div>
        ) : kind === 'markdown' ? (
          <MarkdownViewer src={attachment.url} />
        ) : kind === 'pdf' ? (
          <PdfViewer src={attachment.url} title={title} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <h1 className="font-heading text-xl font-semibold tracking-tight">
              Preview not available
            </h1>
            <p className="text-muted-foreground max-w-sm text-sm">
              Only PDF and Markdown files can be previewed. Download the file to open it locally.
            </p>
            <Button asChild variant="outline">
              <a href={attachment.url} download={title}>
                <Download data-icon="inline-start" /> Download {title}
              </a>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
