# study-larping-fe

Frontend for a study-log app: **Vite + React 19 + TypeScript + TanStack Router + Tailwind CSS v4 + shadcn/ui**.

Sign in, then browse your study entries on a week/month calendar and file new ones
with a title and an optional PDF/Markdown attachment.

## Requirements

- Node.js 22+ (install via `winget install OpenJS.NodeJS.LTS`)
- npm 10+

> TypeScript is pinned to **6.0.x** because `typescript-eslint` does not support
> TypeScript 7 (the native compiler) yet. Bump it together with `typescript-eslint`.

## Scripts

| Script                 | What it does                                 |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start Vite with HMR on http://localhost:5173 |
| `npm run build`        | Type-check, then build to `dist/`            |
| `npm run preview`      | Serve the production build locally           |
| `npm run typecheck`    | `tsc -b` without emitting                    |
| `npm run lint`         | ESLint (flat config, type-aware)             |
| `npm run lint:fix`     | ESLint with `--fix`                          |
| `npm run format`       | Prettier write                               |
| `npm run format:check` | Prettier check (use in CI)                   |

## Routes

| URL          | Page                                                     |
| ------------ | -------------------------------------------------------- |
| `/`          | Redirects to `/dashboard`                                |
| `/login`     | Sign in                                                  |
| `/dashboard` | Month/week calendar; clicking a day shows who filed what |
| `/log`       | Full list of entries with uploader + file, newest first  |
| `/viewer`    | Full-page PDF/Markdown preview (opened in a new tab)     |

`/dashboard` and `/log` share the `_app` layout (sidebar, topbar, log store), so an
entry added on one page shows up on the other immediately. `/viewer` is a
standalone full-page route, meant to be opened in its own tab.

## Structure

```
src/
  api/
    client.ts          # fetch wrapper (JSON in/out, ApiError)
    auth.ts            # login(credentials) -> UserLoginResponse
  components/
    ui/                # shadcn/ui components (owned by you)
    calendar/
      calendar.tsx             # calendar root, owns navigation state
      calendar-toolbar.tsx     # prev/next/today + week|month switch
      calendar-month-view.tsx  # six-week month grid
      calendar-week-view.tsx   # single Mon–Sun row
      calendar-event.tsx       # entry pills shown inside cells
      calendar-day-dialog.tsx  # who uploaded what on the clicked day
    app-sidebar.tsx    # desktop sidebar + mobile drawer
    app-topbar.tsx     # page title, theme toggle, avatar
    user-avatar.tsx    # initials menu: identity text + logout
    user-label.tsx     # author initials/name/email chip
    attachment-actions.tsx # filename -> viewer tab, icon -> download
    log-provider.tsx   # in-memory log store shared by both pages
    brand.tsx / page-header.tsx / mode-toggle.tsx / theme-provider.tsx
  config/
    env.ts             # app name + VITE_API_BASE_URL
  constants/
    auth.ts            # auth endpoints + storage keys
    log.ts             # accepted file extensions + max size
    navigation.ts      # sidebar nav items
    routes.ts          # ROUTES map
    user.ts            # fallback demo user email
  hooks/
    use-calendar.ts        # view, cursor, weeks, navigation
    use-log-entries.ts     # consume the shared log store
    log-entries-context.ts # context definition
    use-current-user.ts    # username/email/initials from the session
  pages/
    auth/login.tsx         # LoginPage
    dashboard/index.tsx    # page header + calendar + add dialog
    log/
      index.tsx            # thin entrypoint, composes components/
      components/
        log-form-dialog.tsx  # title + attachment form
        file-dropzone.tsx    # click/drag upload with validation
        log-list.tsx         # newest-first list with delete
    viewer/
      index.tsx            # thin viewer page: header + preview
      components/
        markdown-viewer.tsx  # fetch + render Markdown (GFM)
        pdf-viewer.tsx       # native PDF viewer in an iframe
      hooks/
        use-attachment-url.ts # IndexedDB -> object URL / API URL
  routes/
    __root.tsx         # theme shell + not-found
    index.tsx          # / -> redirect to /dashboard
    login.tsx          # /login
    _app.tsx           # sidebar/topbar shell + LogProvider
    _app.dashboard.tsx # /dashboard
    _app.log.tsx       # /log
    viewer.tsx         # /viewer?src=…&name=…&type=…
  types/
    user.tsx           # User, UserLoginRequest, UserLoginResponse
    log.ts             # StudyLog, LogAttachment, StudyLogFormValues
    calendar.ts        # CalendarView
    index.ts           # type barrel
  utils/
    calendar.ts        # Monday-first date math + formatting
    file.ts            # validation, attachment kind, viewer URL
    attachment-store.ts # IndexedDB blobs for the new-tab viewer
    log.ts             # create/group/sort entries + demo seeds
    storage.ts         # save/read/clear session tokens
    user.ts            # email -> username/initials
    cn.ts / theme.ts   # className helper, theme context
  index.css            # Tailwind v4 + design tokens
  main.tsx             # createRouter + RouterProvider
```

