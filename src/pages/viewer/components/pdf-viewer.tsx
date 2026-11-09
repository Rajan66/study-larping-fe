type PdfViewerProps = {
  src: string
  title: string
}

/**
 * Hands the PDF to the browser's native viewer inside an iframe, so zoom,
 * pagination, search and print come for free without shipping pdf.js.
 */
export function PdfViewer({ src, title }: PdfViewerProps) {
  return (
    <div className="bg-muted/40 overflow-hidden rounded-lg border">
      <iframe src={src} title={title} className="h-[calc(100svh-8.5rem)] w-full" />
    </div>
  )
}
