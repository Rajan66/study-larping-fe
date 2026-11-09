import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { AppSidebar } from '@/components/app-sidebar'
import { AppTopbar } from '@/components/app-topbar'
import { LogProvider } from '@/components/log-provider'

export const Route = createFileRoute('/_app')({ component: AppLayout })

/**
 * Authenticated shell. To protect it once the API is wired up:
 *
 *   beforeLoad: () => {
 *     if (!isAuthenticated()) throw redirect({ to: ROUTES.login })
 *   }
 */
function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <LogProvider>
      <div className="flex min-h-svh">
        <AppSidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar onOpenSidebar={() => setIsSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </LogProvider>
  )
}
