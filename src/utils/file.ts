import { LOG_FILE_EXTENSIONS, MAX_LOG_FILE_BYTES } from '@/constants/log'
import { ROUTES } from '@/constants/routes'
import { saveAttachmentFile } from '@/utils/attachment-store'

import type { LogAttachment } from '@/types/log'

export function getFileExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot === -1 ? '' : fileName.slice(dot).toLowerCase()
}

export function isAcceptedLogFile(file: File): boolean {
  return (LOG_FILE_EXTENSIONS as readonly string[]).includes(getFileExtension(file.name))
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`

  const kilobytes = bytes / 1024
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`

  return `${(kilobytes / 1024).toFixed(1)} MB`
}

/** Single source of truth for attachment validation, shared by form and dropzone. */
export function getLogFileError(file: File): string | null {
  if (!isAcceptedLogFile(file)) {
    return `Only ${LOG_FILE_EXTENSIONS.join(', ')} files are supported.`
  }

  if (file.size > MAX_LOG_FILE_BYTES) {
    return `File is larger than ${formatFileSize(MAX_LOG_FILE_BYTES)}.`
  }

  return null
}

export function createLogAttachment(file: File): LogAttachment {
  const id = crypto.randomUUID()

  // Persisted for the viewer, which may run in another tab.
  void saveAttachmentFile(id, file).catch(() => {
    // The object URL below still covers same-document previews.
  })

  return {
    id,
    name: file.name,
    size: file.size,
    mimeType: file.type || 'application/octet-stream',
    url: URL.createObjectURL(file),
  }
}

export type AttachmentKind = 'markdown' | 'pdf' | 'other'

export function getAttachmentKind(
  attachment: Pick<LogAttachment, 'name' | 'mimeType'>,
): AttachmentKind {
  const extension = getFileExtension(attachment.name)

  if (extension === '.md' || extension === '.markdown') return 'markdown'
  if (extension === '.pdf') return 'pdf'

  if (attachment.mimeType === 'text/markdown') return 'markdown'
  if (attachment.mimeType === 'application/pdf') return 'pdf'

  return 'other'
}

/**
 * In-app viewer link. The file URL travels as a query param so the viewer page
 * works in a fresh tab without the in-memory log store. Swap `attachment.url`
 * for the API download URL and this keeps working.
 */
export function getAttachmentViewerHref(attachment: LogAttachment): string {
  const params = new URLSearchParams({
    id: attachment.id,
    src: attachment.url,
    name: attachment.name,
    type: attachment.mimeType,
    size: String(attachment.size),
  })

  return `${ROUTES.viewer}?${params.toString()}`
}
