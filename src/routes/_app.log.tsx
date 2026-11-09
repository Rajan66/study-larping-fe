import { createFileRoute } from '@tanstack/react-router'

import { LogPage } from '@/pages/log'

export const Route = createFileRoute('/_app/log')({ component: LogPage })
