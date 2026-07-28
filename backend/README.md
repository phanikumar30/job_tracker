# Trackr — Job Application Tracker (Backend)

Express + MongoDB (Mongoose) API matching the `realtime-project` frontend.

## 1. Setup

```bash
cd realtime-project-backend
npm install
cp .env.example .env     # fill in MONGO_URI and a real JWT_SECRET
npm run seed:admin        # creates the first admin account (see below)
npm run dev
```

Server starts on `http://localhost:5000` (or whatever `PORT` you set).
Health check: `GET /api/health`.

**⚠️ Before you push this anywhere:** `.env` is gitignored, but double-check
you never paste your real `MONGO_URI` or `JWT_SECRET` into a commit, a
chat, or a public repo issue. Anyone with your Mongo URI can read/write your
entire database; anyone with your JWT secret can mint valid tokens for any
user, including admin.

## 2. Why there's no public "admin sign-up"

`POST /api/auth/register` always creates a `student` account, full stop -
it ignores any `role` field sent in the body. If it didn't, anyone could
send `{ role: "admin" }` and grant themselves full access to every
student's data.

The **first** admin account is created once, offline, via:

```bash
npm run seed:admin
```

This reads `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env` and
inserts the account directly. Log in with it once, then change the
password. If you need more admins later, add a protected
`POST /api/admin/users` endpoint that only an existing admin can call -
never make it public.

## 3. Folder structure

```
server.js                 <- app entry point, middleware order lives here
src/
  config/db.js             <- Mongoose connection
  models/                  <- User, Application schemas
  middleware/
    auth.js                 <- protect() verifies JWT, requireRole() gates by role
    errorHandler.js         <- one place all errors get formatted into { message }
    rateLimiters.js          <- brute-force protection on auth routes
  controllers/              <- business logic, one file per resource
  routes/                   <- just wiring: URL -> middleware -> controller
  utils/
    generateToken.js
    seedAdmin.js
```

Controllers never trust the request body for identity or role - they read
`req.user` (set by `protect`), which comes from a verified JWT, not from
anything the client claims about itself.

## 4. API reference

All protected routes require `Authorization: Bearer <token>`.

### Auth
| Method | Route | Access | Body |
|---|---|---|---|
| POST | `/api/auth/register` | Public | `{ name, email, password }` → always creates a student |
| POST | `/api/auth/login` | Public | `{ email, password, role? }` |
| GET | `/api/auth/me` | Private | — |

### Applications (student only, scoped to the logged-in student)
| Method | Route | Query params |
|---|---|---|
| GET | `/api/applications` | `company, role, status, from, to` |
| POST | `/api/applications` | — |
| PUT | `/api/applications/:id` | — |
| DELETE | `/api/applications/:id` | — |

`status` must be one of `Applied / Interview / Offer / Rejected`.
`mode` must be one of `Online / In-person / Telephonic / Not Scheduled`.

### Admin only
| Method | Route | Notes |
|---|---|---|
| GET | `/api/admin/students` | List of students with `applicationCount` / `offerCount`, built with one aggregation query, not N+1 |
| GET | `/api/admin/students/:studentId/applications` | Same filters as above, read-only |

## 5. Security decisions worth understanding (not just copying)

- **Ownership checks on every write.** `updateApplication` and
  `deleteApplication` fetch the document first and compare
  `application.student` to `req.user._id` *before* touching it. Never trust
  that "if they know the `_id`, they're allowed to touch it."
- **Same error message for wrong email vs wrong password** on login. This
  is deliberate — it stops an attacker from using error messages to figure
  out which emails have accounts (account enumeration).
- **`express-mongo-sanitize`** strips `$` and `.` from incoming data, so a
  request body like `{ "email": { "$gt": "" } }` can't be used to bypass a
  `findOne` query — a classic NoSQL injection technique.
- **Rate limiting only on `/api/auth/*`.** That's where brute-force and
  credential-stuffing attacks target; rate-limiting the whole API would
  just make it slower for real users without adding much protection
  elsewhere.
- **`helmet()`** sets a batch of security-related HTTP headers (no
  clickjacking, no MIME sniffing, etc.) — one line, standard on every real
  Express app.
- **Stack traces are hidden in production** (`NODE_ENV=production`). In
  dev they're shown to help you debug; in prod they'd hand an attacker your
  file paths and dependency versions for free.

## 6. Where to go next

- **Refresh tokens** — right now a token is valid for the full `JWT_EXPIRES_IN`
  window with no way to revoke it early short of changing the secret. A
  refresh-token flow (short-lived access token + longer-lived refresh
  token, refresh tokens stored server-side so they can be revoked) is the
  standard next step.
- **Input validation library** (`zod` or `express-validator`) instead of
  manual `if (!x) throw` checks, once the schemas get more complex.
- **Pagination** on `GET /api/applications` and `GET /api/admin/students` -
  right now both return everything that matches the filter.
- **Integration tests** (`supertest` + `jest`) hitting a test Mongo instance
  — the kind of thing that separates "it worked when I clicked around" from
  "it's actually safe to deploy."
