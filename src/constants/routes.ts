export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  log: '/log',
  viewer: '/viewer',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
