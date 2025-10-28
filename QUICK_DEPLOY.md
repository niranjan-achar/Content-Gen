# 🚀 Quick Deploy Guide - ContentGen

## ⚡ Fastest Way to Deploy (5 Minutes)

### Step 1: Deploy Backend to Railway

1. **Go to Railway**: https://railway.app/new
2. **Sign in with GitHub**
3. Click **"Deploy from GitHub repo"**
4. Select **`Content-Gen`** repository
5. Click **"Add variables"**
6. Add these environment variables:

```
FRONTEND_ORIGIN=https://localhost:5173
CONTENT_PROVIDER=local
SUPABASE_JWKS_URL=https://YOUR_PROJECT_ID.supabase.co/auth/v1/.well-known/jwks.json
DATABASE_URL=postgresql://postgres.YOUR_PROJECT:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres
GROQ_API_KEY=gsk_your_groq_api_key_here
PORT=8000
```

7. In **Settings** → **General**:
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

8. Click **Deploy** - Railway will give you a URL like: `https://contentgen-backend-production.up.railway.app`

9. **Test it**: Open `https://your-backend-url.railway.app/health` - Should return `{"status":"ok"}`

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com/new
2. **Import** your `Content-Gen` repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add **Environment Variables**:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-backend-url.railway.app
```

5. Click **Deploy**

### Step 3: Update Backend CORS

1. Go back to **Railway**
2. Update the `FRONTEND_ORIGIN` environment variable:
```
FRONTEND_ORIGIN=https://your-vercel-app.vercel.app
```
3. Railway will automatically redeploy

### ✅ Done!

Your app is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **API Docs**: `https://your-backend.railway.app/docs`

---

## 🔍 Testing Your Deployment

1. Visit your Vercel URL
2. Try to sign up/login
3. Generate some content
4. Check that it saves to history

---

## 📝 Environment Variables Checklist

### Backend (Railway)
- [ ] `FRONTEND_ORIGIN` - Your Vercel frontend URL
- [ ] `CONTENT_PROVIDER` - Set to `local`
- [ ] `SUPABASE_JWKS_URL` - From Supabase Dashboard → Settings → API
- [ ] `DATABASE_URL` - From Supabase Dashboard → Settings → Database
- [ ] `GROQ_API_KEY` - From https://console.groq.com
- [ ] `PORT` - Set to `8000`

### Frontend (Vercel)
- [ ] `VITE_SUPABASE_URL` - From Supabase Dashboard → Settings → API
- [ ] `VITE_SUPABASE_ANON_KEY` - From Supabase Dashboard → Settings → API
- [ ] `VITE_API_URL` - Your Railway backend URL

---

## 🆘 Quick Troubleshooting

**Frontend can't connect to backend?**
- Check CORS: Make sure `FRONTEND_ORIGIN` in Railway matches your Vercel URL

**Authentication not working?**
- Verify Supabase credentials are correct
- Check that `SUPABASE_JWKS_URL` is accessible

**Content generation fails?**
- Verify `GROQ_API_KEY` is set correctly
- Check Railway logs for errors

**Database errors?**
- Make sure you're using the Transaction pool connection string from Supabase
- Verify Supabase project is active

---

## 💰 Cost Breakdown

### Free Tier Limits
- **Vercel**: Free for personal projects
- **Railway**: $5 free credit/month (≈500 hours)
- **Supabase**: Free tier (500MB database, 50,000 monthly active users)
- **Groq**: Free tier with rate limits

**Total Cost**: $0 for development/testing! 🎉

---

## 🎯 Next Steps

1. [ ] Set up custom domain in Vercel
2. [ ] Enable HTTPS (automatic in Vercel)
3. [ ] Set up monitoring/analytics
4. [ ] Configure production Supabase project
5. [ ] Set up CI/CD pipelines

---

## 📚 More Details

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

For project setup and development, see [README.md](README.md)
