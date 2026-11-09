import { createFileRoute } from '@tanstack/react-router'

import { ViewerPage } from '@/pages/viewer'

export const Route = createFileRoute('/viewer')({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === 'string' ? search.id : '',
    src: typeof search.src === 'string' ? search.src : '',
    name: typeof search.name === 'string' ? search.name : 'Attachment',
    type: typeof search.type === 'string' ? search.type : '',
    size: typeof search.size === 'string' ? search.size : '',
  }),
  component: ViewerRoute,
})

function ViewerRoute() {
  const search = Route.useSearch()

  return <ViewerPage {...search} />
}
