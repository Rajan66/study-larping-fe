export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
} as const

export const AUTH_STORAGE_KEYS = {
  accessToken: 'study-larping.access_token',
  refreshToken: 'study-larping.refresh_token',
  email: 'study-larping.email',
} as const
