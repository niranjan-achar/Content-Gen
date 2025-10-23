# ContentGen

ContentGen is a personal content-generation dashboard (frontend + backend) scaffolded  with Supabase auth + Postgres storage.

This repository contains:

- `backend/` - FastAPI application (Python) providing generation + CRUD endpoints
- `frontend/` - Vite + React + TypeScript + Tailwind scaffold (starter)
- `supabase/schema.sql` - SQL schema + RLS policies for Supabase
- Dockerfiles and `.env.template` files

## Quick start (local - development)

### 1. Backend

Copy `backend/.env.template` to `backend/.env` and set values.

Install dependencies (recommended: Poetry):

```powershell
cd backend
pip install poetry
poetry install
poetry run uvicorn backend.main:app --reload --port 8000
```

### 2. Frontend

Copy `frontend/.env.template` to `frontend/.env` and fill Supabase values.

```powershell
cd frontend
npm install
npm run dev
```

### 3. Supabase

- Create a Supabase project and apply `supabase/schema.sql` via SQL editor.
- Configure Supabase OAuth (Google) and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in frontend env.

## Deployment options

- **Backend**: Dockerfile provided; deploy to Railway / Fly / Heroku. Set env vars from Supabase project.
- **Frontend**: Vite build + static hosting (Vercel/Netlify) or Docker image.

## Notes

This scaffold contains placeholders for production features: proper JWKS validation, DB wiring, provider integrations (Groq/OpenAI), and tests. Continue implementing these for production readiness.
