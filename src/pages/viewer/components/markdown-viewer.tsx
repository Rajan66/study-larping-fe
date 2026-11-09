import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type MarkdownState =
  | { status: 'loading' }
  | { status: 'ready'; content: string }
  | { status: 'error'; message: string }

export function MarkdownViewer({ src }: { src: string }) {
  const [state, setState] = useState<MarkdownState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    fetch(src, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Could not read the file (${response.status}).`)
        return response.text()
      })
      .then((content) => setState({ status: 'ready', content }))
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          message: cause instanceof Error ? cause.message : 'Could not load the file.',
        })
      })

    return () => controller.abort()
  }, [src])

  if (state.status === 'loading') {
    return <p className="text-muted-foreground py-16 text-center text-sm">Loading Markdown…</p>
  }

  if (state.status === 'error') {
    return (
      <p
        role="alert"
        className="border-destructive/30 bg-destructive/10 text-destructive mx-auto w-full max-w-3xl rounded-md border px-3 py-2 text-sm"
      >
        {state.message}
      </p>
    )
  }

  return (
    <article className="prose prose-neutral dark:prose-invert prose-headings:font-heading prose-pre:bg-muted prose-pre:text-foreground mx-auto w-full max-w-3xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{state.content}</ReactMarkdown>
    </article>
  )
}
