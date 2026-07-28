# Trackr — Job Application Tracker (Frontend)

React + Vite frontend for a MERN job tracker with Admin and Student roles.

## 1. Setup

```bash
cd realtime-project
npm install
cp .env.example .env   # then point VITE_API_BASE_URL at your Express server
npm run dev
```

## 2. Folder structure — and *why* it's shaped this way

```
src/
  api/            <- ALL network calls live here. Components never call axios directly.
  context/         <- AuthContext: single source of truth for "who is logged in".
  routes/          <- ProtectedRoute: gatekeeper for auth + role-based access.
  components/      <- Reusable, presentation-focused pieces (cards, forms, filters).
  pages/           <- One component per route. Pages compose components + api calls.
  utils/           <- Constants and pure helper functions, no side effects.
```

This is the same shape you'll find in most production React codebases (and
what interviewers usually check for when they say "show me a project"):
**components don't talk to the network directly.** Every request goes through
`src/api/*Service.js`, which goes through the single `axiosInstance.js`. That's
what makes it possible to add things like auth headers, retry logic, or a
loading spinner *for the whole app* in one place instead of forty.

## 3. How auth actually works here

- `AuthContext.jsx` holds `user` in React state, but persists the JWT + user
  object to `localStorage` so a page refresh doesn't log you out.
- `axiosInstance.js` attaches `Authorization: Bearer <token>` to every request
  automatically via a request interceptor.
- If the backend ever responds `401` (expired/invalid token), the response
  interceptor wipes storage and redirects to `/login` — you never get stuck
  in a "logged in but broken" state.
- `ProtectedRoute.jsx` checks role client-side for *routing/UX* purposes only.
  **This is not security** — your Express API must independently verify the
  JWT and role on every protected endpoint. Client-side checks can always be
  bypassed by editing the JS in devtools.

## 4. Backend contract this frontend expects

Build your Express + MongoDB routes to match this, or edit the service files
in `src/api/` to match your actual routes.

```
POST   /api/auth/register            { name, email, password, role }
POST   /api/auth/login               { email, password, role }
GET    /api/auth/me

GET    /api/applications             ?company&role&status&from&to   (student, own data only)
POST   /api/applications             { company, role, status, mode, appliedDate, response, notes }
PUT    /api/applications/:id
DELETE /api/applications/:id

GET    /api/admin/students                                  -> [{ _id, name, email, applicationCount, offerCount }]
GET    /api/admin/students/:id/applications  ?company&role&status&from&to
```

Every application document should have a `student` field (ObjectId ref) so
the backend can enforce "students only see their own data" and "admins can
see everyone's" at the database query level — never trust a student-supplied
ID in the request body for whose data to return.

## 5. Features implemented

- Role-based auth (student / admin) with protected routes
- Student: add / edit / delete job applications (company, role, status,
  interview mode, response, notes, applied date)
- Filtering by company, role, status, and date range — filters are sent to
  the server as query params, not applied client-side, so this scales past
  a handful of records
- Admin: overview table of all students with application/offer counts,
  drill-down into any one student's applications (read-only)
- Status shown as a visual pipeline (Applied → Interview → Offer, or a
  broken-off Rejected state) instead of a plain badge
- Toast notifications, empty states with a clear next action, loading states
- Auto-logout on expired/invalid token

## 6. Where to go next (things a stronger engineer adds)

- **Pagination** on `/api/applications` once a student has 50+ entries —
  don't fetch everything and slice client-side.
- **Debounce** the company/role text filters (e.g. 300ms) so you're not
  firing a network request on every keystroke.
- **React Query / TanStack Query** to replace the manual `useState` +
  `useEffect` data fetching once you're comfortable with the basics — it
  gives you caching, retries, and background refetching for free.
- **Form validation library** (e.g. `zod` + `react-hook-form`) instead of
  plain `useState` forms, once forms get more complex.
- **Role claims in the JWT itself**, not just in the `user` object, so the
  backend never has to trust a client-sent role field.
- **CI**: lint + build on every push (GitHub Actions), so broken code never
  reaches `main`.
