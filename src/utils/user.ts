import type { LogAuthor } from '@/types/log'

export function getUsernameFromEmail(email: string): string {
  const [localPart] = email.split('@')
  return localPart && localPart.length > 0 ? localPart : 'guest'
}

/** Builds the author stamp stored on every log entry. */
export function createLogAuthor(email: string): LogAuthor {
  return {
    id: email,
    name: getUsernameFromEmail(email),
    email,
  }
}

export function getInitials(value: string): string {
  const parts = value
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  const initials = parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')

  return initials.toUpperCase() || '?'
}
