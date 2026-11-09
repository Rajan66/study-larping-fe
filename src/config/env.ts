export const env = {
  appName: 'Study Larping',
  /** Override with `VITE_API_BASE_URL` in `.env.local`. */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
} as const