## Pages vs routes

`src/routes/` holds **thin route files** that wire a URL to a page component. Page
components live in `src/pages/<area>/`. Keeping them separate means the router can
regenerate `routeTree.gen.ts` without touching page code, and pages stay testable.

```tsx
// src/routes/_app.dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '@/pages/dashboard'

export const Route = createFileRoute('/_app/dashboard')({ component: DashboardPage })
```

`pages/log/index.tsx` is deliberately just composition: it renders `LogList` and
`LogFormDialog` from `pages/log/components/` and nothing else. Same idea for the
dashboard, which only lays out `Calendar` (`components/calendar/`) plus the form
dialog.

Add a page by creating the component in `src/pages/` and a matching file in
`src/routes/`. The route tree regenerates while `npm run dev` is running (or on
`npm run build`); commit `src/routeTree.gen.ts`.

## Auth

Types use the `type` keyword only (no `interface`). `UserLoginRequest` is derived
from `User`, so credential shape stays in sync:

```ts
export type UserLoginRequest = Pick<User, 'email' | 'password'>

export type UserLoginResponse = {
  access_token: string
  refresh_token: string
}
```

The login page (`src/pages/auth/login.tsx`):

1. Collects `UserLoginRequest` state and calls `login()` from `src/api/auth.ts`.
2. On success, stores both tokens plus the email via `saveSession()`
   (`utils/storage.ts`) and navigates to `/dashboard`.
3. On `ApiError`, shows the server message; on a network failure, shows the API URL.

Point the app at your backend with `.env.local` (see `.env.example`):

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

The `_app` layout is **not** guarded yet, so `/dashboard` opens without a backend
(handy for UI work). To protect it, uncomment the `beforeLoad` guard sketched in
`src/routes/_app.tsx`:

```ts
beforeLoad: () => {
  if (!isAuthenticated()) throw redirect({ to: ROUTES.login })
}
```

The avatar in the topbar reads the stored session email (falling back to a demo
guest) to derive a username and initials. Its menu shows the name and email as
plain text with a single clickable item, **Log out**, which clears the session keys
and returns to `/login`.

## Study log data

`LogProvider` (`components/log-provider.tsx`) owns the entries and is mounted once in
`_app.tsx`, so the dashboard and `/log` stay in sync. It seeds four relative-date
demo entries from three demo users (`createSeedLogs()` in `utils/log.ts`) the first
time it mounts, so the uploader labels have something to show.

Every entry stores an `author` (`LogAuthor`: id, name, email) denormalised on the
log, because entries can outlive the account that filed them. New entries are
stamped with the signed-in email from `useCurrentUser()`, and the `UserLabel`
component (`components/user-label.tsx`) renders that identity as an initials badge
plus name (and email in the day dialog and log list). It is display-only.

Everything is **in memory** for now — a refresh resets the list. To wire the API,
replace the `addLog`/`removeLog` bodies with calls, or swap the provider for a query
cache; components consume it through `useLogEntries()` either way.

