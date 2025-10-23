# 🚀 ContentGen - Complete Setup & Deployment Guide

## 📁 Project Structure

```
C-Gen-3/
├── backend/              # FastAPI Python backend
│   ├── backend/
│   │   ├── __init__.py
│   │   ├── main.py       # FastAPI app entry
│   │   ├── db.py         # Database connection
│   │   ├── routers/      # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── generate.py
│   │   │   ├── history.py
│   │   │   └── reminders.py
│   │   ├── providers/    # Content generation providers
│   │   │   └── manager.py
│   │   └── utils/
│   │       └── supabase_jwt.py
│   ├── tests/
│   ├── pyproject.toml
│   ├── Dockerfile
│   └── .env.template
│
├── frontend/             # React + TypeScript + Vite
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   └── Header.tsx
│   │   └── pages/
│   │       ├── SignIn.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Generator.tsx
│   │       ├── History.tsx
│   │       └── Reminders.tsx
│   ├── package.json
│   ├── Dockerfile
│   ├── tailwind.config.js
│   └── .env.template
│
├── supabase/
│   └── schema.sql        # Database schema + RLS policies
│
├── .github/workflows/
│   └── ci.yml
│
└── README.md
```

## 🎯 Features Implemented

### ✅ Backend (FastAPI + Python)
- **Authentication**: Supabase JWT validation with JWKS
- **Content Generation**: Pluggable provider system (Local/Groq)
- **CRUD Operations**: Full history and reminders management
- **Database**: Async PostgreSQL with `databases` library
- **API Documentation**: OpenAPI spec included

### ✅ Frontend (React + TypeScript + Vite)
- **Modern UI**: Gradient design with Tailwind CSS
- **Routing**: React Router with 5 pages
- **State Management**: React hooks
- **Responsive Design**: Mobile-friendly layouts
- **Features**:
  - Dashboard with stats
  - Content generator with type selection
  - History with filtering
  - Reminders management

### ✅ Database (Supabase Postgres)
- **Tables**: users, content_history, reminders
- **RLS Policies**: Row-level security enforced
- **Automatic**: User profile creation trigger
- **Indexes**: Performance optimized

### ✅ DevOps
- **Docker**: Both frontend & backend Dockerfiles
- **CI/CD**: GitHub Actions workflow
- **Environment**: Template files for secrets

## 🛠️ Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL (or Supabase account)
- Poetry (Python package manager)

### 1️⃣ Backend Setup

```powershell
cd backend

# Copy environment template
copy .env.template .env

# Edit .env and fill in:
# - SUPABASE_JWKS_URL (from your Supabase project)
# - DATABASE_URL (PostgreSQL connection string)
# - GROQ_API_KEY (optional, if using Groq)

# Install dependencies
pip install poetry
poetry install

# Run development server
poetry run uvicorn backend.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

API docs: `http://localhost:8000/docs`

### 2️⃣ Frontend Setup

```powershell
cd frontend

# Copy environment template
copy .env.template .env

# Edit .env and fill in:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
# VITE_API_URL=http://localhost:8000

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 3️⃣ Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run the SQL from `supabase/schema.sql`
4. Enable Google OAuth:
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your OAuth credentials
5. Copy your project URL and anon key to frontend `.env`

## 🐳 Docker Deployment

### Build Images

```powershell
# Backend
cd backend
docker build -t contentgen-backend .

# Frontend
cd frontend
docker build -t contentgen-frontend .
```

### Run with Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/contentgen
      - FRONTEND_ORIGIN=http://localhost:4173
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "4173:4173"

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: contentgen
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```powershell
docker-compose up
```

## ☁️ Cloud Deployment Options

### Backend Deployment

#### Option 1: Railway
1. Push code to GitHub
2. Go to https://railway.app
3. Create new project from GitHub repo
4. Select `/backend` as root directory
5. Add environment variables
6. Deploy

#### Option 2: Fly.io
```powershell
cd backend
fly launch
fly secrets set DATABASE_URL="your-db-url"
fly deploy
```

#### Option 3: Heroku
```powershell
cd backend
heroku create contentgen-api
heroku addons:create heroku-postgresql:mini
git push heroku main
```

### Frontend Deployment

#### Option 1: Vercel (Recommended)
```powershell
cd frontend
npm install -g vercel
vercel
```

#### Option 2: Netlify
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

#### Option 3: Cloudflare Pages
1. Connect GitHub repo
2. Framework preset: Vite
3. Build command: `npm run build`
4. Build output: `dist`

## 🧪 Testing

### Backend Tests
```powershell
cd backend
poetry run pytest -v
poetry run ruff check .
poetry run mypy backend
```

### Frontend Build
```powershell
cd frontend
npm run build
```

## 🔑 Environment Variables Reference

### Backend (.env)
```env
FRONTEND_ORIGIN=http://localhost:5173
CONTENT_PROVIDER=local  # or 'groq'
SUPABASE_JWKS_URL=https://YOUR_PROJECT.supabase.co/auth/v1/.well-known/jwks.json
DATABASE_URL=postgresql://user:pass@localhost:5432/contentgen
GROQ_API_KEY=your-groq-key  # Optional
```

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:8000
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/auth/validate` | Validate Supabase JWT |
| POST | `/generate` | Generate content |
| GET | `/history` | List content history |
| DELETE | `/history/{id}` | Delete history item |
| GET | `/reminders` | List reminders |
| POST | `/reminders` | Create reminder |
| PUT | `/reminders/{id}` | Update reminder |
| DELETE | `/reminders/{id}` | Delete reminder |

## 🎨 UI Color Palette

- **Primary Gradient**: Indigo → Purple → Pink
- **Backgrounds**: White with 10% opacity + backdrop blur
- **Accents**: 
  - Indigo: `#6366f1`
  - Purple: `#8b5cf6`
  - Pink: `#ec4899`

## 🔒 Security Notes

### Current Implementation
- JWT validation placeholder (needs JWKS caching)
- RLS policies enforced in database
- CORS configured for frontend origin

### Production Checklist
- [ ] Implement proper JWKS caching
- [ ] Add rate limiting
- [ ] Enable HTTPS everywhere
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CSP headers
- [ ] Add request validation middleware
- [ ] Set up secrets management (AWS Secrets Manager, etc.)

## 🚀 Next Steps

### High Priority
1. **Implement Groq Integration**: Add real AI content generation
2. **Complete Auth Flow**: Wire Supabase auth in frontend
3. **Real-time Updates**: Add Supabase subscriptions for live data
4. **Save to History**: Auto-save generated content
5. **User Context**: Pass authenticated user ID to backend

### Nice to Have
- [ ] Export history to PDF/DOCX
- [ ] Schedule reminders with notifications
- [ ] Content templates
- [ ] Analytics dashboard
- [ ] Share generated content
- [ ] Collaboration features
- [ ] Mobile app (React Native)

## 🆘 Troubleshooting

### Backend won't start
```powershell
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
poetry install --no-cache

# Check database connection
# Ensure DATABASE_URL is correct
```

### Frontend build fails
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Check Node version
node --version  # Should be 20+
```

### Database connection errors
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists
- Verify network connectivity

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Poetry Documentation](https://python-poetry.org/)
- [Vite Documentation](https://vitejs.dev/)

## 📝 License

This project is open source and available for your use.

## 🤝 Contributing

Feel free to fork, modify, and extend this project as needed!

---

**Built with ❤️ using FastAPI, React, TypeScript, and Supabase**
