export type UserRole = 'student' | 'instructor' | 'admin'

export type User = {
  id: string
  email: string
  /** Only sent to the auth API — never returned by it. */
  password: string
  first_name: string
  last_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

/** Payload for `POST /auth/login` — just the credentials from `User`. */
export type UserLoginRequest = Pick<User, 'email' | 'password'>

/** Tokens returned by `POST /auth/login`. */
export type UserLoginResponse = {
  access_token: string
  refresh_token: string
}
