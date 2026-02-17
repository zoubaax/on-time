# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                        │
│                    React / Next.js / Vue.js                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                     EXPRESS.JS SERVER                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    MIDDLEWARE STACK                         │ │
│  │  1. Helmet (Security Headers)                              │ │
│  │  2. CORS (Cross-Origin)                                    │ │
│  │  3. Rate Limiting                                          │ │
│  │  4. Body Parser                                            │ │
│  │  5. Morgan (Logging)                                       │ │
│  │  6. Authentication (JWT)                                   │ │
│  │  7. Authorization (Role-based)                             │ │
│  │  8. Validation (Input sanitization)                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                        ROUTES                               │ │
│  │  /api/auth  →  Authentication endpoints                    │ │
│  │  /api/users →  User management endpoints                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     CONTROLLERS                             │ │
│  │  AuthController   →  Business logic for auth               │ │
│  │  UserController   →  Business logic for users              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                       MODELS                                │ │
│  │  UserModel  →  Data access layer                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Supabase Client
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      SUPABASE                                    │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │   PostgreSQL     │  │   Auth Service   │                    │
│  │   Database       │  │   (Google OAuth) │                    │
│  │                  │  │                  │                    │
│  │  • users table   │  │  • OAuth flow    │                    │
│  │  • RLS policies  │  │  • Session mgmt  │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ OAuth
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    GOOGLE OAUTH 2.0                              │
│                  Identity Provider                               │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────┐                                                    ┌─────────┐
│ Client  │                                                    │ Server  │
└────┬────┘                                                    └────┬────┘
     │                                                              │
     │  1. GET /api/auth/google                                    │
     ├────────────────────────────────────────────────────────────►│
     │                                                              │
     │  2. Return Google OAuth URL                                 │
     │◄────────────────────────────────────────────────────────────┤
     │                                                              │
     │  3. Redirect to Google                                      │
     ├──────────────────────┐                                      │
     │                      │                                      │
     │  4. User signs in    │                                      │
     │     with Google      │                                      │
     │                      │                                      │
     │  5. Google redirects │                                      │
     │     to Supabase      │                                      │
     │◄─────────────────────┘                                      │
     │                                                              │
     │  6. POST /api/auth/callback                                 │
     │     { access_token, refresh_token }                         │
     ├────────────────────────────────────────────────────────────►│
     │                                                              │
     │                                      7. Verify with Supabase│
     │                                      8. Get user data        │
     │                                      9. Create/update user   │
     │                                      10. Generate JWT tokens │
     │                                                              │
     │  11. Return user + JWT tokens                               │
     │◄────────────────────────────────────────────────────────────┤
     │                                                              │
     │  12. Store tokens in localStorage                           │
     │                                                              │
     │  13. Authenticated requests with Bearer token               │
     ├────────────────────────────────────────────────────────────►│
     │                                                              │
```

## MVC Pattern Implementation

```
┌─────────────────────────────────────────────────────────────────┐
│                           REQUEST                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     ROUTES      │
                    │  (URL Mapping)  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   MIDDLEWARE    │
                    │  • Auth         │
                    │  • Validation   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  CONTROLLERS    │
                    │ (Business Logic)│
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     MODELS      │
                    │  (Data Access)  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    DATABASE     │
                    │   (Supabase)    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    RESPONSE     │
                    │     (JSON)      │
                    └─────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: Network Security                                        │
│  • HTTPS only in production                                      │
│  • CORS with whitelist                                           │
│  • Rate limiting (100 req/15min general, 20 req/15min auth)     │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Layer 2: HTTP Security                                           │
│  • Helmet.js (CSP, XSS protection, etc.)                        │
│  • Input validation & sanitization                               │
│  • SQL injection prevention (Supabase parameterized queries)    │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Layer 3: Authentication                                          │
│  • JWT tokens (short-lived access, long-lived refresh)          │
│  • Secure token storage (httpOnly cookies recommended)          │
│  • Token verification on every protected route                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Layer 4: Authorization                                           │
│  • Role-based access control (admin/user)                       │
│  • Endpoint-level permissions                                   │
│  • Self-modification prevention (can't change own role)         │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ Layer 5: Database Security                                       │
│  • Row Level Security (RLS) policies                            │
│  • Service role key kept server-side only                       │
│  • Encrypted connections                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: User Sign In

```
1. Client clicks "Sign in with Google"
   ↓
2. Client requests OAuth URL from server
   GET /api/auth/google
   ↓
3. Server returns Google OAuth URL
   ↓
4. Client redirects to Google
   ↓
5. User authenticates with Google
   ↓
6. Google redirects to Supabase callback
   ↓
7. Supabase processes OAuth response
   ↓
8. Client receives Supabase tokens
   ↓
9. Client sends tokens to server
   POST /api/auth/callback
   { access_token, refresh_token }
   ↓
10. Server verifies token with Supabase
    ↓
11. Server gets user data from Supabase
    ↓
12. Server checks if user exists in database
    ↓
13. If new user: Create user record
    If existing: Retrieve user record
    ↓
14. Server generates JWT tokens
    ↓
15. Server returns user data + JWT tokens
    ↓
16. Client stores tokens
    ↓
17. Client uses JWT for subsequent requests
```

## Role-Based Access Control

```
┌─────────────────────────────────────────────────────────────────┐
│                         ENDPOINTS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PUBLIC (No authentication required)                             │
│  • GET  /api/health                                             │
│  • GET  /api/auth/google                                        │
│  • POST /api/auth/callback                                      │
│  • POST /api/auth/refresh                                       │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  AUTHENTICATED (Any logged-in user)                              │
│  • GET  /api/auth/profile                                       │
│  • POST /api/auth/signout                                       │
│  • PATCH /api/users/profile/me                                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ADMIN ONLY (role = 'admin')                                     │
│  • GET    /api/users                                            │
│  • GET    /api/users/:id                                        │
│  • PATCH  /api/users/:id/role                                   │
│  • DELETE /api/users/:id                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│ Backend Framework                                                │
│  • Express.js 4.x                                               │
│  • Node.js 18+                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Database & Auth                                                  │
│  • Supabase (PostgreSQL + Auth)                                 │
│  • @supabase/supabase-js                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Security                                                         │
│  • helmet (HTTP headers)                                        │
│  • cors (Cross-origin)                                          │
│  • express-rate-limit (DDoS protection)                         │
│  • jsonwebtoken (JWT)                                           │
│  • express-validator (Input validation)                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Utilities                                                        │
│  • morgan (Logging)                                             │
│  • dotenv (Environment variables)                               │
│  • cookie-parser (Cookie handling)                              │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Considerations

```
Development
  • NODE_ENV=development
  • Detailed logging
  • CORS: localhost
  • No HTTPS required
  
Production
  • NODE_ENV=production
  • Minimal logging
  • CORS: production domain only
  • HTTPS required
  • Environment variables in secure vault
  • Rate limiting stricter
  • Database connection pooling
  • Load balancing
  • CDN for static assets
```
