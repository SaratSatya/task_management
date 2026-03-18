# Acceptance Criteria

## Auth
- User can register with name, email, password
- User can log in with email and password
- Auth token is stored in HTTP-only cookie
- User can log out successfully

## Tasks
- Authenticated user can create a task
- Authenticated user can read only their own tasks
- Authenticated user can update only their own tasks
- Authenticated user can delete only their own tasks

## Task fields
- title
- description
- status
- createdAt

## Listing
- Paginated listing
- Filter by status
- Search by title

## Error handling
- Validation errors return structured JSON
- Unauthorized access is blocked
- Server errors return structured JSON

## Deployment
- App should work on Vercel
- README must contain setup steps