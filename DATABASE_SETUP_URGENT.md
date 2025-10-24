# 🔧 Quick Database Setup - URGENT FIX

## Problem: Redirect Not Working After Google Login

**Root Cause:** Missing database tables + Supabase redirect URL not configured

---

## ✅ Step 1: Configure Redirect URL in Supabase (2 minutes)

1. **Go to:** https://supabase.com/dashboard/project/rsleooojhxinbcurczlo

2. **Navigate to:** Authentication → URL Configuration

3. **Set Site URL:**
   ```
   http://localhost:5173
   ```

4. **Add Redirect URLs:**
   ```
   http://localhost:5173/**
   http://localhost:5173/auth/callback
   ```

5. **Click "Save"**

---

## ✅ Step 2: Create Database Tables (1 minute)

1. **Go to:** https://supabase.com/dashboard/project/rsleooojhxinbcurczlo

2. **Navigate to:** SQL Editor (left sidebar)

3. **Click:** "New Query"

4. **Copy & Paste** the entire content from:
   ```
   supabase/setup_database.sql
   ```

5. **Click:** "Run" (or press Ctrl+Enter)

6. **Wait** for success message: "Success. No rows returned"

---

## ✅ Step 3: Verify Tables Created

1. **Navigate to:** Table Editor (left sidebar)

2. **You should see:**
   - ✅ `content_history` table
   - ✅ `reminders` table

---

## ✅ Step 4: Test Login Again

1. **Clear browser cache:** Ctrl + Shift + Delete
2. **Go to:** http://localhost:5173
3. **Click:** "Continue with Google"
4. **Login** with Google
5. **Should redirect** to Dashboard ✅

---

## 🎯 What the SQL Script Does:

- ✅ Creates `content_history` table (stores generated content)
- ✅ Creates `reminders` table (stores user reminders)
- ✅ Enables Row Level Security (RLS)
- ✅ Sets up policies (only users can see their own data)
- ✅ Creates indexes for performance
- ✅ Grants proper permissions

---

## 🚨 Common Issues:

### Issue: "relation already exists"
**Solution:** Tables already created! You're good to go.

### Issue: Still not redirecting after login
**Solutions:**
1. Check browser console (F12) for errors
2. Verify redirect URLs in Supabase match exactly:
   ```
   http://localhost:5173/**
   http://localhost:5173/auth/callback
   ```
3. Clear browser cookies/cache
4. Try incognito mode

### Issue: "permission denied"
**Solution:** RLS policies may not be set. Re-run the SQL script.

---

## ✅ After Setup:

1. **Login works** → Redirects to dashboard
2. **Create reminder** → Saves to database
3. **Generate content** → Saves to history
4. **Data persists** → Even after refresh

---

**Run the SQL script NOW and test login again!** 🚀
