# Task Management App

A production-ready MVP task management application built with Next.js App Router, MongoDB, and JWT authentication stored in HTTP-only cookies.

## Features
- User signup, login, logout, and current-user APIs
- JWT authentication stored in secure HTTP-only cookies
- Protected frontend routes for authenticated task management
- Per-user task CRUD backed by MongoDB and Mongoose
- Paginated task listing with status filtering and title search
- Structured JSON success and error responses
- Encrypted task descriptions at rest using the provided encryption helper

## Stack
- Next.js App Router
- MongoDB with Mongoose
- JWT auth in HTTP-only cookies
- bcryptjs password hashing
- Zod validation
- Tailwind CSS v4

## Environment Variables

Create `.env.local` with:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/task-management
JWT_SECRET=replace-with-a-secure-secret
TASK_ENCRYPTION_KEY=64-char-hex-string-for-aes-256-key
```

Generate a valid encryption key with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Available Routes

### Frontend
- `/` marketing landing page
- `/signup` sign-up form
- `/login` login form
- `/dashboard` protected task dashboard

### Utility APIs
- `GET /api/health`
- `GET /api/db-test`

### Auth APIs
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Task APIs
- `GET /api/tasks?page=1&limit=10&status=pending&search=report`
- `POST /api/tasks`
- `GET /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

Detailed payload and response notes are documented in `docs/api.md`.

## Behavior Notes
- Authentication is cookie-based and handled entirely on the server.
- Task data is scoped to the authenticated user on every task API.
- Validation failures return structured JSON with field-level errors.
- Protected pages redirect unauthenticated users to `/login`.
- The dashboard supports pagination, status filtering, and case-insensitive title search.

## Deployment Notes
- Configure the same environment variables in Vercel.
- Use a production MongoDB connection string before deployment.
- Cookie security automatically enables `secure: true` in production.
