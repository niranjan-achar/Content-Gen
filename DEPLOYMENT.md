# 🚀 Deploying ContentGen to Vercel

This guide will help you deploy the ContentGen application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub (✅ Already done!)
3. **Supabase Project**: Active Supabase project with database configured
4. **Groq API Key**: API key from [console.groq.com](https://console.groq.com)

## 🎯 Deployment Strategy

Since Vercel has limitations with Python backends, we'll deploy in two parts:

### Option 1: Frontend on Vercel + Backend Elsewhere (Recommended)

Deploy frontend to Vercel and backend to a Python-friendly platform like:
- **Railway** (easiest for FastAPI)
- **Render** (free tier available)
- **Fly.io** (great for Python apps)
- **Heroku** (paid)

### Option 2: Frontend Only on Vercel

Deploy just the frontend and use a separate backend deployment.

---

## 🚢 Option 1: Deploy Frontend to Vercel

### Step 1: Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository: `niranjan-achar/Content-Gen`
4. Click **Import**

### Step 2: Configure Frontend Build

In the Vercel project settings:

**Framework Preset:** Vite

**Root Directory:** `frontend`

**Build Command:** 
```bash
npm run build
```

**Output Directory:** 
```
dist
```

**Install Command:** 
```bash
npm install
```

### Step 3: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` | Supabase Dashboard → Settings → API |
| `VITE_API_URL` | `https://your-backend.railway.app` | Your backend deployment URL |

### Step 4: Deploy

Click **Deploy** and wait for the build to complete!

---

## 🐍 Deploy Backend to Railway (Recommended)

Railway is perfect for FastAPI applications and offers a free tier.

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose `Content-Gen` repository
4. Select **Add variables later**

### Step 3: Configure Backend

1. In Railway Dashboard, go to **Settings**
2. Set **Root Directory** to: `backend`
3. Set **Start Command** to:
```bash
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

### Step 4: Add Environment Variables

In Railway → Variables tab, add:

```env
FRONTEND_ORIGIN=https://your-frontend.vercel.app
CONTENT_PROVIDER=local
SUPABASE_JWKS_URL=https://YOUR_PROJECT.supabase.co/auth/v1/.well-known/jwks.json
DATABASE_URL=postgresql://postgres.YOUR_PROJECT:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=8000
```

### Step 5: Deploy

Railway will automatically deploy your backend and give you a public URL like:
`https://content-gen-production.up.railway.app`

### Step 6: Update Frontend

Go back to Vercel → Settings → Environment Variables and update:
- `VITE_API_URL` = Your Railway backend URL

Redeploy your Vercel frontend.

---

## 🚀 Alternative: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create New Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `contentgen-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### Step 3: Add Environment Variables

Same as Railway (see above).

### Step 4: Deploy

Render will deploy your backend and provide a URL.

---

## 📝 Quick Deploy Commands

### Deploy using Vercel CLI (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts and add environment variables
```

---

## ⚙️ Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Backend health check works: `https://your-backend.com/health`
- [ ] API docs accessible: `https://your-backend.com/docs`
- [ ] Frontend can connect to backend
- [ ] Supabase authentication works
- [ ] Content generation works
- [ ] All environment variables are set correctly
- [ ] CORS is configured for production URLs

---

## 🔧 Troubleshooting

### CORS Issues

Update backend `.env`:
```env
FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
```

### Database Connection Issues

Make sure you're using the **Transaction** mode connection string from Supabase, not the **Session** mode.

### Build Failures

Check:
- All dependencies are in `package.json` / `requirements.txt`
- Environment variables are set correctly
- Build commands are correct

### API Not Responding

- Check backend logs in Railway/Render
- Verify `GROQ_API_KEY` is set
- Ensure database migrations ran successfully

---

## 🎉 Success!

Your ContentGen application should now be live!

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.railway.app`
- **API Docs:** `https://your-backend.railway.app/docs`

---

## 📊 Monitoring

### Vercel

- Check deployment logs in Vercel Dashboard
- Monitor analytics and performance

### Railway/Render

- Check application logs
- Monitor resource usage
- Set up health checks

---

## 💡 Tips

1. **Use Production Database**: Don't use development database in production
2. **Enable Caching**: Configure caching in Vercel for better performance
3. **Set Up Custom Domain**: Add your custom domain in Vercel settings
4. **Enable Analytics**: Use Vercel Analytics for insights
5. **Monitor Costs**: Keep an eye on Railway/Render usage

---

## 🔐 Security Notes

1. Never commit `.env` files (✅ Already ignored)
2. Use environment variables for all secrets
3. Rotate API keys regularly
4. Enable Supabase Row Level Security
5. Set up proper CORS origins

---

Need help? Check the [main README](README.md) or create an issue on GitHub!
