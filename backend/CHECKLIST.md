# ✅ Setup Checklist

Use this checklist to ensure everything is configured correctly.

---

## 📋 Phase 1: Supabase Setup

### Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Click "New Project"
- [ ] Enter project name
- [ ] Choose database password (save it!)
- [ ] Select region
- [ ] Wait for project to initialize (~2 minutes)

### Get API Keys
- [ ] Go to Settings → API
- [ ] Copy Project URL → Save to `.env` as `SUPABASE_URL`
- [ ] Copy `anon` key → Save to `.env` as `SUPABASE_ANON_KEY`
- [ ] Copy `service_role` key → Save to `.env` as `SUPABASE_SERVICE_ROLE_KEY`

### Configure Google OAuth
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create new project (or select existing)
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 Client ID
- [ ] Set Application type: Web application
- [ ] Add Authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
- [ ] Copy Client ID and Client Secret
- [ ] Go to Supabase → Authentication → Providers
- [ ] Enable Google provider
- [ ] Paste Client ID and Client Secret
- [ ] Click Save

### Create Database Schema
- [ ] Go to Supabase → SQL Editor
- [ ] Open `database/schema.sql` from this project
- [ ] Copy all SQL code
- [ ] Paste into SQL Editor
- [ ] Click Run (or Ctrl+Enter)
- [ ] Verify "Success" message
- [ ] Go to Table Editor
- [ ] Confirm `users` table exists

---

## 📋 Phase 2: Backend Setup

### Install Dependencies
- [ ] Open terminal in `backend` folder
- [ ] Run `npm install`
- [ ] Wait for installation to complete
- [ ] Verify no errors

### Configure Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in `SUPABASE_URL` (from Supabase)
- [ ] Fill in `SUPABASE_ANON_KEY` (from Supabase)
- [ ] Fill in `SUPABASE_SERVICE_ROLE_KEY` (from Supabase)
- [ ] Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- [ ] Fill in `JWT_SECRET` (use generated value)
- [ ] Set `CLIENT_URL` (your frontend URL, e.g., `http://localhost:3000`)
- [ ] Fill in `GOOGLE_CLIENT_ID` (from Google Console)
- [ ] Fill in `GOOGLE_CLIENT_SECRET` (from Google Console)
- [ ] Verify all values are correct
- [ ] Save `.env` file

### Start Development Server
- [ ] Run `npm run dev`
- [ ] Check for "✅ Supabase connection successful"
- [ ] Check for "✅ Server running in development mode"
- [ ] Check for "✅ Server listening on port 5000"
- [ ] Verify no error messages

---

## 📋 Phase 3: Testing

### Test Health Endpoint
- [ ] Open browser or Postman
- [ ] Go to `http://localhost:5000/api/health`
- [ ] Verify response: `{"success": true, "message": "API is running"}`

### Test Google OAuth URL
- [ ] GET `http://localhost:5000/api/auth/google`
- [ ] Verify you receive a Google OAuth URL
- [ ] URL should start with `https://accounts.google.com/o/oauth2/`

### Import Postman Collection (Optional)
- [ ] Open Postman
- [ ] Click Import
- [ ] Select `postman_collection.json`
- [ ] Collection imported successfully
- [ ] Test "Health Check" endpoint
- [ ] Test "API Root" endpoint

---

## 📋 Phase 4: Create Admin User

### Sign In with Google
- [ ] Build your frontend (or use Postman)
- [ ] Initiate Google OAuth flow
- [ ] Sign in with your Google account
- [ ] Complete OAuth callback
- [ ] Verify user created in database

### Promote to Admin
**Option 1: Supabase Dashboard**
- [ ] Go to Supabase → Table Editor
- [ ] Click on `users` table
- [ ] Find your user record
- [ ] Click on `role` field
- [ ] Change from `user` to `admin`
- [ ] Click checkmark to save

**Option 2: SQL Query**
- [ ] Go to Supabase → SQL Editor
- [ ] Run: `UPDATE users SET role = 'admin' WHERE email = 'your-email@gmail.com';`
- [ ] Verify "Success" message

### Verify Admin Access
- [ ] Get new access token (sign in again)
- [ ] Test admin endpoint: GET `/api/users`
- [ ] Verify you can see all users
- [ ] Verify no "Access denied" error

---

## 📋 Phase 5: Security Verification

### Environment Variables
- [ ] `.env` file is in `.gitignore`
- [ ] Never committed `.env` to git
- [ ] `JWT_SECRET` is at least 32 characters
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is kept secret

### CORS Configuration
- [ ] `CLIENT_URL` in `.env` matches your frontend URL
- [ ] Test CORS from your frontend
- [ ] Verify no CORS errors in browser console

### Rate Limiting
- [ ] Make 25+ requests to auth endpoint quickly
- [ ] Verify rate limit kicks in
- [ ] Receive "Too many requests" message

### JWT Tokens
- [ ] Access token works for authenticated endpoints
- [ ] Expired token returns 401 error
- [ ] Refresh token generates new access token

