# API Documentation

All endpoints return structured JSON.

## Response Shape

### Success

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Human readable message",
  "errors": {
    "field": ["Validation message"]
  }
}
```

## Auth Endpoints

### `POST /api/auth/signup`
Create a user account and set the JWT cookie.

Request body:
- `name` string, minimum 2 characters
- `email` valid email
- `password` string, minimum 6 characters

### `POST /api/auth/login`
Authenticate an existing user and set the JWT cookie.

Request body:
- `email` valid email
- `password` string, minimum 6 characters

### `POST /api/auth/logout`
Clear the authentication cookie.

### `GET /api/auth/me`
Return the currently authenticated user.

## Task Endpoints

All task endpoints require the `task_manager_token` HTTP-only cookie.

### `GET /api/tasks`
List the authenticated user's tasks.

Query parameters:
- `page` number, default `1`
- `limit` number, default `10`, max `50`
- `status` one of `pending`, `in-progress`, `completed`
- `search` case-insensitive title search

### `POST /api/tasks`
Create a task for the authenticated user.

Request body:
- `title` string, required, max 100 characters
- `description` string, optional, max 2000 characters
- `status` one of `pending`, `in-progress`, `completed`

### `GET /api/tasks/:taskId`
Fetch a single task owned by the authenticated user.

### `PATCH /api/tasks/:taskId`
Update a task owned by the authenticated user.

Request body accepts any subset of:
- `title`
- `description`
- `status`

### `DELETE /api/tasks/:taskId`
Delete a task owned by the authenticated user.
