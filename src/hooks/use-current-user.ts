import { useMemo } from 'react'

import { DEFAULT_USER_EMAIL } from '@/constants/user'
import { getSessionEmail } from '@/utils/storage'
import { createLogAuthor, getInitials, getUsernameFromEmail } from '@/utils/user'

export type CurrentUser = {
  username: string
  email: string
  initials: string
  author: ReturnType<typeof createLogAuthor>
}

/**
 * Reads the signed-in email from the stored session and derives a display
 * name. Swap this for `GET /auth/me` once the API returns a full user.
 */
export function useCurrentUser(): CurrentUser {
  return useMemo(() => {
    const email = getSessionEmail() ?? DEFAULT_USER_EMAIL
    const username = getUsernameFromEmail(email)

    return {
      username,
      email,
      initials: getInitials(username),
      author: createLogAuthor(email),
    }
  }, [])
}
