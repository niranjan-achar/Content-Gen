# ContentGen Setup Instructions

## ✅ Completed Changes

1. **Groq AI Integration** - Real AI content generation using Llama 3.3 70B
2. **Demo User Removed** - Clean header without hardcoded user
3. **Database Ready** - Configured for Supabase persistence

---

## 🔑 Required Configuration

You need to provide two values to make the app fully functional:

### 1. Groq API Key

**Get your key:**
1. Go to https://console.groq.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_...`)

**Update the config:**
- Open `backend/.env`
- Replace `your-groq-api-key` with your actual Groq API key:
  ```
  GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
  ```

### 2. Supabase Database Password

**Get your password:**
1. Go to https://supabase.com/dashboard
2. Open your project: `hhawezsgcbosghieqduz`
3. Go to Settings → Database
4. Find your database password (or reset it if needed)

**Update the config:**
- Open `backend/.env`
- Replace `your_password` with your actual database password:
  ```
  DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.hhawezsgcbosghieqduz.supabase.co:5432/postgres
  ```

**Run the database schema:**
1. In Supabase dashboard, go to SQL Editor
2. Copy all content from `backend/db/schema.sql`
3. Paste and run it in the SQL Editor
4. This creates the tables and security policies

---

## 🚀 Start the Application

After updating both values above:

### Terminal 1 - Backend:
```powershell
cd backend
poetry run uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 2 - Frontend:
```powershell
cd frontend
npm run dev
```

Then open: http://localhost:5174

---

## 🎯 Features Now Working

✅ **AI Content Generation** - Using Groq's Llama 3.3 70B model
✅ **Blog Posts** - Professional, well-structured articles
✅ **Social Captions** - Engaging captions with emojis and hashtags
✅ **Tweets** - Compelling 280-character tweets
✅ **History** - All generated content saved to Supabase
✅ **Reminders** - Create, view, and delete reminders in Supabase
✅ **Dashboard** - Real-time stats from your database
✅ **Markdown Rendering** - Beautiful formatted content display

---

## 🔧 How It Works

### Content Generation Flow:
1. User submits topic + content type
2. Frontend sends request to `/generate/`
3. Backend calls Groq API with optimized prompts
4. Groq returns AI-generated content
5. Backend saves to Supabase `content_history` table
6. Frontend displays with Markdown rendering

### Fallback System:
- If Groq API key is missing/invalid → Uses LocalProvider (demo content)
- If Groq API fails → Automatically falls back to LocalProvider
- Never crashes, always returns content

### Database Tables:
- `content_history` - Stores all generated content
- `content_reminders` - Stores scheduled content reminders

---

## 🐛 Troubleshooting

**"Error generating content"**
- Check if backend is running (http://localhost:8000/health should show `{"status":"ok"}`)
- Verify Groq API key is correct in `backend/.env`
- Check backend terminal for error messages

**"Database connection failed"**
- Verify database password is correct in `backend/.env`
- Ensure schema.sql has been run in Supabase SQL Editor
- Check Supabase project is active

**"Connection refused"**
- Ensure backend is running on port 8000
- Ensure frontend is running on port 5174
- Check CORS settings in `backend/backend/main.py`

---

## 📝 API Endpoints

- `GET /health` - Health check
- `POST /generate/` - Generate content (requires: type, topic)
- `GET /history/` - Get all content history (optional: type filter)
- `DELETE /history/{id}` - Delete history item
- `GET /reminders/` - Get all reminders
- `POST /reminders/` - Create reminder
- `DELETE /reminders/{id}` - Delete reminder
- `GET /dashboard/stats` - Get dashboard statistics

---

## 🎨 Tech Stack

**Backend:**
- FastAPI 0.115.0
- Groq API (Llama 3.3 70B)
- Supabase PostgreSQL
- httpx for async HTTP

**Frontend:**
- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- react-markdown

---

## ⚡ Quick Test

After setup, try this:
1. Navigate to Generate page
2. Enter topic: "Artificial Intelligence"
3. Select type: "Blog Post"
4. Click Generate
5. You should see AI-generated blog post
6. Check History page - content saved
7. Check Dashboard - stats updated

Enjoy your AI-powered content generator! 🚀
