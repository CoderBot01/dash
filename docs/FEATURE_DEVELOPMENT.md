# Feature Development Guide

This document explains how to develop and extend the current LeadPulze application.

## 1. Tech Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui components
- React Router for navigation
- Local component state (`useState`, `useMemo`, `useEffect`)
- `sonner` for toast notifications

## 2. Project Structure

- `src/App.tsx`: Route registration
- `src/components/`
  - `DashboardLayout.tsx`: Global app shell, desktop sidebar + mobile drawer
  - `AppSidebar.tsx`: Navigation and profile shortcut
  - `InlineEditField.tsx`: Reusable inline editing used in lead tables
  - `KPICard.tsx`, `StatusBadge.tsx`: Display components
- `src/pages/`
  - `LeadsPage.tsx`: Main leads table + expandable detail rows
  - `LeadDetailPage.tsx`: Individual lead detail route
  - `TeamsPage.tsx`: Team member list + edit dialog
  - `RepDetailPage.tsx`: Rep-level lead table with expandable rows
  - `SettingsPage.tsx`: Team invite tracking + role management
  - `ProfilePage.tsx`: Profile view/edit
  - `NotFound.tsx`: Fallback route
- `src/data/mockData.ts`: Mock domain data and shared interfaces

## 3. Current Routes

Defined in `src/App.tsx`:

- `/` -> redirects to `/leads`
- `/leads`
- `/leads/:id`
- `/teams`
- `/teams/:id`
- `/settings`
- `/profile`
- `*` -> not found

## 4. Feature Breakdown

## 4.1 Dashboard Layout + Navigation

Files:
- `src/components/DashboardLayout.tsx`
- `src/components/AppSidebar.tsx`

Behavior:
- Desktop (`md+`): fixed left sidebar + scrollable content
- Mobile: top bar with hamburger, slide-out sidebar drawer, overlay close
- Sidebar includes links for Leads, Teams, Settings, and Profile

Extension tips:
- Add new navigation items in `navItems` inside `AppSidebar.tsx`
- Add the corresponding route in `App.tsx`
- Keep `onNavigate` callback on links so mobile drawer closes after tapping

## 4.2 Leads Feature

File: `src/pages/LeadsPage.tsx`

Behavior:
- Search + filters (rep, stage, intent)
- Sortable columns
- Expand/collapse per row for deeper lead context
- Inline edits via `InlineEditField`

Data source:
- `initialLeads` from `mockData.ts`
- Local mutable state `leadsData`

Notes:
- Table is horizontally scrollable on small screens
- Expanded details are stacked on mobile and two-column on large screens

Extension tips:
- To add a new editable field:
  1. Add property to `Lead` interface (`mockData.ts`)
  2. Add value in `initialLeads`
  3. Render `InlineEditField` and wire `updateLead`

## 4.3 Teams Feature

File: `src/pages/TeamsPage.tsx`

Behavior:
- Displays team cards
- Editing existing members only (Add Member removed)
- Edit dialog updates name, access role (`user`/`admin`), email
- Team card links to rep detail page (`/teams/:id`)

Notes:
- Uses local state initialized from `reps` mock data
- Email validation is regex-based in-page

Extension tips:
- If you need persistence, replace local state with API calls or localStorage

## 4.4 Rep Detail Feature

File: `src/pages/RepDetailPage.tsx`

Behavior:
- Rep summary and KPI cards
- Rep-specific leads table
- Expandable rows for detailed lead context
- Responsive table + mobile-friendly details layout

Data source:
- `reps` and `leads` from `mockData.ts`
- Filter by `assignedRepId === route param id`

## 4.5 Settings Feature (Team Access)

File: `src/pages/SettingsPage.tsx`

Behavior:
- Pending invites count
- Accepted members count
- Invite user by email with role (`user`/`admin`)
- Track invite status (`pending`/`accepted`)
- Change role per member

Notes:
- Current behavior is in-memory page state (not persisted to backend)

## 4.6 Profile Feature

File: `src/pages/ProfilePage.tsx`

Behavior:
- Profile view state + edit state
- Editable fields: firstName, lastName, role, email, phone
- Save validates email
- Persists profile in `localStorage` (`leadpulse_profile`)

Extension tips:
- For backend integration, replace localStorage read/write with API fetch/update

## 5. Data Model

Core interfaces are in `src/data/mockData.ts`:

- `Lead`
- `Rep`
- `Activity`
- `Message`

When adding fields:
- Update interface first
- Update mock data payloads
- Update page rendering/editing logic

## 6. Responsive Design Rules (Current)

- Layout shell:
  - desktop sidebar, mobile drawer
- Common container spacing:
  - `p-4 sm:p-6 lg:p-8`
- Data tables:
  - wrap in `overflow-x-auto`
  - use fixed min width for readable columns on small screens
- Detail grids:
  - stack on mobile (`grid-cols-1`)
  - split on large screens (`lg:grid-cols-[...]`)

## 7. Styling and Typography

- Global font stack is sans-serif in:
  - `src/index.css`
  - `tailwind.config.ts` (`theme.extend.fontFamily.sans`)
- Sidebar has a custom dark gradient visual style in `AppSidebar.tsx`

## 8. How to Add a New Feature (Recommended Flow)

1. Add route in `src/App.tsx`
2. Create page under `src/pages/`
3. Add sidebar entry (if navigable) in `AppSidebar.tsx`
4. Add/extend mock interfaces in `mockData.ts` if needed
5. Build reusable UI in `src/components/` when logic repeats
6. Make mobile-first responsive layout
7. Run:
   - `npm run build`

## 9. Known Gaps / Improvement Backlog

- No backend/API integration (mostly in-memory state)
- Team edits and settings invites are not shared globally
- No auth/session model (logout button is placeholder)
- No E2E tests yet

---

For quick onboarding, start by reading:

1. `src/App.tsx`
2. `src/components/DashboardLayout.tsx`
3. `src/components/AppSidebar.tsx`
4. `src/pages/LeadsPage.tsx`
5. `src/pages/SettingsPage.tsx`
