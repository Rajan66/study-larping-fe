export type LogAttachment = {
  id: string
  name: string
  size: number
  mimeType: string
  /** Object URL for the in-browser demo — swap for an API download URL. */
  url: string
}

/** The person a log belongs to. Denormalised on purpose: logs can outlive a user. */
export type LogAuthor = {
  id: string
  name: string
  email: string
}

export type StudyLog = {
  id: string
  title: string
  /** Local date key in `yyyy-mm-dd` form. */
  date: string
  author: LogAuthor
  attachment: LogAttachment | null
  createdAt: string
}

/** What the "new log" form submits. */
export type StudyLogFormValues = {
  title: string
  file: File | null
}