---

## 📋 Phase 6: Documentation Review

### Read Documentation
- [ ] Read `README.md` - Full documentation
- [ ] Read `QUICK_START.md` - Quick setup guide
- [ ] Read `API_ENDPOINTS.md` - API reference
- [ ] Read `SUPABASE_SETUP.md` - Supabase details
- [ ] Read `ARCHITECTURE.md` - System design
- [ ] Skim `DEPLOYMENT.md` - For future deployment
- [ ] Review `examples/frontend-integration.js` - Frontend code

### Understand Architecture
- [ ] Understand MVC pattern used
- [ ] Know where to add new endpoints
- [ ] Understand authentication flow
- [ ] Know how roles work
- [ ] Understand middleware stack

---

## 📋 Phase 7: Frontend Integration

### Setup Frontend Project
- [ ] Create React/Next.js project
- [ ] Install dependencies: `npm install @supabase/supabase-js`
- [ ] Create `.env.local` with frontend variables
- [ ] Copy auth service from `examples/frontend-integration.js`

### Implement Authentication
- [ ] Create AuthContext
- [ ] Create auth service
- [ ] Implement login page
- [ ] Implement OAuth callback page
- [ ] Implement protected routes
- [ ] Test sign in flow
- [ ] Test sign out flow

### Test Integration
- [ ] User can sign in with Google
- [ ] User receives JWT tokens
- [ ] Tokens stored in localStorage
- [ ] Protected routes work
- [ ] Admin routes work for admin users
- [ ] Regular users can't access admin routes

---

## 📋 Phase 8: Production Preparation

### Choose Hosting Platform
- [ ] Decided on hosting (Heroku, Railway, AWS, etc.)
- [ ] Read deployment guide for chosen platform
- [ ] Understand deployment process

### Production Environment
- [ ] Create production Supabase project (or use same)
- [ ] Generate new production JWT secret
- [ ] Set up production environment variables
- [ ] Configure production CORS
- [ ] Set up production Google OAuth credentials

### Security Hardening
- [ ] Review all environment variables
- [ ] Ensure HTTPS in production
- [ ] Test rate limiting
- [ ] Review RLS policies in Supabase
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Set up uptime monitoring

---

## 📋 Optional Enhancements

### Additional Features
- [ ] Add email/password authentication
- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Add user profile pictures upload
- [ ] Add audit logging
- [ ] Add API versioning

### Performance
- [ ] Implement Redis caching
- [ ] Add database indexes
- [ ] Enable compression
- [ ] Set up CDN

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Set up logging (Winston, Papertrail)
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Set up performance monitoring (New Relic)

---

## 🎯 Completion Criteria

You're done when:
- ✅ All Phase 1-4 items are checked
- ✅ API responds to all endpoints
- ✅ Google OAuth works end-to-end
- ✅ Admin user can access admin endpoints
- ✅ Regular users cannot access admin endpoints
- ✅ Frontend can authenticate users
- ✅ Tokens refresh automatically
- ✅ All documentation reviewed

---

## 🐛 Common Issues

### Issue: "Missing environment variables"
**Check:**
- [ ] `.env` file exists
- [ ] All variables from `.env.example` are filled
- [ ] No typos in variable names
- [ ] Server restarted after changing `.env`

### Issue: "Supabase connection failed"
**Check:**
- [ ] `SUPABASE_URL` is correct
- [ ] `SUPABASE_ANON_KEY` is correct
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is correct
- [ ] Supabase project is active
- [ ] Internet connection is working

### Issue: "Google OAuth not working"
**Check:**
- [ ] Google OAuth credentials are correct in Supabase
- [ ] Redirect URI matches exactly
- [ ] Google+ API is enabled
- [ ] OAuth consent screen is configured

### Issue: "Invalid token"
**Check:**
- [ ] Token hasn't expired
- [ ] `JWT_SECRET` matches the one used to generate token
- [ ] Token format is correct: `Bearer <token>`
- [ ] Using access token, not refresh token

### Issue: "Access denied"
**Check:**
- [ ] User is authenticated (has valid token)
- [ ] User has correct role for endpoint
- [ ] Token includes role in payload
- [ ] Middleware is applied to route

---

## 📞 Need Help?

1. **Check Documentation**
   - Review relevant `.md` files
   - Check examples folder

2. **Check Logs**
   - Server console output
   - Supabase logs
   - Browser console

3. **Test Endpoints**
   - Use Postman collection
   - Check response messages
   - Verify request format

4. **Review Code**
   - Check middleware order
   - Verify route definitions
   - Check controller logic

---

## 🎉 Congratulations!

When all checkboxes are complete, you have:
- ✅ A production-ready authentication API
- ✅ Secure Google OAuth integration
- ✅ Role-based access control
- ✅ Clean, maintainable code
- ✅ Comprehensive documentation
- ✅ Ready for deployment

**You're ready to build amazing applications!** 🚀

---

**Pro Tip**: Keep this checklist handy for future projects or when onboarding team members!
