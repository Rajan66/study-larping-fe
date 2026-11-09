import { apiRequest } from '@/api/client'
import { AUTH_ENDPOINTS } from '@/constants/auth'
import type { UserLoginRequest, UserLoginResponse } from '@/types/user'

export function login(credentials: UserLoginRequest) {
  return apiRequest<UserLoginResponse>(AUTH_ENDPOINTS.login, {
    method: 'POST',
    body: credentials,
  })
}
