# LeadPulze Prototype -> Engineering Handoff

## 1. Purpose

This prototype should be used as the UX and behavior baseline for the first production-ready version of LeadPulze.

Audience:
- Engineering team (frontend/backend)
- QA
- Design

Goal:
- Convert current prototype behavior into a stable, testable, API-backed application.

## 2. Product Summary

LeadPulze is a CRM workflow tool for managing leads, team members, and rep performance.

Primary modules:
- Leads management
- Team management
- Rep lead drill-down
- Settings (organization + team access + invites)
- User profile
- Global notifications

## 3. Current Prototype Scope (Must Preserve)

Routes:
- `/leads`
- `/leads/:id`
- `/teams`
- `/teams/:id`
- `/settings`
- `/profile`

Layout:
- Desktop: left sidebar + content area
- Mobile: top bar + hamburger + drawer sidebar

Key behavior:
- Expandable lead rows with in-context details
- Inline editing of lead fields on Leads page
- Team member edit flow (email required, add disabled on Teams page)
- Settings invite tracking (pending vs accepted)
- User/Admin access role assignment
- Organization name and industry editable in Settings
- Profile view/edit with save + cancel
- Notification bell on every page with invite/accept notifications

## 4. User Roles

For V1:
- `admin`
- `user`

Expected permissions (initial):
- `admin`: can edit members, assign roles, send invites
- `user`: read-only for role management and edit their own lead details (exact final permissions TBD)

## 5. Functional Requirements

## 5.1 Navigation & Layout
- Sidebar must include `Leads`, `Teams`, `Settings`, profile shortcut.
- Active route must be visually highlighted.
- On mobile, drawer must close after route selection.
- Notification bell must be visible top-right on all pages (desktop and mobile top bar).

Acceptance:
- No horizontal overflow in layout shell at common mobile widths (360px+).

## 5.2 Leads
- Display searchable/sortable/filterable lead table.
- Row expand/collapse for lead context panels.
- Inline edit for mapped lead fields.
- Persist updates through backend API (prototype currently local state).
- Expanded detail should not include Timeline/Source/Probability/Relationship & Urgency blocks.

Acceptance:
- Editing a field updates data and survives refresh.
- Expand/collapse state should not break table interactions.

## 5.3 Teams
- Show team member cards.
- Edit existing member details:
  - Email (required, validated)
  - Name (optional)
  - Access role (`user`/`admin`)
- Add member from Teams page is intentionally removed.

Acceptance:
- Invalid email blocks save with clear error message.

## 5.4 Rep Detail (`/teams/:id`)
- Show selected rep summary and KPIs.
- Show only leads assigned to selected rep.
- Row expansion must reveal rep lead detail cards.

Acceptance:
- Data is filtered strictly by `assignedRepId`.

## 5.5 Settings (Team Access)
- Organization section:
  - Editable `Organization Name`
  - Editable `Industry`
  - Save action with validation
- Show counts:
  - Pending invites
  - Accepted members
- Invite by email with role selection.
- Change role per existing member.
- Mark pending invite as accepted.
- Notifications section is intentionally removed from Settings.

Acceptance:
- Duplicate invite emails are blocked.
- Role change persists.
- Organization name/industry edits persist.

## 5.6 Profile
- Profile view mode:
  - Name, role, email, phone
  - Edit Profile CTA
- Edit mode:
  - First Name, Last Name, Role, Email, Phone
  - Save Changes / Cancel
- Email is mandatory.

Acceptance:
- Saved profile persists after reload.

## 5.7 Notifications
- Global notification bell with unread count.
- Notification types required for V1:
  - User invite received:
    - message: invited to organization
    - CTA route: `/settings`
  - Admin invite accepted:
    - message: invite accepted
    - CTA route: `/settings`
- Users should be able to:
  - open notification list
  - click a notification to route + mark read
  - mark all notifications read

Acceptance:
- Bell visible on every route.
- Invite/accept actions generate expected notification entries.
- Unread badge updates correctly.

## 6. Non-Functional Requirements

- Responsive support:
  - Mobile (360-767px)
  - Tablet/medium (768-1023px)
  - Desktop (1024px+)
- Accessibility baseline:
  - Keyboard-accessible controls
  - Visible focus states
  - Labels for form fields/buttons
- Performance:
  - Initial page load under agreed target (define with team)

## 7. Backend/Data Requirements (for dev implementation)

Replace prototype local state with API-backed persistence:

Entities:
- `Lead`
- `Rep/Member`
- `Invite`
- `Profile`
- `Notification`

Minimum API capabilities:
- CRUD/update for lead editable fields
- Get team members + update member
- Create invite + update invite status
- Update member role
- Get/update current user profile
- List notifications + mark read/mark all read
- Emit notification on invite created and invite accepted

## 8. Suggested Delivery Plan

Phase 1:
- Auth/session foundation
- API contracts + mock server
- Data model migrations

Phase 2:
- Leads module with persistence
- Teams + Rep detail integration

Phase 3:
- Settings invites + role management with permissions
- Profile integration
- Notifications integration (bell + read states)

Phase 4:
- QA hardening, accessibility pass, responsive regression testing

## 9. QA Acceptance Checklist

- [ ] All listed routes load without console errors
- [ ] Mobile sidebar opens/closes correctly
- [ ] Leads inline edit persists
- [ ] Teams edit validates email
- [ ] Rep page shows only selected rep leads
- [ ] Settings invite counts update correctly
- [ ] Role changes persist and reflect immediately
- [ ] Organization name/industry update flow works and persists
- [ ] Profile save/cancel behavior works and persists
- [ ] Notification bell visible globally and unread count updates
- [ ] User receives invite notification and can accept via Settings
- [ ] Admin receives invite accepted notification
- [ ] No blocking visual regressions at 360px, 768px, 1024px, 1440px

## 10. Open Product Decisions (Need PM + Eng Alignment)

- Final permission matrix for `user` vs `admin`
- Invite lifecycle states beyond pending/accepted
- Audit/history requirements for edits and role changes
- Whether profile role is editable by all users or admin-only
- Final error messaging and validation standards
- Notification retention policy (how long to keep)
- Real-time delivery needs (polling vs websocket vs refresh)

---

