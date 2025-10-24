# 🔄 Database Schema Update Guide

## ✅ What's Changed:

### **1. Users Table (NEW!)**
- **Purpose**: Store user profile and generation statistics
- **Columns**:
  - `id` - UUID (references auth.users)
  - `name` - User's display name
  - `email` - User's email (unique)
  - `avatar_url` - Profile picture
  - `blogs_generated` - Count of blogs generated (auto-incremented)
  - `captions_generated` - Count of captions generated (auto-incremented)
  - `tweets_generated` - Count of tweets generated (auto-incremented)
  - `created_at`, `updated_at` - Timestamps

### **2. Content History Table (UPDATED)**
- **Change**: `user_id` now references `public.users(id)` instead of `auth.users(id)`
- **Why**: Allows for better stats tracking and user management

### **3. Reminders Table (UPDATED)**
- **Change**: `user_id` now references `public.users(id)` instead of `auth.users(id)`
- **Why**: Consistent foreign key relationships

### **4. Auto-increment Feature (NEW!)**
- **Trigger**: Automatically increments generation counts when content is created
- **How it works**:
  - User generates a blog → `blogs_generated` count increases by 1
  - User generates a caption → `captions_generated` count increases by 1
  - User generates a tweet → `tweets_generated` count increases by 1

### **5. Auto-create User Profile (NEW!)**
- **Trigger**: Automatically creates user profile when someone signs up with Google/GitHub
- **What it does**: Extracts name and email from auth.users and creates profile in public.users

---

## 🚀 How to Update Your Database:

### **Step 1: Go to Supabase SQL Editor**
1. Open: https://supabase.com/dashboard/project/rsleooojhxinbcurczlo
2. Click: **SQL Editor** (left sidebar)
3. Click: **New Query**

### **Step 2: Run the Updated Schema**
1. Copy ALL content from: `supabase/updated_schema.sql`
2. Paste into SQL Editor
3. Click: **Run** (or Ctrl+Enter)

### **Step 3: Verify Tables**
1. Go to: **Table Editor**
2. You should see:
   - ✅ `users` table (with generation count columns)
   - ✅ `content_history` table
   - ✅ `reminders` table

### **Step 4: Test the Trigger**
1. Check if trigger exists:
   ```sql
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'on_content_created';
   ```
2. Should see the trigger listed

---

## 🔧 Backend Changes Made:

### **1. New Users Router** (`backend/routers/users.py`)
- **GET /users/{user_id}** - Get user stats by ID
- **GET /users/email/{email}** - Get user stats by email

### **2. Updated Main App** (`backend/main.py`)
- Added users router to API

### **3. Updated Dashboard** (`frontend/src/pages/Dashboard.tsx`)
- Fetches user stats from `/users/{user_id}` endpoint
- Shows real-time generation counts

---

## 📊 API Endpoints:

### **Get User Stats**
```bash
GET /users/{user_id}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "blogs_generated": 5,
  "captions_generated": 12,
  "tweets_generated": 8,
  "total_generated": 25
}
```

---

## ✅ What Happens Now:

### **When User Signs Up with Google:**
1. Google OAuth creates user in `auth.users`
2. **Trigger fires** → Creates profile in `public.users`
3. User profile includes:
   - Name (from Google)
   - Email (from Google)
   - Generation counts (all start at 0)

### **When User Generates Content:**
1. Content saved to `content_history` table
2. **Trigger fires** → Increments appropriate count:
   - Blog → `blogs_generated++`
   - Caption → `captions_generated++`
   - Tweet → `tweets_generated++`
3. `updated_at` timestamp updated automatically

### **Dashboard Display:**
- Shows total generations
- Shows count per type (blogs, captions, tweets)
- Shows most used content type
- **All data comes from users table!**

---

## 🧪 Testing Steps:

### **1. Restart Servers**
```bash
.\stop.ps1
.\start.ps1
```

### **2. Login to App**
- Go to: http://localhost:5173
- Login with Google

### **3. Generate Content**
- Generate a blog
- Generate a caption
- Generate a tweet

### **4. Check Dashboard**
- Numbers should update automatically
- Shows accurate counts

### **5. Verify in Supabase**
```sql
SELECT * FROM public.users WHERE email = 'your-email@gmail.com';
```
Should show your generation counts!

---

## 🎯 Benefits:

✅ **Accurate Statistics** - Counts are tracked automatically  
✅ **No Manual Counting** - Database handles everything  
✅ **Fast Dashboard** - No need to count history records  
✅ **User Profiles** - Separate table for user info  
✅ **Auto-sync** - Auth signup automatically creates profile  
✅ **Consistent Data** - Foreign keys ensure data integrity  

---

## ⚠️ Important Notes:

1. **Existing Data**: If you have existing users/content, you may need to:
   - Manually create user profiles for existing auth.users
   - Run a migration script to populate counts from history

2. **New Users**: All new signups will automatically get a profile

3. **Generation Counts**: Only new content (created after schema update) will auto-increment counts

---

**Run the SQL script now to update your database!** 🚀
