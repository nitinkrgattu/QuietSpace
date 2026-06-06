# 🚢 QuietSpace Deployment Guide

## Prerequisites
- Vercel account (free tier works)
- Supabase project created
- GitHub repository

---

## Step 1: Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Navigate to **SQL Editor**
3. Run `database/schema.sql` — creates all tables, RLS policies, triggers
4. Optionally run `database/seed.sql` for demo data

**Get your credentials from Supabase Dashboard → Settings → API:**
- Project URL
- `anon` public key (for frontend)
- `service_role` secret key (for backend only)
- JWT Secret (Settings → API → JWT Settings)

---

## Step 2: Deploy Backend (Vercel)

```bash
cd backend
npm install -g vercel   # if not installed
vercel login
vercel --prod
```

**Set environment variables in Vercel Dashboard → backend project → Settings → Environment Variables:**

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Your service role key |
| `SUPABASE_JWT_SECRET` | Your JWT secret |
| `ALLOWED_ORIGINS` | Your frontend Vercel URL (add after frontend deploy) |
| `APP_ENV` | `production` |
| `DEBUG` | `false` |

Note your backend URL (e.g., `https://quietspace-api.vercel.app`)

---

## Step 3: Deploy Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

**Set environment variables in Vercel Dashboard → frontend project → Settings → Environment Variables:**

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your anon/public key |
| `VITE_API_URL` | Your backend Vercel URL from Step 2 |

---

## Step 4: Update CORS

After deploying the frontend, go back to your **backend** Vercel project and update `ALLOWED_ORIGINS` to include your frontend URL:

```
https://quietspace.vercel.app,http://localhost:5173
```

Redeploy the backend: `vercel --prod` from the `backend/` directory.

---

## Step 5: Verify Deployment

1. Visit your frontend URL
2. Register a new account
3. Complete a focus session
4. Check that data appears in Supabase Dashboard → Table Editor
5. Visit `https://your-backend.vercel.app/api/docs` for API documentation

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check `ALLOWED_ORIGINS` includes your frontend URL |
| Auth not working | Verify `VITE_SUPABASE_ANON_KEY` is the anon key (not service key) |
| API 401 errors | Check `SUPABASE_JWT_SECRET` matches Supabase JWT Settings |
| Build fails | Check all env vars are set in Vercel dashboard |
