import { useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { login } from '@/api/auth'
import { ApiError } from '@/api/client'
import { Brand } from '@/components/brand'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { env } from '@/config/env'
import { ROUTES } from '@/constants/routes'
import type { UserLoginRequest } from '@/types/user'
import { saveSession } from '@/utils/storage'

export function LoginPage() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState<UserLoginRequest>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField(field: keyof UserLoginRequest, value: string) {
    setCredentials((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const session = await login(credentials)
      saveSession(session, credentials.email)
      await navigate({ to: ROUTES.dashboard })
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : `Could not reach the API at ${env.apiBaseUrl}. Is it running?`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Brand />
        <ModeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Use the account your instructor gave you.</CardDescription>
            </CardHeader>

            <form
              onSubmit={(event) => {
                void handleSubmit(event)
              }}
              noValidate
            >
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    value={credentials.email}
                    onChange={(event) => updateField('email', event.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      required
                      className="pr-9"
                      value={credentials.password}
                      onChange={(event) => updateField('password', event.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute top-1/2 right-1 -translate-y-1/2"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((visible) => !visible)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
                  >
                    {error}
                  </p>
                ) : null}
              </CardContent>

              <CardFooter className="mt-6">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <LogIn />}
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {import.meta.env.DEV ? (
            <p className="text-muted-foreground text-center text-xs">
              API: <code>{env.apiBaseUrl}</code>
            </p>
          ) : null}
        </div>
      </main>
    </div>
  )
}
