import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatFullDate } from '@/utils/calendar'
import { getLogFileError } from '@/utils/file'

import type { StudyLogFormValues } from '@/types/log'

import { FileDropzone } from './file-dropzone'

type LogFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Date the entry is filed under (today by default). */
  date: Date
  onSubmit: (values: StudyLogFormValues) => void
}

export function LogFormDialog({ open, onOpenChange, date, onSubmit }: LogFormDialogProps) {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  function reset() {
    setTitle('')
    setFile(null)
    setError(null)
    setFileError(null)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Give the entry a title.')
      return
    }

    const attachmentError = file ? getLogFileError(file) : null
    if (attachmentError) {
      setFileError(attachmentError)
      return
    }

    onSubmit({ title: trimmedTitle, file })
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New study log</DialogTitle>
          <DialogDescription>
            Filed under {formatFullDate(date)}. Attach a PDF or Markdown file if you have one.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            handleSubmit(event)
          }}
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="log-title">Title</Label>
            <Input
              id="log-title"
              name="title"
              placeholder="e.g. Algebra — quadratic forms"
              autoFocus
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError(null)
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Attachment</Label>
            <FileDropzone file={file} onChange={setFile} onError={setFileError} />
            {fileError ? <p className="text-destructive text-xs">{fileError}</p> : null}
          </div>

          {error ? (
            <p
              role="alert"
              className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
            >
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
