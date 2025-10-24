# 🔐 Google OAuth Setup Guide for ContentGen

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create/Select Project**: Click on project dropdown → "New Project" → Name it "ContentGen"
3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" → Click "CREATE"
   - Fill in:
     - App name: `ContentGen`
     - User support email: `your-email@gmail.com`
     - Developer contact: `your-email@gmail.com`
   - Click "SAVE AND CONTINUE"
   - Skip Scopes → Click "SAVE AND CONTINUE"
   - Add test users (your email) → Click "SAVE AND CONTINUE"

5. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `ContentGen Web Client`
   
   **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   https://rsleooojhxinbcurczlo.supabase.co
   ```
   
   **Authorized redirect URIs**:
   ```
   https://rsleooojhxinbcurczlo.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   ```
   
   - Click **CREATE**
   - **Copy** your Client ID and Client Secret

---

## Step 2: Configure Supabase

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/rsleooojhxinbcurczlo

2. **Set URL Configuration**:
   - Go to **Authentication** → **URL Configuration**
   - Set **Site URL**: `http://localhost:5173`
   - Add **Redirect URLs**:
     ```
     http://localhost:5173/**
     http://localhost:5173/auth/callback
     ```

3. **Enable Google Provider**:
   - Go to **Authentication** → **Providers**
   - Find **Google** and toggle it ON
   - Enter:
     - **Client ID**: (paste from Google Cloud Console)
     - **Client Secret**: (paste from Google Cloud Console)
   - Click **Save**

4. **Create Database Tables** (if not exists):
   Go to **SQL Editor** and run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase creates this automatically, but verify)
-- This should already exist with auth.users

-- Content History table
CREATE TABLE IF NOT EXISTS public.content_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('blog', 'caption', 'tweet')),
    input_text TEXT,
    generated_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic TEXT,
    date DATE,
    time TIME,
    daily BOOLEAN DEFAULT FALSE,
    repeat_days INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_history
CREATE POLICY "Users can view their own content history"
    ON public.content_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content history"
    ON public.content_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content history"
    ON public.content_history FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for reminders
CREATE POLICY "Users can view their own reminders"
    ON public.reminders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
    ON public.reminders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
    ON public.reminders FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
    ON public.reminders FOR DELETE
    USING (auth.uid() = user_id);
```

---

## Step 3: Test the Setup

1. **Start Backend**:
   ```bash
   cd backend
   poetry run uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test OAuth**:
   - Open http://localhost:5173
   - You should see "Sign in with Google" button
   - Click it → redirects to Google login
   - Login with Google account
   - Should redirect back to your app with user logged in

---

## Step 4: Verify Everything Works

✅ **Check Supabase Auth**:
- Go to **Authentication** → **Users**
- After login, you should see your Google account listed

✅ **Check Data Persistence**:
- Create a reminder
- Generate content and save to history
- Refresh page → data should persist
- Check Supabase **Table Editor** → see your data

---

## Troubleshooting

### Issue: "redirect_uri_mismatch"
**Solution**: Make sure redirect URIs in Google Cloud Console EXACTLY match:
```
https://rsleooojhxinbcurczlo.supabase.co/auth/v1/callback
```

### Issue: "Origin not allowed"
**Solution**: Add to Google Cloud Console Authorized JavaScript origins:
```
http://localhost:5173
```

### Issue: User data not saving
**Solution**: Run the RLS policies SQL again to ensure proper permissions

### Issue: "Invalid login credentials"
**Solution**: 
1. Check if Google Provider is enabled in Supabase
2. Verify Client ID/Secret are correct
3. Check if your email is added as test user in Google Cloud Console

---

## 🎉 You're All Set!

Your ContentGen app now has:
- ✅ Google OAuth authentication
- ✅ Supabase database with proper RLS
- ✅ Secure data persistence
- ✅ User-specific content and reminders

**Next Steps**:
- Customize the login page design
- Add more OAuth providers (GitHub, Discord, etc.)
- Deploy to production (update URLs accordingly)
