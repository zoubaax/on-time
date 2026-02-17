# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Project name
   - Database password (save this!)
   - Region (choose closest to your users)
4. Click "Create new project"
5. Wait for project to be ready (~2 minutes)

## Step 2: Get Your API Keys

1. In your project dashboard, click **Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these values to your `.env` file:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **IMPORTANT**: Never expose the `service_role` key in your frontend!

## Step 3: Configure Google OAuth

### A. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**:
   - Click "Enable APIs and Services"
   - Search for "Google+ API"
   - Click "Enable"
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen (if first time):
   - User Type: External
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
   - Save and continue through all steps
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Your app name
   - Authorized redirect URIs: Add this URL:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     Replace `<your-project-ref>` with your actual Supabase project reference
     (found in your Supabase project URL)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### B. Configure in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Enable the Google provider
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

### C. Configure Redirect URLs (Optional)

1. In **Authentication** → **URL Configuration**
2. Add your frontend URL to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   ```

## Step 4: Create Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `database/schema.sql`
4. Paste into the SQL editor
5. Click **Run** or press `Ctrl+Enter`
6. Verify success (you should see "Success. No rows returned")

## Step 5: Verify Setup

1. Go to **Table Editor**
2. You should see the `users` table
3. Click on it to verify columns:
   - id (uuid)
   - email (varchar)
   - full_name (varchar)
   - avatar_url (text)
   - role (varchar)
   - provider (varchar)
   - provider_id (text)
   - created_at (timestamptz)
   - updated_at (timestamptz)

## Step 6: Test Connection

1. Make sure your `.env` file is configured
2. Start your backend server:
   ```bash
   npm run dev
   ```
3. You should see:
   ```
   ✅ Supabase connection successful
   ✅ Server running in development mode
   ```

## Step 7: Create First Admin User

### Option A: Through Frontend (Recommended)

1. Start your frontend application
2. Click "Sign in with Google"
3. Complete the Google OAuth flow
4. After successful sign-in, go to Supabase Dashboard
5. **Table Editor** → **users** table
6. Find your user record
7. Click on the `role` field
8. Change from `user` to `admin`
9. Click the checkmark to save

### Option B: Using SQL

1. Go to **SQL Editor** in Supabase
2. Run this query (replace with your email):
   ```sql
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'your-email@gmail.com';
   ```

## Common Issues

### Issue: "Invalid redirect URI"
**Solution:** Make sure the redirect URI in Google Console exactly matches:
```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

### Issue: "Google OAuth not working"
**Solution:** 
- Verify Google+ API is enabled
- Check Client ID and Secret are correct in Supabase
- Clear browser cache and try again

### Issue: "Table doesn't exist"
**Solution:** Run the `schema.sql` script again in SQL Editor

### Issue: "RLS policy error"
**Solution:** Make sure you're using the `service_role` key in your backend, not the `anon` key for admin operations

## Security Checklist

- ✅ Never commit `.env` file to git
- ✅ Keep `service_role` key secret (backend only)
- ✅ Use `anon` key for frontend (if needed)
- ✅ Enable RLS on all tables
- ✅ Test RLS policies thoroughly
- ✅ Use HTTPS in production
- ✅ Rotate keys if compromised

## Next Steps

1. ✅ Supabase project created
2. ✅ Google OAuth configured
3. ✅ Database schema created
4. ✅ Backend connected
5. ✅ First admin user created
6. 🚀 Start building your frontend!

---

**Need help?** Check the [Supabase Documentation](https://supabase.com/docs) or the main README.md
