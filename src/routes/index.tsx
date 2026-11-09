import { createFileRoute, redirect } from '@tanstack/react-router'

import { ROUTES } from '@/constants/routes'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: ROUTES.dashboard })
  },
})
