# 🚀 How to Deploy Backend to Vercel (Free!)

You chose the free route! Smart move. 💸

## 1. Push Code to GitHub
Ensure `backend/api/index.js` and `backend/vercel.json` are pushed.
```bash
git add .
git commit -m "Add Vercel serverless configuration"
git push origin main
```

## 2. Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Import your `log` repository **AGAIN**. (Yes, import the same repo a second time!).

## 3. Project Configuration (CRITICAL)
1. Give it a name like `log-backend`.
2. **Framework Preset**: Select **Other**.
3. **Root Directory**: Click "Edit" and select `backend`.
    *   This tells Vercel this project is *only* for the backend folder.

## 4. Environment Variables
Add your secrets (same as Railway, but now in Vercel):

| Variable Name | Value |
|--------------|-------|
| `SUPABASE_URL` | *[Your Supabase URL]* |
| `SUPABASE_ANON_KEY` | *[Your Anon Key]* |
| `SUPABASE_SERVICE_ROLE_KEY` | *[Your Service Role Key]* |
| `JWT_SECRET` | *[Your Secret]* |
| `JWT_EXPIRES_IN` | `1d` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | `https://[YOUR-FRONTEND-URL].vercel.app` |

## 5. Get Your Backend URL
After deployment, Vercel gives you a URL like: `https://log-backend.vercel.app`.

## 6. Update Frontend
Go to your **Frontend Project** in Vercel -> Settings -> Environment Variables.
Update `VITE_API_URL` to: `https://log-backend.vercel.app/api` (Don't forget the `/api`!).
Redeploy Frontend.

**🎉 DONE! Full Stack on Vercel (100% Free).**
