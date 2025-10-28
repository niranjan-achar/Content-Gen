# 🚀 ContentGen - AI-Powered Content Generation Platform

<div align="center">

![ContentGen Banner](https://img.shields.io/badge/ContentGen-AI%20Powered-blueviolet?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=for-the-badge&logo=typescript)

**Transform your ideas into engaging content with the power of AI**

[Features](#-features) • [Tech Stack](#️-tech-stack) • [Getting Started](#-getting-started) • [Workflow](#-workflow) • [API Documentation](#-api-documentation)

</div>

---

## 📖 About

**ContentGen** is a modern, full-stack AI content generation platform that helps you create high-quality blogs, social media captions, and tweets in seconds. Powered by advanced AI models like Llama and Groq, ContentGen combines cutting-edge technology with an intuitive user interface to streamline your content creation workflow.

Whether you're a content creator, marketer, or social media manager, ContentGen provides the tools you need to generate engaging content efficiently.

---

## ✨ Features

### 🎯 Core Features
- **🤖 Multi-Model AI Support**: Choose between Groq and Custom AI (Llama-3.2-3B) models
- **📝 Multiple Content Types**:
  - **Blogs**: Well-structured, markdown-formatted articles with headings and sections
  - **Captions**: Engaging social media captions with emojis and hashtags
  - **Tweets**: Compelling tweets under 280 characters
- **💾 Content History**: Save and review all your generated content
- **🔔 Smart Reminders**: Set reminders for content scheduling and follow-ups
- **🔐 Secure Authentication**: Powered by Supabase Auth with JWT tokens
- **🎨 Beautiful UI**: Modern, responsive interface with gradient backgrounds and smooth animations
- **🌓 Real-time Updates**: Instant content generation with loading states
- **📊 Dashboard**: Centralized view of your content generation activity

### 🛡️ Security Features
- JWT-based authentication
- Secure API key management
- Protected routes and middleware
- Database-level security with Row Level Security (RLS)

### 🎨 User Experience
- Responsive design for all devices
- Toast notifications for user feedback
- Loading states and error handling
- Intuitive navigation
- Debug panel for development

---

## 🏗️ Tech Stack

### Frontend
- **⚛️ React 18.2** - Modern UI library
- **🎨 TypeScript** - Type-safe development
- **⚡ Vite** - Lightning-fast build tool
- **🎨 Tailwind CSS** - Utility-first styling
- **🧭 React Router** - Client-side routing
- **📝 React Markdown** - Markdown rendering
- **🔐 Supabase Client** - Authentication & Database

### Backend
- **🐍 Python 3.11+** - Core language
- **⚡ FastAPI** - High-performance web framework
- **🦄 Uvicorn** - ASGI server
- **🔒 Python-JOSE** - JWT handling
- **🗄️ PostgreSQL** - Database (via Supabase)
- **🐘 Psycopg3** - PostgreSQL adapter
- **🌐 HTTPX** - Async HTTP client
- **🎨 Pydantic** - Data validation

### Infrastructure & Tools
- **☁️ Supabase** - Backend-as-a-Service (Auth + Database)
- **🤖 Groq API** - AI model inference
- **🦙 Llama 3.2** - Custom AI model
- **🐳 Docker** - Containerization (optional)
- **📦 Poetry** - Python dependency management
- **📦 npm** - Node package management

### DevOps
- **🧪 Pytest** - Testing framework
- **🔍 Ruff** - Python linting
- **🔍 MyPy** - Static type checking
- **📋 OpenAPI** - API documentation

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (v3.11 or higher)
- **Poetry** (Python dependency manager)
- **Git**
- **Supabase Account** (free tier available)

### 📋 Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/niranjan-achar/Content-Gen.git
cd Content-Gen
```

#### 2️⃣ Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to **SQL Editor** in your Supabase dashboard
3. Run the SQL schema from `supabase/sql_schema.sql` to set up:
   - Users table
   - Content history table
   - Reminders table
   - Auto-user creation triggers
   - Row Level Security policies

#### 3️⃣ Configure Environment Variables

##### Backend Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.template .env
```

Edit `backend/.env` with your credentials:

```env
# Frontend Origin (CORS)
FRONTEND_ORIGIN=http://localhost:5173

# Content Provider
CONTENT_PROVIDER=local

# Supabase Configuration
SUPABASE_JWKS_URL=https://YOUR_PROJECT_ID.supabase.co/auth/v1/.well-known/jwks.json

# Database (from Supabase Settings > Database)
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_ID:YOUR_PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres

# AI Model API Key (Get from https://console.groq.com)
GROQ_API_KEY=gsk_YOUR_GROQ_API_KEY_HERE
```

**🔑 How to Get Your Keys:**

- **SUPABASE_JWKS_URL**: Replace `YOUR_PROJECT_ID` with your Supabase project ID from Settings > API
- **DATABASE_URL**: Get from Supabase Dashboard > Settings > Database > Connection String (Transaction Mode)
- **GROQ_API_KEY**: Sign up at [console.groq.com](https://console.groq.com) and create an API key

##### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```bash
cd ../frontend
cp .env.template .env
```

Edit `frontend/.env` with your credentials:

```env
# Supabase Configuration (from Supabase Settings > API)
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE

# Backend API URL
VITE_API_URL=http://localhost:8000
```

**🔑 How to Get Your Keys:**

- **VITE_SUPABASE_URL**: Your Supabase project URL from Settings > API > Project URL
- **VITE_SUPABASE_ANON_KEY**: Your anonymous/public key from Settings > API > Project API keys > `anon` `public`

#### 4️⃣ Install Dependencies

##### Backend

```bash
cd backend
poetry install
```

##### Frontend

```bash
cd ../frontend
npm install
```

#### 5️⃣ Run the Application

You have two options:

##### Option A: Run from Root (Recommended)

From the project root directory:

```bash
python start.py
```

This will start both frontend and backend servers simultaneously.

##### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
poetry run uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### 6️⃣ Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🔄 Workflow

### System Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │ ◄─────► │  FastAPI Backend │ ◄─────► │  Supabase DB    │
│  (Port 5173)    │         │  (Port 8000)     │         │  (PostgreSQL)   │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     │
                                     │
                                     ▼
                            ┌──────────────────┐
                            │                  │
                            │   Groq AI API    │
                            │   (Llama 3.2)    │
                            │                  │
                            └──────────────────┘
```

### Content Generation Flow

1. **User Authentication**
   - User signs up/logs in via Supabase Auth
   - JWT token is issued and stored
   - User profile is auto-created in database

2. **Content Creation**
   - User selects content type (Blog/Caption/Tweet)
   - User enters topic/prompt
   - User selects AI model (Groq/Custom)
   - Request is sent to backend API

3. **AI Processing**
   - Backend validates JWT token
   - Request is forwarded to selected AI provider
   - AI generates content based on type-specific prompts
   - Response is formatted and returned

4. **Storage & Display**
   - Generated content is displayed to user
   - Content is saved to history (PostgreSQL via Supabase)
   - User can view, copy, or regenerate content

5. **Additional Features**
   - Users can set reminders for content scheduling
   - View history of all generated content
   - Access debug information (development mode)

### API Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

#### Content Generation
- `POST /generate/` - Generate content (blogs, captions, tweets)

#### History
- `GET /history/` - Get user's content history
- `POST /history/` - Save content to history
- `DELETE /history/{id}` - Delete history item

#### Reminders
- `GET /reminders/` - Get user's reminders
- `POST /reminders/` - Create new reminder
- `PUT /reminders/{id}` - Update reminder
- `DELETE /reminders/{id}` - Delete reminder

#### Utility
- `GET /health` - Health check endpoint
- `GET /model/info` - Get AI model information
- `GET /debug/env` - Debug environment variables (dev only)

---

## 🐳 Docker Support

Both frontend and backend include Dockerfiles for containerized deployment.

### Build & Run with Docker

**Backend:**
```bash
cd backend
docker build -t contentgen-backend .
docker run -p 8000:8000 --env-file .env contentgen-backend
```

**Frontend:**
```bash
cd frontend
docker build -t contentgen-frontend .
docker run -p 5173:5173 --env-file .env contentgen-frontend
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
poetry run pytest
```

### Run Specific Tests

```bash
poetry run pytest tests/test_health.py -v
```

---

## 📁 Project Structure

```
Content-Gen/
├── backend/                    # FastAPI backend
│   ├── backend/
│   │   ├── main.py            # Application entry point
│   │   ├── db.py              # Database connection
│   │   ├── supabase_client.py # Supabase client setup
│   │   ├── providers/         # AI provider implementations
│   │   │   ├── custom_model.py
│   │   │   └── manager.py
│   │   ├── routers/           # API route handlers
│   │   │   ├── auth.py        # Authentication routes
│   │   │   ├── generate.py    # Content generation
│   │   │   ├── history.py     # History management
│   │   │   ├── reminders.py   # Reminder CRUD
│   │   │   ├── users.py       # User management
│   │   │   └── debug.py       # Debug utilities
│   │   └── utils/             # Utility functions
│   │       └── supabase_jwt.py
│   ├── tests/                 # Test files
│   ├── pyproject.toml         # Poetry dependencies
│   ├── .env.template          # Environment template
│   └── Dockerfile             # Docker configuration
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── App.tsx            # Main application
│   │   ├── main.tsx           # Entry point
│   │   ├── components/        # Reusable components
│   │   │   ├── Header.tsx
│   │   │   └── Toast.tsx
│   │   ├── contexts/          # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Generator.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Reminders.tsx
│   │   │   └── Debug.tsx
│   │   └── lib/               # Utilities
│   │       ├── supabase.ts
│   │       └── notifications.ts
│   ├── package.json           # npm dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── .env.template          # Environment template
│   └── Dockerfile             # Docker configuration
│
├── supabase/
│   └── sql_schema.sql         # Database schema
│
├── start.py                   # Unified startup script
└── README.md                  # This file
```

---

## 🔧 Configuration Details

### Environment Variables Explained

#### Backend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `FRONTEND_ORIGIN` | CORS allowed origin | `http://localhost:5173` | Yes |
| `CONTENT_PROVIDER` | AI provider mode | `local` | Yes |
| `SUPABASE_JWKS_URL` | JWT verification URL | `https://xxx.supabase.co/auth/v1/.well-known/jwks.json` | Yes |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://postgres:pass@host:5432/db` | Yes |
| `GROQ_API_KEY` | Groq AI API key | `gsk_...` | Yes |

#### Frontend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` | Yes |
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` | Yes |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Niranjan Achar**

- GitHub: [@niranjan-achar](https://github.com/niranjan-achar)
- Project Link: [https://github.com/niranjan-achar/Content-Gen](https://github.com/niranjan-achar/Content-Gen)

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern, fast web framework
- [React](https://react.dev/) - UI library
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Groq](https://groq.com/) - Fast AI inference
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Llama](https://ai.meta.com/llama/) - Meta's open-source AI model

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/niranjan-achar/Content-Gen/issues) page
2. Create a new issue with detailed information
3. Review the API documentation at `/docs` endpoint

---

<div align="center">

**Made with ❤️ and AI**

⭐ Star this repo if you find it helpful!

</div>