Attachments are validated in one place (`getLogFileError` in `utils/file.ts`):
`.pdf`, `.md`, `.markdown`, up to 10 MB. Each attachment keeps an object URL for
in-document previews and is also written to IndexedDB (`utils/attachment-store.ts`)
under its id, so the viewer can reopen it in a new tab. With a real backend, skip
IndexedDB and let the API serve the file.

## Attachments: download and viewer

`AttachmentActions` (`components/attachment-actions.tsx`) is shared by the log list
and the day dialog and does two things:

- the filename opens `/viewer?...` in a new tab,
- a download icon (with an accessible label) points at the file with the `download`
  attribute, so the browser saves it instead of navigating.

The viewer (`pages/viewer/`) decides how to render based on extension/MIME type:

- **PDF** — handed to the browser's native PDF viewer inside an `<iframe>`. No
  pdf.js, and zoom, pagination, search and print come for free.
- **Markdown** — fetched as text and rendered with `react-markdown` + `remark-gfm`
  inside a Tailwind Typography `prose` article. Rendering to React elements means
  inline HTML is escaped by default — no `dangerouslySetInnerHTML`.
- **Anything else** — a "preview not available" card with a download button.

The viewer receives `id`, `src`, `name`, `type`, and `size` in the query string. In
the demo the bytes come from IndexedDB because object URLs are tied to the document
that created them — a new tab cannot reuse them. `useAttachmentUrl` creates a fresh
object URL inside the viewer. When an id is not in IndexedDB it falls back to `src`,
which is the production path: point `src` at a signed API URL and the same page keeps
working, including the download button.

Ideas if you outgrow this:

- pdf.js / `react-pdf` when you need a custom toolbar, text selection layer or page
  controls instead of the browser's PDF UI.
- Shiki or `rehype-highlight` to syntax-highlight Markdown code blocks.
- Server-rendered first-page thumbnails for PDFs in the calendar and list.
- Serve files with `Content-Disposition: inline` for viewing and
  `Content-Disposition: attachment` on a separate download URL.

## Calendar and the day dialog

`components/calendar/calendar.tsx` is the only place that owns calendar state; it
delegates to `useCalendar()` for the current view (`month` | `week`), the cursor
date, the day grid, and prev/next/today navigation. Weeks are Monday-first, and the
month view always renders six rows so its height never jumps.

Every entry pill shows the uploader's initials, and entries in the week view show
the uploader's name. Clicking a day (in either view) opens
`calendar-day-dialog.tsx` for that date:

- date heading and a count of entries/people,
- each entry with its title, upload time, uploader label (name + email), and the
  attachment actions (filename opens the viewer, icon downloads),
- an empty state when nobody filed anything,
- **Add log for this day**, which closes the detail dialog and opens the form
  already filed under that date.

Date helpers (`utils/calendar.ts`) format local dates with `Intl` and use local
date keys (`yyyy-mm-dd`) instead of `toISOString()`, avoiding timezone drift.

## UI components

```bash
npx shadcn@latest add dialog   # adds src/components/ui/dialog.tsx
```

Config lives in `components.json` (style `radix-nova`, Lucide icons, Geist font,
`@/` alias, `cn` from `@/utils/cn`). Components are plain source files — edit freely.

## Theming

Design tokens are CSS variables in `src/index.css` (`:root` and `.dark`). The
`ThemeProvider` toggles the `dark` class on `<html>` and persists the choice under
`study-larping-theme` in localStorage, following the OS setting when set to `system`.
An inline script in `index.html` applies the theme before first paint.

Use the tokens through Tailwind utilities: `bg-background`, `text-muted-foreground`,
`border-border`, `ring-ring`, …

## Aliases

`@/` maps to `src/` in `vite.config.ts` and both `tsconfig.json` and
`tsconfig.app.json`. `baseUrl` is intentionally omitted (deprecated in TypeScript 6+).

## Notes

- ESLint ignores `src/routeTree.gen.ts`. `react-refresh/only-export-components` and
  `@typescript-eslint/only-throw-error` are disabled for `src/routes/**` because route
  files export `Route` and throw redirects as control flow.
- TanStack Router devtools render only in development and are tree-shaken out of
  production builds.
