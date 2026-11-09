export const LOG_FILE_EXTENSIONS = ['.pdf', '.md', '.markdown'] as const

export const LOG_FILE_ACCEPT = LOG_FILE_EXTENSIONS.join(',')

export const MAX_LOG_FILE_BYTES = 10 * 1024 * 1024
