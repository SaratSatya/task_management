# Task Management App

A production-ready task management application built with Next.js App Router, MongoDB, and JWT authentication stored in HTTP-only cookies.

## Public Access Checklist

Before handing this repository over, update the placeholders below with your actual links after deployment:

- **Live URL:** `https://<your-deployment-url>`
- **GitHub Repository:** `https://github.com/<your-org-or-user>/<your-repo>`

> This repository now includes setup instructions, architecture documentation, deployment guidance, and sample API request/response documentation. The only remaining manual step is publishing the app to your hosting account and replacing the placeholders above with the real URLs.

## Features

- User signup, login, logout, and current-user APIs
- JWT authentication stored in secure HTTP-only cookies
- Protected frontend routes for authenticated task management
- Per-user task CRUD backed by MongoDB and Mongoose
- Paginated task listing with status filtering and title search
- Structured JSON success and error responses
- Encrypted task descriptions at rest before persistence

## Tech Stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT in HTTP-only cookies
- **Validation:** Zod
- **Styling:** Tailwind CSS v4
- **Password Hashing:** bcryptjs

## Project Structure

```text
app/
  api/                 API route handlers
  (auth)/              login and signup pages
  dashboard/           protected task management UI
components/            shared client-side UI
lib/                   auth, env, DB, encryption, validation helpers
models/                Mongoose schemas
public/                static assets
docs/                  deployment, architecture, and API documentation
```

## Architecture Overview

The application uses a server-first Next.js architecture:

1. **UI layer**: App Router pages render the landing page, auth pages, and the protected dashboard.
2. **API layer**: Route handlers under `app/api/**` expose JSON endpoints for authentication, health checks, and task CRUD.
3. **Auth layer**: Successful login/signup issues a signed JWT that is stored in an HTTP-only cookie.
4. **Data layer**: Mongoose models persist users and tasks in MongoDB.
5. **Security layer**: Task descriptions are encrypted before being stored, and every task query is scoped to the authenticated user.

See [`docs/architecture.md`](docs/architecture.md) for the detailed architecture explanation.

## Environment Variables

Create `.env.local` with the following values:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/task-management
JWT_SECRET=replace-with-a-secure-secret
TASK_ENCRYPTION_KEY=64-char-hex-string-for-aes-256-key
```

Generate a valid encryption key with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` using the values shown above.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Run quality checks

```bash
npm run lint
npm run build
```

## Deployment Instructions

This project is ready to deploy to **Vercel** and can also run on any platform that supports Next.js server deployments.

### Recommended Vercel deployment

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Set the following environment variables in the Vercel project:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `TASK_ENCRYPTION_KEY`
4. Redeploy after confirming the environment variables are saved.
5. Copy the generated Vercel production URL into the **Live URL** placeholder above.

### Notes for production

- Use a hosted MongoDB instance such as MongoDB Atlas.
- Use a strong random `JWT_SECRET`.
- Use a 64-character hex key for `TASK_ENCRYPTION_KEY`.
- Secure cookies automatically enable `secure: true` in production.

## Routes

### Frontend routes

- `/` — marketing landing page
- `/signup` — sign-up form
- `/login` — login form
- `/dashboard` — protected task dashboard

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

## API Documentation

Sample requests and responses are documented in [`docs/api.md`](docs/api.md).

## Additional Documentation

- [Architecture explanation](docs/architecture.md)
- [API request/response samples](docs/api.md)
