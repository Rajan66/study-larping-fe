import { env } from '@/config/env'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload: unknown = await response.json()

    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>
      const detail = record.message ?? record.error ?? record.detail
      if (typeof detail === 'string' && detail.length > 0) return detail
    }
  } catch {
    // Body was empty or not JSON — fall through to the status text.
  }

  return response.statusText || `Request failed with status ${response.status}`
}

/**
 * Thin `fetch` wrapper: JSON in, JSON out, one error type.
 * `path` is appended to `env.apiBaseUrl`, so pass `/auth/login`, not a full URL.
 */
export async function apiRequest<TResponse>(
  path: string,
  { body, headers, ...init }: RequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
}
