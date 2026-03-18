# Architecture Explanation

## High-Level Design

This application is a monolithic full-stack Next.js application that keeps the UI, API routes, authentication logic, and data-access code in one repository.

### Layers

1. **Presentation layer**
   - Public landing page at `/`
   - Authentication pages at `/login` and `/signup`
   - Protected dashboard at `/dashboard`

2. **API layer**
   - Route handlers in `app/api/**`
   - JSON response helpers standardize success and error payloads

3. **Authentication layer**
   - Signup/login endpoints validate input with Zod
   - Passwords are hashed with bcryptjs
   - JWTs are signed server-side and written to an HTTP-only cookie
   - Protected APIs call `requireCurrentUser()` before accessing task data

4. **Persistence layer**
   - MongoDB is accessed through Mongoose
   - `User` stores identity/authentication data
   - `Task` stores task metadata and ownership via `userId`

5. **Security layer**
   - Task descriptions are encrypted before being persisted
   - Cookies are HTTP-only and become secure in production
   - Task APIs always scope queries to the authenticated user

## Request Flow

### Authentication flow

1. User submits signup/login form.
2. API route validates payload.
3. Server creates or verifies the user.
4. Server signs a JWT containing the user id.
5. JWT is stored in an HTTP-only cookie.
6. Future requests read that cookie to resolve the current user.

### Task flow

1. Dashboard issues requests to `/api/tasks`.
2. API reads the auth cookie and resolves the current user.
3. MongoDB queries are filtered by `userId`.
4. Task descriptions are encrypted on write and serialized on read.
5. Standard JSON responses are returned to the frontend.

## Data Model

### User

- `name`
- `email` (unique)
- `password` (hashed)
- `createdAt`
- `updatedAt`

### Task

- `userId` (owner)
- `title`
- `description` (encrypted at rest)
- `status` (`pending`, `in-progress`, `completed`)
- `createdAt`
- `updatedAt`

## Why this architecture works well

- **Fast to ship:** one Next.js codebase for UI and API.
- **Secure by default:** cookie-based auth and server-side access control.
- **Easy to deploy:** works cleanly with Vercel + MongoDB Atlas.
- **Easy to extend:** can add labels, due dates, teams, or audit logs without changing the overall structure.
