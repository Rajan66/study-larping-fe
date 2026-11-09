import { FileText, Upload, X } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'

import { Button } from '@/components/ui/button'
import { LOG_FILE_ACCEPT } from '@/constants/log'
import { formatFileSize, getLogFileError } from '@/utils/file'
import { cn } from '@/utils/cn'

type FileDropzoneProps = {
  file: File | null
  onChange: (file: File | null) => void
  onError: (message: string | null) => void
}

export function FileDropzone({ file, onChange, onError }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function acceptNextFile(nextFile: File | null) {
    if (!nextFile) {
      onChange(null)
      onError(null)
      return
    }

    const error = getLogFileError(nextFile)
    onError(error)
    if (error) return

    onChange(nextFile)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    acceptNextFile(event.dataTransfer.files[0] ?? null)
  }

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
        <FileText className="text-muted-foreground size-4 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => acceptNextFile(null)}
          aria-label="Remove attachment"
        >
          <X />
        </Button>
      </div>
    )
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'focus-visible:ring-ring flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center transition-colors outline-none focus-visible:ring-2',
        isDragging ? 'border-primary bg-primary/5' : 'hover:border-primary/60 hover:bg-muted/40',
      )}
    >
      <Upload className="text-muted-foreground size-5" />
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium">Click to upload or drag and drop</p>
        <p className="text-muted-foreground text-xs">
          PDF or Markdown (.pdf, .md, .markdown) up to 10 MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={LOG_FILE_ACCEPT}
        className="hidden"
        onChange={(event) => {
          const nextFile = event.target.files?.[0] ?? null
          // Allow re-selecting the same file after removing it.
          event.target.value = ''
          acceptNextFile(nextFile)
        }}
      />
    </div>
  )
}
