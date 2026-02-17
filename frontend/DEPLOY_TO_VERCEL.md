# 🚀 How to Deploy Frontend to Vercel

Your frontend is ready! Follow these steps to put it online.

## 1. Push to GitHub
Make sure your latest code is pushed to your GitHub repository.
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 2. Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Import your `log` repository.

## 3. Configure Project Settings (CRITICAL)
In the "Configure Project" screen, do NOT click Deploy yet!

1. **Framework Preset**: Select **Vite** (Vercel usually detects this auto-magically).
2.  **Root Directory**: Click "Edit" and select `frontend`.
    *   *Why?* Because your React app lives inside the `frontend` folder, not the root.

## 4. Environment Variables
Local `.env` files are NOT uploaded to Vercel. You must add them manually in the "Environment Variables" section:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `VITE_SUPABASE_URL` | *[Your Supabase URL]* | Copy from local `.env` |
| `VITE_SUPABASE_ANON_KEY` | *[Your Anon Key]* | Copy from local `.env` |
| `VITE_API_URL` | `https://your-backend.railway.app/api` | **WAIT!** Read below. |

### ⚠️ Important Note on `VITE_API_URL`
Right now, your backend is at `http://localhost:5000`.
*   **Locally**: This works fine.
*   **On Vercel**: Your Vercel site cannot talk to your localhost!

**Temporary Solution:**
For now, set `VITE_API_URL` to `http://localhost:5000/api`.
*   *Result*: The site will load, but Login will fail 🔴.
*   *Fix*: Once we deploy the Backend (next step), you will come back here and update this variable with the **Real Backend URL**.

## 5. Click Deploy! 🚀
Vercel will build your site. In 1 minute, you will have a live URL (e.g., `https://log-frontend.vercel.app`).
