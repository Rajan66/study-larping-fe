import { AUTH_STORAGE_KEYS } from '@/constants/auth'
import type { UserLoginResponse } from '@/types/user'

function storage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage
}

export function saveSession(tokens: UserLoginResponse, email: string) {
  storage()?.setItem(AUTH_STORAGE_KEYS.accessToken, tokens.access_token)
  storage()?.setItem(AUTH_STORAGE_KEYS.refreshToken, tokens.refresh_token)
  storage()?.setItem(AUTH_STORAGE_KEYS.email, email)
}

export function getAccessToken(): string | null {
  return storage()?.getItem(AUTH_STORAGE_KEYS.accessToken) ?? null
}

export function getRefreshToken(): string | null {
  return storage()?.getItem(AUTH_STORAGE_KEYS.refreshToken) ?? null
}

export function getSessionEmail(): string | null {
  return storage()?.getItem(AUTH_STORAGE_KEYS.email) ?? null
}

export function clearSession() {
  storage()?.removeItem(AUTH_STORAGE_KEYS.accessToken)
  storage()?.removeItem(AUTH_STORAGE_KEYS.refreshToken)
  storage()?.removeItem(AUTH_STORAGE_KEYS.email)
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null
}
