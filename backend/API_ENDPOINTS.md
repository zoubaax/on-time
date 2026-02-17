# API Endpoints Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Google OAuth Sign Up/In
```http
GET /api/auth/google
```

### OAuth Callback
```http
POST /api/auth/callback
Body: { "access_token": "...", "refresh_token": "..." }
```

### Refresh Token
```http
POST /api/auth/refresh
Body: { "refreshToken": "..." }
```

### Get Profile
```http
GET /api/auth/profile
Headers: Authorization: Bearer <token>
```

### Sign Out
```http
POST /api/auth/signout
Headers: Authorization: Bearer <token>
```

## User Management (Admin Only)

### Get All Users
```http
GET /api/users
GET /api/users?role=admin
Headers: Authorization: Bearer <admin_token>
```

### Get User by ID
```http
GET /api/users/:id
Headers: Authorization: Bearer <admin_token>
```

### Update User Role
```http
PATCH /api/users/:id/role
Headers: Authorization: Bearer <admin_token>
Body: { "role": "admin" }
```

### Delete User
```http
DELETE /api/users/:id
Headers: Authorization: Bearer <admin_token>
```

### Update Own Profile
```http
PATCH /api/users/profile/me
Headers: Authorization: Bearer <token>
Body: { "full_name": "...", "avatar_url": "..." }
```

## Utility

### Health Check
```http
GET /api/health
```

### Root
```http
GET /
```
