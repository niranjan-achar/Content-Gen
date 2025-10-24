# OAuth Authentication Setup Guide for ContentGen

## 🎯 Overview
This guide will help you set up OAuth authentication with Google and GitHub for your ContentGen application using Supabase.

---

## 📋 Step 1: Supabase Configuration

### A. URL Configuration
Go to your Supabase Dashboard → **Authentication** → **URL Configuration**

**Site URL:**
```
http://localhost:5173
```

**Redirect URLs (Click "Add URL" for each):**
```
http://localhost:5173
http://localhost:5173/auth/callback
```

**For Production (add later):**
```
https://yourdomain.com
https://yourdomain.com/auth/callback
```

---

## 🔑 Step 2: Google OAuth Setup

### A. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it: `ContentGen` or similar
4. Click **"Create"**

### B. Enable OAuth Consent Screen
1. In the left sidebar, go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** → Click **"Create"**
3. Fill in:
   - **App name:** `ContentGen`
   - **User support email:** Your email
   - **Developer contact:** Your email
4. Click **"Save and Continue"** through remaining steps

### C. Create OAuth Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Name it: `ContentGen Web Client`

5. **Add Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://hhawezsgcbosghieqduz.supabase.co
   ```

6. **Add Authorized redirect URIs:**
   ```
   https://hhawezsgcbosghieqduz.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   ```

7. Click **"Create"**
8. **Copy and save:**
   - ✅ **Client ID** (looks like: `123456789-abc...xyz.apps.googleusercontent.com`)
   - ✅ **Client Secret** (looks like: `GOCSPX-...`)

### D. Configure in Supabase
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** in the list
3. Toggle **"Enable Sign in with Google"** to ON
4. Paste:
   - **Client ID** (from step C.8)
   - **Client Secret** (from step C.8)
5. Click **"Save"**

---

## 🐙 Step 3: GitHub OAuth Setup (Optional)

### A. Create GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** `ContentGen`
   - **Homepage URL:** `http://localhost:5173`
   - **Authorization callback URL:** 
     ```
     https://hhawezsgcbosghieqduz.supabase.co/auth/v1/callback
     ```
4. Click **"Register application"**
5. **Copy and save:**
   - ✅ **Client ID**
   - Click **"Generate a new client secret"** → ✅ **Copy Client Secret**

### B. Configure in Supabase
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **GitHub** in the list
3. Toggle **"Enable Sign in with GitHub"** to ON
4. Paste:
   - **Client ID** (from step A.5)
   - **Client Secret** (from step A.5)
5. Click **"Save"**

---

## ✅ Step 4: Test the Setup

### A. Start Your Servers

**Terminal 1 - Backend:**
```powershell
cd backend
poetry run uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### B. Test OAuth Flow
1. Open browser: `http://localhost:5173`
2. Click **"Sign In"** button in header
3. Choose **"Continue with Google"** or **"Continue with GitHub"**
4. Complete the OAuth flow
5. You should be redirected back to the dashboard
6. Your profile picture and name should appear in the header

---

## 🔧 What Was Implemented

### New Files Created:
1. **`frontend/src/lib/supabase.ts`** - Supabase client configuration
2. **`frontend/src/contexts/AuthContext.tsx`** - Auth state management
3. **`frontend/src/pages/Login.tsx`** - OAuth login page
4. **`frontend/src/pages/AuthCallback.tsx`** - OAuth callback handler

### Modified Files:
1. **`frontend/src/App.tsx`** - Added AuthProvider and new routes
2. **`frontend/src/components/Header.tsx`** - Shows user profile and sign out

### Environment Variables:
Already configured in `frontend/.env`:
```env
VITE_SUPABASE_URL=https://hhawezsgcbosghieqduz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
VITE_API_URL=http://localhost:8000
```

---

## 🎨 Features Added

### Login Page (`/login`)
- Beautiful dark theme matching your dashboard
- Google OAuth button with logo
- GitHub OAuth button with logo
- Automatic redirect if already logged in

### Header Updates
- Shows user avatar and name when logged in
- "Sign Out" button
- "Sign In" button when logged out

### Protected Routes (Optional - can add later)
```tsx
// Example: Protect a route
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedPage() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />

  return <div>Protected Content</div>
}
```

---

## 🚀 Production Checklist

When deploying to production:

1. **Update Supabase URLs:**
   - Add your production domain to "Site URL"
   - Add production callback: `https://yourdomain.com/auth/callback`

2. **Update Google OAuth:**
   - Add production origins: `https://yourdomain.com`
   - Add production redirect: `https://yourdomain.com/auth/callback`

3. **Update GitHub OAuth:**
   - Update Homepage URL to production
   - Update callback URL to production

4. **Environment Variables:**
   - Update `VITE_SUPABASE_URL` if using custom domain
   - Update `VITE_API_URL` to production backend URL

---

## 🐛 Troubleshooting

### "Redirect URI mismatch" Error
- Double-check the redirect URIs in Google/GitHub match exactly
- Make sure to include both localhost AND Supabase URLs

### "Invalid client" Error
- Verify Client ID and Secret are copied correctly
- Check that OAuth consent screen is configured

### User Not Appearing in Header
- Check browser console for errors
- Verify Supabase URL and Anon Key in `.env`
- Make sure AuthProvider wraps the entire app

### CORS Errors
- Ensure your backend allows `http://localhost:5173` origin
- Check `backend/main.py` CORS configuration

---

## 📝 Next Steps

1. **Update API calls to use user ID:**
   - Use `user?.id` from `useAuth()` hook
   - Pass it to backend for user-specific data

2. **Add email/password auth (optional):**
   - Supabase supports email/password too
   - Add signup/login forms

3. **Add more OAuth providers:**
   - Microsoft, Twitter, Discord, etc.
   - Same process as Google/GitHub

4. **Protect routes:**
   - Add authentication checks to sensitive pages
   - Redirect to login if not authenticated

---

## 🎉 Summary

Your OAuth setup is complete! Users can now:
- ✅ Sign in with Google
- ✅ Sign in with GitHub
- ✅ See their profile in header
- ✅ Sign out securely

The auth state persists across page refreshes, and the JWT tokens are automatically managed by Supabase.

**Need help?** Check the Supabase docs: https://supabase.com/docs/guides/auth
