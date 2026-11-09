import { useEffect, useState } from 'react'

import { readAttachmentFile } from '@/utils/attachment-store'

type AttachmentUrlState =
  { status: 'ready'; url: string } | { status: 'loading' } | { status: 'error'; message: string }

type UseAttachmentUrlOptions = {
  id: string
  src: string
}

/**
 * Turns an attachment reference into something the viewer can render.
 *
 * Demo attachments live in IndexedDB, so the viewer creates its own object URL
 * in this document (new tab included). Real API URLs are used as-is when the id
 * is not in the local store.
 */
export function useAttachmentUrl({ id, src }: UseAttachmentUrlOptions): AttachmentUrlState {
  const [state, setState] = useState<AttachmentUrlState>(() =>
    id ? { status: 'loading' } : src ? { status: 'ready', url: src } : { status: 'loading' },
  )

  useEffect(() => {
    if (!id) return

    let cancelled = false
    let objectUrl: string | null = null

    readAttachmentFile(id)
      .then((file) => {
        if (cancelled) return

        if (file) {
          objectUrl = URL.createObjectURL(file)
          setState({ status: 'ready', url: objectUrl })
          return
        }

        setState(
          src
            ? { status: 'ready', url: src }
            : { status: 'error', message: 'This attachment is no longer available locally.' },
        )
      })
      .catch((cause: unknown) => {
        if (cancelled) return

        if (src) {
          setState({ status: 'ready', url: src })
          return
        }

        setState({
          status: 'error',
          message: cause instanceof Error ? cause.message : 'Could not load the attachment.',
        })
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [id, src])

  return state
}
