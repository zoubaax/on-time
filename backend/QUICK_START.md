# 🚀 Quick Start Guide

Get your Express + Supabase authentication API running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js installed (v18+)
- [ ] Supabase account created
- [ ] Google Cloud Console account

## Step 1: Supabase Setup (5 minutes)

### Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Save your database password
3. Wait for project initialization

### Get API Keys
1. Settings → API
2. Copy:
   - Project URL
   - `anon` key
   - `service_role` key

### Setup Google OAuth
1. Google Cloud Console → Create OAuth Client
2. Add redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
3. Copy Client ID & Secret
4. Supabase → Authentication → Providers → Google
5. Paste credentials → Save

### Create Database
1. Supabase → SQL Editor
2. Copy & run `database/schema.sql`
3. Verify `users` table exists

## Step 2: Backend Setup (2 minutes)

### Install Dependencies
```bash
cd backend
npm install
```

### Configure Environment
```bash
# Copy template
cp .env.example .env

# Edit .env with your values
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - JWT_SECRET (min 32 characters)
```

### Start Server
```bash
npm run dev
```

You should see:
```
✅ Supabase connection successful
✅ Server running in development mode
✅ Server listening on port 5000
```

## Step 3: Test API (1 minute)

### Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-..."
}
```

### Get Google OAuth URL
```bash
curl http://localhost:5000/api/auth/google
```

## Step 4: Create Admin User

### Option 1: Via Frontend
1. Sign in with Google
2. Supabase → Table Editor → users
3. Change your role to `admin`

### Option 2: Via SQL
```sql
UPDATE users SET role = 'admin' 
WHERE email = 'your-email@gmail.com';
```

## Step 5: Test with Postman (Optional)

1. Import `postman_collection.json`
2. Test endpoints
3. Tokens auto-save to variables

## 🎉 You're Done!

Your API is ready at: `http://localhost:5000/api`

## Next Steps

- [ ] Read `README.md` for full documentation
- [ ] Check `API_ENDPOINTS.md` for endpoint reference
- [ ] Review security settings in `src/app.js`
- [ ] Build your frontend integration
- [ ] Deploy to production

## Common Issues

**"Missing environment variables"**
→ Check your `.env` file has all required values

**"Supabase connection failed"**
→ Verify your Supabase URL and keys are correct

**"Google OAuth not working"**
→ Check redirect URI matches exactly in Google Console

## Need Help?

- 📖 Full docs: `README.md`
- 🔧 Supabase setup: `SUPABASE_SETUP.md`
- 📡 API reference: `API_ENDPOINTS.md`

---

**Estimated total time: 8 minutes** ⏱️
