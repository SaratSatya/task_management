# API Request and Response Documentation

All endpoints return JSON using a consistent envelope:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {}
}
```

Error responses follow the same pattern and may include field-level validation details:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email address"]
  }
}
```

## Authentication Endpoints

### POST `/api/auth/signup`

Creates a new user account and sets the auth cookie.

#### Sample request

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

#### Sample success response

```json
{
  "success": true,
  "message": "Signup successful",
  "data": {
    "user": {
      "id": "67f0b3d8d0b5f7c4ab123456",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-03-18T00:00:00.000Z",
      "updatedAt": "2026-03-18T00:00:00.000Z"
    }
  }
}
```

### POST `/api/auth/login`

Authenticates an existing user and sets the auth cookie.

#### Sample request

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "secret123"
}
```

#### Sample success response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "67f0b3d8d0b5f7c4ab123456",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-03-18T00:00:00.000Z",
      "updatedAt": "2026-03-18T00:00:00.000Z"
    }
  }
}
```

### GET `/api/auth/me`

Returns the currently authenticated user.

#### Sample success response

```json
{
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "user": {
      "id": "67f0b3d8d0b5f7c4ab123456",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-03-18T00:00:00.000Z",
      "updatedAt": "2026-03-18T00:00:00.000Z"
    }
  }
}
```

## Task Endpoints

> All task endpoints require the authentication cookie set by signup/login.

### POST `/api/tasks`

Creates a new task for the current user.

#### Sample request

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Prepare sprint review",
  "description": "Collect updates from engineering and design.",
  "status": "pending"
}
```

#### Sample success response

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": "67f0b4f5d0b5f7c4ab123457",
      "title": "Prepare sprint review",
      "description": "Collect updates from engineering and design.",
      "status": "pending",
      "createdAt": "2026-03-18T00:00:00.000Z",
      "updatedAt": "2026-03-18T00:00:00.000Z"
    }
  }
}
```

### GET `/api/tasks?page=1&limit=5&status=pending&search=sprint`

Returns a paginated list of the current user's tasks.

#### Sample success response

```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": {
    "items": [
      {
        "id": "67f0b4f5d0b5f7c4ab123457",
        "title": "Prepare sprint review",
        "description": "Collect updates from engineering and design.",
        "status": "pending",
        "createdAt": "2026-03-18T00:00:00.000Z",
        "updatedAt": "2026-03-18T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 1,
      "totalPages": 1
    },
    "filters": {
      "status": "pending",
      "search": "sprint"
    }
  }
}
```

### GET `/api/tasks/:taskId`

Fetches a single task owned by the current user.

#### Sample success response

```json
{
  "success": true,
  "message": "Task fetched successfully",
  "data": {
    "task": {
      "id": "67f0b4f5d0b5f7c4ab123457",
      "title": "Prepare sprint review",
      "description": "Collect updates from engineering and design.",
      "status": "pending",
      "createdAt": "2026-03-18T00:00:00.000Z",
      "updatedAt": "2026-03-18T00:00:00.000Z"
    }
  }
}
```

### PATCH `/api/tasks/:taskId`

Updates one or more fields on a task.

#### Sample request

```http
PATCH /api/tasks/67f0b4f5d0b5f7c4ab123457
Content-Type: application/json

{
  "status": "completed"
}
```

#### Sample success response

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "id": "67f0b4f5d0b5f7c4ab123457",
      "title": "Prepare sprint review",
      "description": "Collect updates from engineering and design.",
      "status": "completed",
      "createdAt": "2026-03-18T00:00:00.000Z",
      "updatedAt": "2026-03-18T00:05:00.000Z"
    }
  }
}
```

### DELETE `/api/tasks/:taskId`

Deletes a task owned by the current user.

#### Sample success response

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Utility Endpoints

### GET `/api/health`

Use this for uptime checks and deployment smoke tests.

### GET `/api/db-test`

Use this to verify MongoDB connectivity in a deployed environment.
