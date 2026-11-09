import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

import { ThemeProvider } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <ThemeProvider>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </ThemeProvider>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">404</p>
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        That route does not exist. Head back to your dashboard.
      </p>
      <Button asChild>
        <Link to={ROUTES.dashboard}>Go to dashboard</Link>
      </Button>
    </div>
  )
}
