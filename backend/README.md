# Express + Supabase Authentication API

A production-ready REST API built with Express.js and Supabase, featuring Google OAuth authentication, role-based access control (Admin/User), and following MVC architecture with clean code principles.

## 🚀 Features

- ✅ **Google OAuth Authentication** via Supabase
- ✅ **Role-Based Access Control** (Admin & User roles)
- ✅ **JWT Token Management** (Access & Refresh tokens)
- ✅ **MVC Architecture** with clean separation of concerns
- ✅ **Security Best Practices**:
  - Helmet.js for HTTP headers security
  - CORS protection
  - Rate limiting
  - Input validation & sanitization
  - Row Level Security (RLS) in Supabase
- ✅ **Clean Code Principles**
- ✅ **Comprehensive Error Handling**
- ✅ **Request Logging** with Morgan

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Supabase client configuration
│   │   └── jwt.js               # JWT utilities
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   └── user.controller.js   # User management logic
│   ├── middlewares/
│   │   ├── auth.middleware.js   # Authentication & authorization
│   │   ├── error.middleware.js  # Error handling
│   │   └── validation.middleware.js # Input validation
│   ├── models/
│   │   └── User.model.js        # User data access layer
│   ├── routes/
│   │   ├── auth.routes.js       # Auth endpoints
│   │   ├── user.routes.js       # User endpoints
│   │   └── index.js             # Route aggregator
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server entry point
├── database/
│   └── schema.sql               # Supabase database schema
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- A Supabase account ([supabase.com](https://supabase.com))
- Google Cloud Console account (for OAuth)

### 2. Supabase Setup

#### A. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys

#### B. Configure Google OAuth in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. You'll need to create OAuth credentials in Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Add authorized redirect URIs:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
   - Copy the **Client ID** and **Client Secret**
4. Paste the credentials in Supabase Google provider settings
5. Save the configuration

#### C. Create Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the contents of `database/schema.sql`
3. Run the SQL script
4. Verify the `users` table was created

### 3. Backend Setup

#### A. Install Dependencies

```bash
cd backend
npm install
```

#### B. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Google OAuth (from Supabase Dashboard)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Where to find Supabase keys:**
- Go to **Project Settings** → **API**
- `SUPABASE_URL`: Project URL
- `SUPABASE_ANON_KEY`: anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key (⚠️ Keep this secret!)

#### C. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

### 4. Create Your First Admin User

1. Sign in with Google through your frontend
2. After successful sign-in, go to Supabase Dashboard → **Table Editor** → **users**
3. Find your user record and update the `role` column to `admin`

Alternatively, run this SQL in Supabase SQL Editor:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@gmail.com';
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Initiate Google OAuth Sign Up
```http
GET /api/auth/google
```

**Response:**
```json
{
  "success": true,
  "message": "Google OAuth initiated",
  "data": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

#### 2. Initiate Google OAuth Sign In
```http
GET /api/auth/google/signin
```
Same as sign up - Supabase handles both.

#### 3. Handle OAuth Callback
```http
POST /api/auth/callback
Content-Type: application/json

{
  "access_token": "supabase_access_token",
  "refresh_token": "supabase_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "avatar_url": "https://...",
      "role": "user"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

#### 4. Refresh Access Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### 5. Get Current User Profile
```http
GET /api/auth/profile
Authorization: Bearer <access_token>
```

#### 6. Sign Out
```http
POST /api/auth/signout
Authorization: Bearer <access_token>
```

### User Management Endpoints (Admin Only)

#### 1. Get All Users
```http
GET /api/users
Authorization: Bearer <admin_access_token>

# Optional: Filter by role
GET /api/users?role=admin
```

#### 2. Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <admin_access_token>
```

#### 3. Update User Role
```http
PATCH /api/users/:id/role
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "role": "admin"  // or "user"
}
```

#### 4. Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <admin_access_token>
```

#### 5. Update Own Profile
```http
PATCH /api/users/profile/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "full_name": "New Name",
  "avatar_url": "https://new-avatar-url.com/image.jpg"
}
```

### Health Check
```http
GET /api/health
```

## 🔐 Security Features

### 1. **Helmet.js**
Secures HTTP headers to prevent common vulnerabilities.

### 2. **CORS**
Configured to only allow requests from your frontend URL.

### 3. **Rate Limiting**
- General API: 100 requests per 15 minutes per IP
- Auth endpoints: 20 requests per 15 minutes per IP

### 4. **Input Validation**
All inputs are validated and sanitized using express-validator.

### 5. **JWT Authentication**
- Short-lived access tokens (7 days default)
- Long-lived refresh tokens (30 days default)
- Tokens include user ID, email, and role

### 6. **Row Level Security (RLS)**
Supabase RLS policies ensure users can only access their own data.

### 7. **Role-Based Access Control**
- `user`: Standard user access
- `admin`: Full access to user management

## 🎯 Frontend Integration Example

### React/Next.js Example

```javascript
// 1. Initiate Google OAuth
const handleGoogleSignIn = async () => {
  const response = await fetch('http://localhost:5000/api/auth/google');
  const data = await response.json();
  
  // Redirect user to Google OAuth
  window.location.href = data.data.url;
};

// 2. Handle OAuth callback (in your callback page)
const handleCallback = async () => {
  // Get tokens from URL or Supabase session
  const { access_token, refresh_token } = supabase.auth.session();
  
  const response = await fetch('http://localhost:5000/api/auth/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token, refresh_token })
  });
  
  const data = await response.json();
  
  // Store tokens in localStorage or secure storage
  localStorage.setItem('accessToken', data.data.tokens.accessToken);
  localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.data.user));
};

// 3. Make authenticated requests
const fetchProtectedData = async () => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch('http://localhost:5000/api/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// 4. Refresh token when expired
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('http://localhost:5000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await response.json();
  localStorage.setItem('accessToken', data.data.tokens.accessToken);
};
```

## 🧪 Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Get OAuth URL
curl http://localhost:5000/api/auth/google

# Get profile (replace with your token)
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:5000/api/auth/profile

# Get all users (admin only)
curl -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  http://localhost:5000/api/users
```

### Using Postman

1. Import the endpoints from this README
2. Set up environment variables for tokens
3. Test each endpoint

## 🚨 Common Issues & Solutions

### Issue: "Missing required environment variables"
**Solution:** Make sure all variables in `.env` are filled in correctly.

### Issue: "Supabase connection failed"
**Solution:** 
- Verify your Supabase URL and keys
- Check if the `users` table exists
- Ensure RLS policies are set up correctly

### Issue: "Invalid or expired token"
**Solution:** Use the refresh token endpoint to get a new access token.

### Issue: "Access denied. Insufficient permissions"
**Solution:** Make sure the user has the correct role (admin/user).

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGc...` |
| `JWT_SECRET` | Secret for JWT signing | Min 32 characters |
| `JWT_EXPIRES_IN` | Access token expiry | `7d`, `24h`, etc. |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `30d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | From Google Console |

## 🎓 Architecture Explanation

### MVC Pattern
- **Models** (`src/models/`): Data access layer, interacts with Supabase
- **Views**: JSON responses (no traditional views in REST API)
- **Controllers** (`src/controllers/`): Business logic and request handling

### Middleware Stack
1. **Security** (Helmet, CORS)
2. **Rate Limiting**
3. **Body Parsing**
4. **Logging** (Morgan)
5. **Authentication** (JWT verification)
6. **Authorization** (Role checking)
7. **Validation** (Input sanitization)
8. **Error Handling**

### Clean Code Principles Applied
- ✅ Single Responsibility Principle
- ✅ Separation of Concerns
- ✅ DRY (Don't Repeat Yourself)
- ✅ Meaningful naming conventions
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Security best practices

## 📄 License

ISC

## 👨‍💻 Author

Built with 20 years of backend development experience 😎

---

**Need help?** Check the code comments or create an issue!
