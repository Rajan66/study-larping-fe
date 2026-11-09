import { LayoutDashboard, NotebookPen } from 'lucide-react'

import { ROUTES } from '@/constants/routes'

export const NAV_ITEMS = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.log, label: 'Study log', icon: NotebookPen },
] as const

export type NavItem = (typeof NAV_ITEMS)[number]
